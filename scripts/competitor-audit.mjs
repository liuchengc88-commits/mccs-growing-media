import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'data', 'competitors.json');
const REPORT_DIR = path.join(ROOT, 'reports', 'competitor-audit');
const TODAY = new Date().toISOString().slice(0, 10);

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
  return relative === 'index.html' ? '/' : `/${relative}`;
}

function comparePages(sitePages, competitorPages) {
  const competitorSummary = {
    avgCtaCount: average(competitorPages.map(page => page.signals.ctas.length)),
    faqCoverage: ratio(competitorPages, page => page.signals.faqs.length > 0),
    trustSignals: unique(competitorPages.flatMap(page => page.signals.trustSignals)),
    productCategories: unique(competitorPages.flatMap(page => page.signals.productCategories)),
    commonCtas: unique(competitorPages.flatMap(page => page.signals.ctas.map(cta => cta.text))).slice(0, 20)
  };

  const recommendations = [];
  for (const page of sitePages) {
    const signals = page.signals;
    if (!signals.title || signals.title.length < 35 || signals.title.length > 70) {
      recommendations.push({ page: page.path, priority: 'medium', area: 'SEO title', suggestion: 'Review title length and make the primary buyer keyword clearer.' });
    }
    if (!signals.metaDescription || signals.metaDescription.length < 120 || signals.metaDescription.length > 165) {
      recommendations.push({ page: page.path, priority: 'medium', area: 'Meta description', suggestion: 'Use a 120-165 character buyer-focused description with material, application and inquiry intent.' });
    }
    if (signals.h1.length !== 1) {
      recommendations.push({ page: page.path, priority: 'high', area: 'H1', suggestion: 'Keep exactly one visible H1 so search engines and buyers understand the page topic.' });
    }
    if (signals.ctas.length < Math.max(1, Math.round(competitorSummary.avgCtaCount / 2))) {
      recommendations.push({ page: page.path, priority: 'medium', area: 'CTA', suggestion: 'Add a clear sample, quote or contact CTA near buyer decision sections.' });
    }
    if (competitorSummary.faqCoverage >= 0.4 && signals.faqs.length === 0) {
      recommendations.push({ page: page.path, priority: 'medium', area: 'FAQ', suggestion: 'Add a short B2B FAQ section covering samples, customization, documents and export communication.' });
    }
    if (signals.trustSignals.length < 2) {
      recommendations.push({ page: page.path, priority: 'low', area: 'Trust', suggestion: 'Strengthen proof points such as factory-direct supply, testing documents, production capability or export support.' });
    }
    if (signals.imageLayout.imageCount > 0 && signals.imageLayout.imagesWithAlt < signals.imageLayout.imageCount) {
      recommendations.push({ page: page.path, priority: 'low', area: 'Images', suggestion: 'Add descriptive alt text to product and application images.' });
    }
  }

  return { competitorSummary, recommendations };
}

