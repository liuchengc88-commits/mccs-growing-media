import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'data', 'competitors.json');
const REPORT_DIR = path.join(ROOT, 'reports', 'competitor-audit');
const TODAY = new Date().toISOString().slice(0, 10);

const DEFAULT_PRIMARY_ENGLISH_PAGES = [
  '/',
  '/products/',
  '/sample-shipping/',
  '/private-label/',
  '/about/',
  '/contact/',
  '/insights/'
];

const GROUP_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
  ignore: 3
};

const KEYWORDS = {
  cta: ['request', 'quote', 'contact', 'sample', 'buy', 'shop', 'download', 'learn', 'compare', 'talk', 'inquire'],
  trust: ['sgs', 'certified', 'certificate', 'factory', 'manufacturer', 'capacity', 'quality', 'tested', 'organic', 'sustainable', 'iso', 'global', 'export'],
  product: ['plug', 'coir', 'coco', 'peat', 'substrate', 'growing media', 'propagation', 'hydroponic', 'nursery', 'tray', 'block', 'pellet'],
  faq: ['what', 'how', 'why', 'can', 'do', 'does', 'which', 'when', 'where', 'faq']
};

function decodeEntities(value = '') {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)));
}

function cleanText(value = '') {
  return decodeEntities(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values) {
  return [...new Set(values.map(v => cleanText(v)).filter(Boolean))];
}

function extractTag(html, tag) {
  return unique([...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))].map(match => match[1]));
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    || html.match(/<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  return match ? decodeEntities(match[1]).trim() : '';
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? cleanText(match[1]) : '';
}

function extractLinks(html) {
  const links = [];
  for (const match of html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const text = cleanText(match[2]);
    if (!text) continue;
    links.push({ text, href: decodeEntities(match[1]) });
  }
  return links;
}

function extractJsonLdFaq(html) {
  const faqs = [];
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1].trim());
      const nodes = Array.isArray(data) ? data : [data];
      for (const node of nodes) {
        if (node?.['@type'] === 'FAQPage' && Array.isArray(node.mainEntity)) {
          for (const item of node.mainEntity) {
            if (item?.name) faqs.push(cleanText(item.name));
          }
        }
      }
    } catch {
      // Ignore invalid JSON-LD from external pages.
    }
  }
  return faqs;
}

function extractFaqs(html) {
  const summaries = extractTag(html, 'summary');
  const jsonLdFaqs = extractJsonLdFaq(html);
  const headingFaqs = [...extractTag(html, 'h2'), ...extractTag(html, 'h3')].filter(text => {
    const lower = text.toLowerCase();
    return lower.includes('?') || KEYWORDS.faq.some(keyword => lower.startsWith(`${keyword} `));
  });
  return unique([...summaries, ...jsonLdFaqs, ...headingFaqs]).slice(0, 20);
}

