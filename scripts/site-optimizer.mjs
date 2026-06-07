import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'data', 'competitors.json');
const REPORT_PATH = path.join(ROOT, 'reports', 'competitor-audit', 'latest.json');
const OPTIMIZER_LOG = path.join(ROOT, 'reports', 'competitor-audit', 'latest-optimizer.md');
const APPLY_CHANGES = process.env.APPLY_CHANGES === 'true';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'reports', 'outputs', 'work']);
const SKIP_FILES = new Set(['admin.html', 'privacy.html']);
const PROTECTED_FILE_PATTERNS = [
  /^data\/products\.json$/,
  /^vercel\.json$/,
  /^data\//,
  /^docs\/MCCS_CF_Product_Specifications\.xlsx$/
];

const PROTECTED_REGEXES = [
  /https:\/\/formspree\.io\/[^"'\s<>]+/gi,
  /G-[A-Z0-9]+/g,
  /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+/gi,
  /fetch\(['"]\/data\/products\.json['"]\)/g
];

function normalizePath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function isProtectedPath(relativePath) {
  return PROTECTED_FILE_PATTERNS.some(pattern => pattern.test(relativePath));
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function walkHtml(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(fullPath));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

function getProtectedValues(html) {
  return PROTECTED_REGEXES.flatMap(regex => html.match(regex) || []).sort();
}

function assertProtectedValuesUnchanged(before, after, relativePath) {
  const beforeValues = JSON.stringify(getProtectedValues(before));
  const afterValues = JSON.stringify(getProtectedValues(after));
  if (beforeValues !== afterValues) {
    throw new Error(`Protected value changed in ${relativePath}. Aborting optimizer.`);
  }
}

function hasEnglishHtml(html) {
  const lang = html.match(/<html[^>]*lang=["']([^"']+)["']/i)?.[1]?.toLowerCase() || '';
  return !lang || lang.startsWith('en');
}

function cleanText(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractH1(html) {
  return cleanText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || 'MCCS Growing Media');
}

function titleNeedsReview(html) {
  const title = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  return !title || title.length < 35 || title.length > 70;
}

function descriptionNeedsReview(html) {
  const description = html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)?.[1] || '';
  return !description || description.length < 120 || description.length > 165;
}

function buildDescription(h1) {
  const topic = h1.replace(/\s*\|.*$/, '').replace(/MCCS\s*/i, 'MCCS ');
  return `${topic} for B2B buyers: factory-direct molded coconut coir and peat substrate support, samples, private label packaging and export coordination.`.slice(0, 164);
}

function updateMetaDescription(html) {
  if (!descriptionNeedsReview(html)) return { html, changed: false, reason: '' };
  const description = buildDescription(extractH1(html));
  if (html.match(/<meta\s+[^>]*name=["']description["'][^>]*>/i)) {
    return {
      html: html.replace(/<meta\s+([^>]*name=["']description["'][^>]*content=)["'][^"']*["']([^>]*)>/i, `<meta $1"${description}"$2>`),
      changed: true,
      reason: 'Updated meta description length and buyer focus.'
    };
  }
  return {
    html: html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, match => `${match}<meta name="description" content="${description}">`),
    changed: true,
    reason: 'Added missing meta description.'
  };
}

function addFaqSection(html) {
  if (/<details[\s>]/i.test(html) || /FAQPage/i.test(html) || /auto-optimizer-faq/i.test(html)) {
    return { html, changed: false, reason: '' };
  }
  if (!/<\/main>/i.test(html)) return { html, changed: false, reason: '' };
  const section = `<section class="section auto-optimizer-faq"><div class="container"><div class="section-head"><span>B2B Buyer FAQ</span><h2>Buyer Questions</h2></div><div class="faq-grid"><details><summary>Can MCCS support sample evaluation?</summary><p>Yes. Buyers can request sample guidance based on application, target market, packaging plan and expected order volume.</p></details><details><summary>Do you support private label packaging?</summary><p>Private label packaging can be discussed for qualified B2B projects after product model and sales channel are confirmed.</p></details><details><summary>Can documents be reviewed before ordering?</summary><p>Available business, testing and export information can be shared during project review so buyers can confirm fit before purchase.</p></details></div></div></section>`;
  return {
    html: html.replace(/<\/main>/i, `${section}</main>`),
    changed: true,
    reason: 'Added a conservative B2B FAQ section without product parameter changes.'
  };
}

function addInternalLinks(html) {
  if (/auto-optimizer-links/i.test(html) || !/<\/main>/i.test(html)) return { html, changed: false, reason: '' };
  const requiredLinks = ['/products/', '/sample-shipping/', '/private-label/', '/contact/'];
  const missing = requiredLinks.filter(link => !html.includes(`href="${link}"`) && !html.includes(`href='${link}'`));
  if (missing.length < 2) return { html, changed: false, reason: '' };
  const section = `<section class="section auto-optimizer-links"><div class="container center-actions"><a class="btn btn-outline" href="/products/">Compare Product Models</a><a class="btn btn-outline" href="/sample-shipping/">Sample &amp; Shipping</a><a class="btn btn-outline" href="/private-label/">Private Label Options</a><a class="btn btn-primary" href="/contact/">Request Sample</a></div></section>`;
  return {
    html: html.replace(/<\/main>/i, `${section}</main>`),
    changed: true,
    reason: 'Added internal links to core buyer pages.'
  };
}

function addContactCta(html) {
  if (html.includes('href="/contact/"') || html.includes("href='/contact/'") || !/<\/main>/i.test(html)) {
    return { html, changed: false, reason: '' };
  }
  const section = `<section class="section auto-optimizer-cta"><div class="container callout-card"><div><span class="section-label">Factory Direct</span><h2>Need a sample or quote?</h2><p>Share your application, market and expected volume so MCCS can recommend a suitable sample path.</p></div><div class="callout-actions"><a class="btn btn-primary btn-large" href="/contact/">Request Sample</a></div></div></section>`;
  return {
    html: html.replace(/<\/main>/i, `${section}</main>`),
    changed: true,
    reason: 'Added a contact CTA for buyer inquiry flow.'
  };
}

function optimizeHtml(html, relativePath) {
  if (!hasEnglishHtml(html)) return { html, changes: ['Skipped non-English page.'] };
  if (SKIP_FILES.has(path.basename(relativePath))) return { html, changes: ['Skipped protected utility page.'] };

  const changes = [];
  let next = html;

  for (const transform of [updateMetaDescription, addContactCta, addInternalLinks, addFaqSection]) {
    const result = transform(next);
    next = result.html;
    if (result.changed) changes.push(result.reason);
  }

  if (titleNeedsReview(next)) {
    changes.push('Title needs review; left unchanged to avoid changing page positioning without human approval.');
  }

  return { html: next, changes };
}

async function main() {
  const config = await readJson(CONFIG_PATH);
  const report = await readJson(REPORT_PATH).catch(() => null);
  const htmlFiles = await walkHtml(ROOT);
  const log = [];

  log.push(`# Site Optimizer - ${new Date().toISOString().slice(0, 10)}`);
  log.push('');
  log.push(APPLY_CHANGES ? 'Mode: apply changes' : 'Mode: dry run');
  log.push('');

  const protectedFiles = new Set(config.site?.protectedFiles || []);
  const changedFiles = [];

  for (const filePath of htmlFiles) {
    const relativePath = normalizePath(filePath);
    if (protectedFiles.has(relativePath) || isProtectedPath(relativePath)) continue;

    const before = await fs.readFile(filePath, 'utf8');
    const result = optimizeHtml(before, relativePath);
    assertProtectedValuesUnchanged(before, result.html, relativePath);

    if (result.html !== before) {
      changedFiles.push({ file: relativePath, changes: result.changes });
      if (APPLY_CHANGES) await fs.writeFile(filePath, result.html);
    }
  }

  if (changedFiles.length === 0) {
    log.push('No safe HTML optimization changes were needed.');
  } else {
    log.push('## Changed Files');
    log.push('');
    for (const item of changedFiles) {
      log.push(`- ${item.file}`);
      for (const change of item.changes) log.push(`  - ${change}`);
    }
  }

  if (report?.comparison?.recommendations?.length) {
    log.push('');
    log.push('## Audit Recommendations Used');
    log.push('');
    for (const recommendation of report.comparison.recommendations.slice(0, 12)) {
      log.push(`- ${recommendation.page} - ${recommendation.area}: ${recommendation.suggestion}`);
    }
  }

  await fs.writeFile(OPTIMIZER_LOG, `${log.join('\n')}\n`);
  console.log(`${APPLY_CHANGES ? 'Applied' : 'Dry-run checked'} optimizer changes for ${changedFiles.length} files.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