function average(values) {
  const valid = values.filter(value => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function ratio(values, predicate) {
  return values.length ? values.filter(predicate).length / values.length : 0;
}

function markdownReport(report) {
  const lines = [];
  lines.push(`# Competitor Audit - ${report.date}`);
  lines.push('');
  lines.push(`Audited ${report.competitors.length} competitor pages and ${report.sitePages.length} MCCS pages.`);
  lines.push('');
  lines.push('## Competitor Patterns');
  lines.push('');
  lines.push(`- Average CTA count: ${report.comparison.competitorSummary.avgCtaCount.toFixed(1)}`);
  lines.push(`- FAQ coverage: ${(report.comparison.competitorSummary.faqCoverage * 100).toFixed(0)}%`);
  lines.push(`- Trust signals: ${report.comparison.competitorSummary.trustSignals.join(', ') || 'None detected'}`);
  lines.push(`- Product/category signals: ${report.comparison.competitorSummary.productCategories.slice(0, 12).join('; ') || 'None detected'}`);
  lines.push('');
  lines.push('## Top Recommendations');
  lines.push('');
  if (!report.comparison.recommendations.length) {
    lines.push('- No major gaps detected by the rule-based audit.');
  } else {
    for (const item of report.comparison.recommendations.slice(0, 30)) {
      lines.push(`- **${item.priority.toUpperCase()}** ${item.page} - ${item.area}: ${item.suggestion}`);
    }
  }
  lines.push('');
  lines.push('## Competitor Page Details');
  lines.push('');
  for (const page of report.competitors) {
    lines.push(`### ${page.competitor}: ${page.url}`);
    if (page.error) {
      lines.push(`- Error: ${page.error}`);
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
  const recommendations = report.comparison.recommendations.slice(0, 12);
  const lines = [];
  lines.push('## What changed');
  lines.push('');
  lines.push('- Ran the scheduled competitor audit.');
  lines.push('- Generated the latest competitor audit reports under `reports/competitor-audit/`.');
  lines.push('- Applied only conservative optimizer changes when the optimizer found safe opportunities.');
  lines.push('');
  lines.push('## Why');
  lines.push('');
  lines.push('The audit compares MCCS pages against competitor page structure, SEO metadata, H1 usage, CTAs, FAQ coverage, trust signals, selling points and image layout patterns. The optimizer is intentionally limited to copy, SEO, CTA, FAQ and internal-link improvements.');
  lines.push('');
  lines.push('## Safety checks');
  lines.push('');
  lines.push('- No direct push to `main`; this change is submitted as a Pull Request.');
  lines.push('- Product data files are excluded from optimizer edits.');
  lines.push('- Product parameters, model names, dimensions, MOQ and carton quantity data are not edited by the scripts.');
  lines.push('- Formspree endpoints, Google Analytics ID and Vercel configuration are protected.');
  lines.push('');
  lines.push('## Current recommendations');
  lines.push('');
  if (!recommendations.length) {
    lines.push('- No major recommendations were detected in this run.');
  } else {
    for (const item of recommendations) lines.push(`- ${item.page} - ${item.area}: ${item.suggestion}`);
  }
  lines.push('');
  lines.push('Review the generated report before merging.');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const config = await readJson(CONFIG_PATH);
  await ensureDir(REPORT_DIR);

  const competitorPages = [];
  for (const competitor of config.competitors.filter(item => item.enabled !== false)) {
    const pages = (competitor.pages || ['/']).slice(0, config.auditSettings?.maxPagesPerCompetitor || 8);
    for (const pagePath of pages) {
      const url = toUrl(competitor.baseUrl, pagePath);
      try {
        const html = await fetchHtml(url, config.auditSettings || {});
        competitorPages.push({ competitor: competitor.name, url, signals: extractSignals(html) });
      } catch (error) {
        competitorPages.push({ competitor: competitor.name, url, error: error.message, signals: extractSignals('') });
      }
    }
  }

  const sitePages = [];
  for (const filePath of await walkHtml(ROOT)) {
    const html = await fs.readFile(filePath, 'utf8');
    sitePages.push({ path: relativePage(filePath), file: path.relative(ROOT, filePath).replace(/\\/g, '/'), signals: extractSignals(html) });
  }

  const report = {
    date: TODAY,
    generatedAt: new Date().toISOString(),
    site: config.site,
    competitors: competitorPages,
    sitePages,
    comparison: comparePages(sitePages, competitorPages)
  };

  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = markdownReport(report);
  await fs.writeFile(path.join(REPORT_DIR, `${TODAY}.json`), json);
  await fs.writeFile(path.join(REPORT_DIR, `${TODAY}.md`), markdown);
  await fs.writeFile(path.join(REPORT_DIR, 'latest.json'), json);
  await fs.writeFile(path.join(REPORT_DIR, 'latest.md'), markdown);
  await fs.writeFile(path.join(REPORT_DIR, 'latest-pr-body.md'), prBody(report));

  console.log(`Competitor audit complete: ${competitorPages.length} competitor pages, ${sitePages.length} site pages.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