function extractSignals(html) {
  const text = cleanText(html).toLowerCase();
  const headings = [...extractTag(html, 'h1'), ...extractTag(html, 'h2'), ...extractTag(html, 'h3')];
  const links = extractLinks(html);
  const ctas = links.filter(link => KEYWORDS.cta.some(keyword => link.text.toLowerCase().includes(keyword))).slice(0, 20);
  const trustSignals = KEYWORDS.trust.filter(keyword => text.includes(keyword));
  const productSignals = unique(headings.filter(heading => KEYWORDS.product.some(keyword => heading.toLowerCase().includes(keyword)))).slice(0, 20);
  const imageMatches = [...html.matchAll(/<img\s+[^>]*>/gi)];
  const images = imageMatches.map(match => {
    const tag = match[0];
    const src = tag.match(/src=["']([^"']+)["']/i)?.[1] || '';
    const alt = tag.match(/alt=["']([^"']*)["']/i)?.[1] || '';
    return { src: decodeEntities(src), alt: decodeEntities(alt) };
  });
  const sellingPoints = unique(cleanText(html).split(/(?<=[.!?])\s+/).filter(sentence => {
    const lower = sentence.toLowerCase();
    return sentence.length >= 50 && sentence.length <= 220 && [...KEYWORDS.trust, ...KEYWORDS.product].some(keyword => lower.includes(keyword));
  })).slice(0, 12);

  return {
    title: extractTitle(html),
    metaDescription: extractMetaDescription(html),
    h1: extractTag(html, 'h1'),
    h2: extractTag(html, 'h2').slice(0, 30),
    ctas,
    faqs: extractFaqs(html),
    productCategories: productSignals,
    trustSignals,
    sellingPoints,
    imageLayout: {
      imageCount: images.length,
      imagesWithAlt: images.filter(image => image.alt).length,
      sampleAltText: images.map(image => image.alt).filter(Boolean).slice(0, 10)
    }
  };
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fetchHtml(url, settings) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), settings.requestTimeoutMs || 20000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': settings.userAgent || 'MCCS-Competitor-Audit/1.0' }
    });
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!contentType.includes('text/html')) throw new Error(`Unexpected content type: ${contentType}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function toUrl(baseUrl, pagePath) {
  return new URL(pagePath, baseUrl).toString();
}

function normalizePagePath(pagePath) {
  if (!pagePath) return '/';
  if (pagePath === '/') return '/';
  if (pagePath.endsWith('/')) return pagePath;
  return pagePath.endsWith('.html') ? pagePath : `${pagePath}/`;
}

function pageConfigPath(page) {
  return typeof page === 'string' ? page : page.path;
}

function isPageEnabled(page) {
  return typeof page === 'string' || page.enabled !== false;
}

function pageReason(page) {
  return typeof page === 'string' ? '' : page.reason || '';
}

function isUsefulCompetitorPage(signals) {
  return Boolean(signals.title || signals.metaDescription || signals.h1.length || signals.h2.length || signals.ctas.length);
}

async function walkHtml(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['.git', 'node_modules', 'reports', 'outputs', 'work'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(fullPath));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

function relativePage(filePath) {
  const relative = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.replace(/index\.html$/, '')}`;
  return `/${relative}`;
}

function ignoredSitePages(config) {
  return new Map((config.site?.ignoredPages || []).map(item => [normalizePagePath(item.path), item.reason || 'Ignored by configuration.']));
}

function primaryEnglishPages(config) {
  return (config.site?.primaryEnglishPages || DEFAULT_PRIMARY_ENGLISH_PAGES).map(normalizePagePath);
}

function languageTier(pagePath) {
  if (pagePath.startsWith('/ar/') || pagePath.startsWith('/es/')) return 'low';
  return 'english';
}

function classifyRecommendation(pagePath, area, config) {
  const normalized = normalizePagePath(pagePath);
  const primaryPages = primaryEnglishPages(config);
  if (languageTier(normalized) === 'low') return 'low';
  if (primaryPages.includes(normalized) && ['SEO title', 'Meta description', 'H1', 'CTA', 'Trust'].includes(area)) return 'high';
  if (normalized.startsWith('/products/') || normalized.startsWith('/insights/') || area === 'Internal links') return 'medium';
  if (primaryPages.includes(normalized)) return 'high';
  return 'medium';
}

function addRecommendation(recommendations, config, pagePath, area, suggestion) {
  recommendations.push({
    page: pagePath,
    group: classifyRecommendation(pagePath, area, config),
    area,
    suggestion
  });
}

function sortRecommendations(recommendations, config) {
  const primaryOrder = new Map(primaryEnglishPages(config).map((page, index) => [page, index]));
  return recommendations.sort((a, b) => {
    const groupDelta = GROUP_ORDER[a.group] - GROUP_ORDER[b.group];
    if (groupDelta) return groupDelta;
    const aOrder = primaryOrder.get(normalizePagePath(a.page)) ?? 999;
    const bOrder = primaryOrder.get(normalizePagePath(b.page)) ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.page.localeCompare(b.page) || a.area.localeCompare(b.area);
  });
}

function configuredCompetitorIgnores(config) {
  const ignored = [];
  for (const competitor of config.competitors || []) {
    if (competitor.enabled === false) {
      ignored.push({
        type: 'competitor',
        source: competitor.name,
        url: competitor.baseUrl,
        reason: competitor.disabledReason || 'Competitor disabled in configuration.'
      });
    }
    for (const item of competitor.ignoredPages || []) {
      ignored.push({
        type: 'competitor-page',
        source: competitor.name,
        url: toUrl(competitor.baseUrl, item.path),
        reason: item.reason || 'Ignored competitor URL.'
      });
    }
    for (const page of competitor.pages || []) {
      if (!isPageEnabled(page)) {
        const pagePath = pageConfigPath(page);
        ignored.push({
          type: 'competitor-page',
          source: competitor.name,
          url: toUrl(competitor.baseUrl, pagePath),
          reason: pageReason(page) || 'Disabled competitor page.'
        });
      }
    }
  }
  return ignored;
}

function groupRecommendations(recommendations, ignoredItems) {
  return {
    high: recommendations.filter(item => item.group === 'high'),
    medium: recommendations.filter(item => item.group === 'medium'),
    low: recommendations.filter(item => item.group === 'low'),
    ignore: ignoredItems
  };
}

function comparePages(sitePages, competitorPages, config, ignoredItems) {
  const validCompetitorPages = competitorPages.filter(page => !page.error && page.status !== 'ignored');
  const competitorSummary = {
    avgCtaCount: average(validCompetitorPages.map(page => page.signals.ctas.length)),
    faqCoverage: ratio(validCompetitorPages, page => page.signals.faqs.length > 0),
    trustSignals: unique(validCompetitorPages.flatMap(page => page.signals.trustSignals)),
    productCategories: unique(validCompetitorPages.flatMap(page => page.signals.productCategories)),
    commonCtas: unique(validCompetitorPages.flatMap(page => page.signals.ctas.map(cta => cta.text))).slice(0, 20)
  };

  const recommendations = [];
  for (const page of sitePages) {
    const signals = page.signals;
    if (!signals.title || signals.title.length < 35 || signals.title.length > 70) {
      addRecommendation(recommendations, config, page.path, 'SEO title', 'Review title length and make the primary buyer keyword clearer.');
    }
    if (!signals.metaDescription || signals.metaDescription.length < 120 || signals.metaDescription.length > 165) {
      addRecommendation(recommendations, config, page.path, 'Meta description', 'Use a 120-165 character buyer-focused description with material, application and inquiry intent.');
    }
    if (signals.h1.length !== 1) {
      addRecommendation(recommendations, config, page.path, 'H1', 'Keep exactly one visible H1 so search engines and buyers understand the page topic.');
    }
    if (signals.ctas.length < Math.max(1, Math.round(competitorSummary.avgCtaCount / 2))) {
      addRecommendation(recommendations, config, page.path, 'CTA', 'Add a clear sample, quote or contact CTA near buyer decision sections.');
    }
    if (competitorSummary.faqCoverage >= 0.4 && signals.faqs.length === 0) {
      addRecommendation(recommendations, config, page.path, 'FAQ', 'Add a short B2B FAQ section covering samples, customization, documents and export communication.');
    }
    if (signals.trustSignals.length < 2) {
      addRecommendation(recommendations, config, page.path, 'Trust', 'Strengthen proof points such as factory-direct supply, testing documents, production capability or export support.');
    }
    if (signals.imageLayout.imageCount > 0 && signals.imageLayout.imagesWithAlt < signals.imageLayout.imageCount) {
      addRecommendation(recommendations, config, page.path, 'Images', 'Add descriptive alt text to product and application images.');
    }
    const coreLinks = ['/products/', '/sample-shipping/', '/private-label/', '/contact/'];
    const missingCoreLinks = coreLinks.filter(link => !signals.ctas.some(cta => cta.href === link));
    if (primaryEnglishPages(config).includes(normalizePagePath(page.path)) && missingCoreLinks.length >= 3) {
      addRecommendation(recommendations, config, page.path, 'Internal links', 'Add clearer internal links to product, sample, private label and contact buyer paths.');
    }
  }

  const sorted = sortRecommendations(recommendations, config);
  return {
    competitorSummary,
    recommendations: sorted,
    groupedRecommendations: groupRecommendations(sorted, ignoredItems)
  };
}

function average(values) {
  const valid = values.filter(value => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function ratio(values, predicate) {
  return values.length ? values.filter(predicate).length / values.length : 0;
}

function recommendationLine(item) {
  return `- ${item.page} - ${item.area}: ${item.suggestion}`;
}

function ignoredLine(item) {
  const target = item.page || item.url || item.source || 'Unknown';
  return `- ${target}: ${item.reason}`;
}

function markdownReport(report) {
  const lines = [];
  const groups = report.comparison.groupedRecommendations;
  lines.push(`# Competitor Audit - ${report.date}`);
  lines.push('');
  lines.push(`Audited ${report.competitors.filter(page => !page.error && page.status !== 'ignored').length} valid competitor pages and ${report.sitePages.length} MCCS public pages.`);
  lines.push('');
  lines.push('## Competitor Patterns');
  lines.push('');
  lines.push(`- Average CTA count: ${report.comparison.competitorSummary.avgCtaCount.toFixed(1)}`);
  lines.push(`- FAQ coverage: ${(report.comparison.competitorSummary.faqCoverage * 100).toFixed(0)}%`);
  lines.push(`- Trust signals: ${report.comparison.competitorSummary.trustSignals.join(', ') || 'None detected'}`);
  lines.push(`- Product/category signals: ${report.comparison.competitorSummary.productCategories.slice(0, 12).join('; ') || 'None detected'}`);
  lines.push('');
  lines.push('## High Priority: English Main-Site Conversion and SEO');
  lines.push('');
  lines.push(...(groups.high.length ? groups.high.map(recommendationLine) : ['- No high-priority English main-site gaps detected.']));
  lines.push('');
  lines.push('## Medium Priority: Product Pages, Insights and Internal Links');
  lines.push('');
  lines.push(...(groups.medium.length ? groups.medium.map(recommendationLine) : ['- No medium-priority product, insights or internal-link gaps detected.']));
  lines.push('');
  lines.push('## Low Priority: Multilingual Page Fine-Tuning');
  lines.push('');
  lines.push(...(groups.low.length ? groups.low.map(recommendationLine) : ['- No low-priority multilingual gaps detected.']));
  lines.push('');
  lines.push('## Ignore: Admin and Invalid Competitor URLs');
  lines.push('');
  lines.push(...(groups.ignore.length ? groups.ignore.map(ignoredLine) : ['- No ignored pages or failed competitor URLs in this run.']));
  lines.push('');
  lines.push('## Competitor Page Details');
  lines.push('');
  for (const page of report.competitors) {
    lines.push(`### ${page.competitor}: ${page.url}`);
    if (page.error || page.status === 'ignored') {
      lines.push(`- Ignored: ${page.error || page.reason || 'No useful page content detected.'}`);
      lines.push('');
      continue;
    }
    lines.push(`- Title: ${page.signals.title || 'Missing'}`);
    lines.push(`- Meta description: ${page.signals.metaDescription || 'Missing'}`);
    lines.push(`- H1: ${page.signals.h1.join(' | ') || 'Missing'}`);
    lines.push(`- CTAs: ${page.signals.ctas.map(cta => cta.text).slice(0, 8).join(' | ') || 'None detected'}`);
    lines.push(`- FAQs: ${page.signals.faqs.slice(0, 6).join(' | ') || 'None detected'}`);
    lines.push(`- Images: ${page.signals.imageLayout.imageCount} total, ${page.signals.imageLayout.imagesWithAlt} with alt text`);
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

function prBody(report) {
  const groups = report.comparison.groupedRecommendations;
  const lines = [];
  lines.push('## What changed');
  lines.push('');
  lines.push('- Ran the scheduled competitor audit.');
  lines.push('- Generated the latest competitor audit reports under `reports/competitor-audit/`.');
  lines.push('- Applied only conservative optimizer changes when the optimizer found safe opportunities.');
  lines.push('');
  lines.push('## Why');
  lines.push('');
  lines.push('The audit prioritizes English main-site conversion and SEO first, keeps product/insights/internal-link recommendations separate, and moves multilingual fine-tuning into a lower-priority review lane. Admin pages and invalid competitor URLs are ignored.');
  lines.push('');
  lines.push('## Safety checks');
  lines.push('');
  lines.push('- No direct push to `main`; this change is submitted as a Pull Request.');
  lines.push('- Product data files are excluded from optimizer edits.');
  lines.push('- Product parameters, model names, dimensions, MOQ and carton quantity data are not edited by the scripts.');
  lines.push('- Formspree endpoints, Google Analytics ID and Vercel configuration are protected.');
  lines.push('');
  lines.push('## High Priority: English Main-Site Conversion and SEO');
  lines.push('');
  lines.push(...(groups.high.slice(0, 10).map(recommendationLine)) || ['- No high-priority recommendations.']);
  if (!groups.high.length) lines.push('- No high-priority recommendations.');
  lines.push('');
  lines.push('## Medium Priority: Product Pages, Insights and Internal Links');
  lines.push('');
  if (groups.medium.length) {
    lines.push(...groups.medium.slice(0, 10).map(recommendationLine));
  } else {
    lines.push('- No medium-priority recommendations.');
  }
  lines.push('');
  lines.push('Review the generated report before merging.');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const config = await readJson(CONFIG_PATH);
  await ensureDir(REPORT_DIR);

  const ignoredItems = configuredCompetitorIgnores(config);
  const competitorPages = [];
  for (const competitor of config.competitors.filter(item => item.enabled !== false)) {
    const pages = (competitor.pages || ['/']).filter(isPageEnabled).slice(0, config.auditSettings?.maxPagesPerCompetitor || 8);
    for (const page of pages) {
      const pagePath = pageConfigPath(page);
      const url = toUrl(competitor.baseUrl, pagePath);
      try {
        const html = await fetchHtml(url, config.auditSettings || {});
        const signals = extractSignals(html);
        if (!isUsefulCompetitorPage(signals)) {
          const reason = 'No useful SEO, heading, CTA or page-structure content detected.';
          competitorPages.push({ competitor: competitor.name, url, status: 'ignored', reason, signals });
          ignoredItems.push({ type: 'competitor-page', source: competitor.name, url, reason });
        } else {
          competitorPages.push({ competitor: competitor.name, url, signals });
        }
      } catch (error) {
        competitorPages.push({ competitor: competitor.name, url, error: error.message, signals: extractSignals('') });
        ignoredItems.push({ type: 'competitor-page', source: competitor.name, url, reason: error.message });
      }
    }
  }

  const sitePages = [];
  const ignoredSite = ignoredSitePages(config);
  for (const filePath of await walkHtml(ROOT)) {
    const pagePath = relativePage(filePath);
    const normalized = normalizePagePath(pagePath);
    if (ignoredSite.has(normalized)) {
      ignoredItems.push({ type: 'site-page', page: pagePath, reason: ignoredSite.get(normalized) });
      continue;
    }
    const html = await fs.readFile(filePath, 'utf8');
    sitePages.push({ path: pagePath, file: path.relative(ROOT, filePath).replace(/\\/g, '/'), signals: extractSignals(html) });
  }

  const comparison = comparePages(sitePages, competitorPages, config, ignoredItems);
  const report = {
    date: TODAY,
    generatedAt: new Date().toISOString(),
    site: config.site,
    competitors: competitorPages,
    ignoredItems,
    sitePages,
    comparison
  };

  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = markdownReport(report);
  await fs.writeFile(path.join(REPORT_DIR, `${TODAY}.json`), json);
  await fs.writeFile(path.join(REPORT_DIR, `${TODAY}.md`), markdown);
  await fs.writeFile(path.join(REPORT_DIR, 'latest.json'), json);
  await fs.writeFile(path.join(REPORT_DIR, 'latest.md'), markdown);
  await fs.writeFile(path.join(REPORT_DIR, 'latest-pr-body.md'), prBody(report));

  console.log(`Competitor audit complete: ${competitorPages.length} competitor pages, ${sitePages.length} public site pages.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
