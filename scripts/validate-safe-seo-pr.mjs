import fs from 'node:fs/promises';
import path from 'node:path';

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const prNumber = process.env.PR_NUMBER || process.env.GITHUB_REF_NAME?.split('/')[0];

const REPORT_DIR = path.join(process.cwd(), 'reports', 'safe-seo-validation');
const SUMMARY_MD = path.join(REPORT_DIR, 'summary.md');
const SUMMARY_JSON = path.join(REPORT_DIR, 'summary.json');

const MAX_FILES = 15;
const MAX_ADDITIONS = 800;
const MAX_DELETIONS = 300;

const allowedExactFiles = new Set([
  'index.html',
  'products/index.html',
  'sample-shipping/index.html',
  'private-label/index.html',
  'about/index.html',
  'contact/index.html',
  'insights/index.html'
]);

const allowedPathPatterns = [
  /^insights\/.+\.html$/,
  /^reports\/competitor-audit\/.+$/
];

const forbiddenPathPatterns = [
  /^data\//,
  /^vercel\.json$/,
  /^\.vercel\//,
  /^admin\.html$/,
  /^privacy\.html$/,
  /^terms\.html$/,
  /^ar\//,
  /^es\//
];

const titlePattern = /(competitor audit|safe site optimization|seo optimization)/i;
const allowedBranchPatterns = [
  /^automation\/competitor-audit-updates$/,
  /^codex\/.*seo/i
];

const forbiddenFrontendTerms = [
  'amazon',
  'demo',
  'placeholder',
  'sample testimonial',
  'fake',
  'simulated customer',
  'preview',
  'developer note',
  'internal note'
];

const protectedValuePatterns = [
  /data\/products\.json/g,
  /formspree\.io\/[A-Za-z0-9/_-]+/g,
  /G-[A-Z0-9]+/g,
  /gtag\/js\?id=G-[A-Z0-9]+/g
];

const protectedSpecPatterns = [
  /\bCF[-\s]?[A-Z0-9]+\b/gi,
  /\bMOQ\b[^<\n\r]{0,100}/gi,
  /\b\d+(?:\.\d+)?\s*(?:mm|cm|inch|in)\b/gi,
  /\b(?:carton quantity|quantity per carton|per carton|carton size|pack count|outer-carton)[^<\n\r]{0,120}/gi
];

function requiredEnv(value, name) {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const [owner, repo] = requiredEnv(repository, 'GITHUB_REPOSITORY').split('/');
requiredEnv(token, 'GITHUB_TOKEN');
requiredEnv(prNumber, 'PR_NUMBER');

async function github(pathname, options = {}) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${data?.message || text}`);
  }
  return data;
}

async function listFiles() {
  const files = [];
  let page = 1;
  while (true) {
    const batch = await github(`/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100&page=${page}`);
    files.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return files;
}

function isAllowedPath(filename) {
  return allowedExactFiles.has(filename) || allowedPathPatterns.some(pattern => pattern.test(filename));
}

function isForbiddenPath(filename) {
  return forbiddenPathPatterns.some(pattern => pattern.test(filename));
}

function changedLines(patch, marker) {
  if (!patch) return [];
  return patch
    .split('\n')
    .filter(line => line.startsWith(marker) && !line.startsWith(`${marker}${marker}${marker}`))
    .map(line => line.slice(1));
}

function collectMatches(lines, patterns) {
  const values = [];
  for (const line of lines) {
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      for (const match of line.matchAll(pattern)) values.push(match[0]);
    }
  }
  return values.sort();
}

function sameValues(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function isFrontendHtml(filename) {
  return filename.endsWith('.html') && !filename.startsWith('reports/');
}

function validatePrMetadata(pr, failures, warnings) {
  if (!titlePattern.test(pr.title || '')) {
    failures.push('PR title must include Competitor audit, safe site optimization or SEO optimization.');
  }

  const labels = (pr.labels || []).map(label => label.name.toLowerCase());
  if (!labels.includes('automation') || !labels.includes('seo')) {
    failures.push('PR labels must include both automation and seo.');
  }

  const branch = pr.head?.ref || '';
  if (!allowedBranchPatterns.some(pattern => pattern.test(branch))) {
    failures.push('PR branch must be automation/competitor-audit-updates or a codex/seo related branch.');
  }

  if (pr.base?.ref !== 'main') {
    failures.push('PR base branch must be main.');
  }

  if (pr.draft) {
    failures.push('Draft PRs are not eligible for auto-merge.');
  }

  if (pr.head?.repo?.full_name !== pr.base?.repo?.full_name) {
    failures.push('Cross-repository PRs are not eligible for auto-merge.');
  }

  const body = pr.body || '';
  const bodyLower = body.toLowerCase();
  const bodyChecks = [
    ['competitor', 'PR body should describe which competitors were analyzed.'],
    ['page', 'PR body should describe which pages were optimized.'],
    ['keyword', 'PR body should describe target keywords or buyer intent.'],
    ['natural traffic', 'PR body should explain why the change helps natural traffic.'],
    ['safe', 'PR body should state whether safety checks passed.']
  ];
  for (const [needle, message] of bodyChecks) {
    if (!bodyLower.includes(needle)) warnings.push(message);
  }
  if (!/product data[^\n\r]{0,80}\bno\b/i.test(body) && !/\bno\b[^\n\r]{0,80}product data/i.test(body)) {
    warnings.push('PR body should explicitly state product data: No.');
  }
}

function validateFileList(files, failures) {
  if (files.length > MAX_FILES) {
    failures.push(`Changed file count ${files.length} exceeds limit ${MAX_FILES}.`);
  }

  const additions = files.reduce((sum, file) => sum + (file.additions || 0), 0);
  const deletions = files.reduce((sum, file) => sum + (file.deletions || 0), 0);

  if (additions > MAX_ADDITIONS) failures.push(`Added lines ${additions} exceed limit ${MAX_ADDITIONS}.`);
  if (deletions > MAX_DELETIONS) failures.push(`Deleted lines ${deletions} exceed limit ${MAX_DELETIONS}.`);

  for (const file of files) {
    if (isForbiddenPath(file.filename)) failures.push(`Forbidden file changed: ${file.filename}`);
    if (!isAllowedPath(file.filename)) failures.push(`File is outside the auto-merge allowlist: ${file.filename}`);
    if (!file.patch && file.status !== 'removed') failures.push(`Patch is unavailable for ${file.filename}; refusing auto-merge.`);
    if (file.status === 'removed') failures.push(`Deleted file is not eligible for auto-merge: ${file.filename}`);
  }

  return { additions, deletions };
}

function validatePatchContent(files, failures) {
  for (const file of files) {
    const removed = changedLines(file.patch || '', '-');
    const added = changedLines(file.patch || '', '+');

    const removedProtected = collectMatches(removed, protectedValuePatterns);
    const addedProtected = collectMatches(added, protectedValuePatterns);
    if (!sameValues(removedProtected, addedProtected)) {
      failures.push(`Protected integration or product-data reference changed in ${file.filename}.`);
    }

    const removedSpecs = collectMatches(removed, protectedSpecPatterns);
    const addedSpecs = collectMatches(added, protectedSpecPatterns);
    if (!sameValues(removedSpecs, addedSpecs)) {
      failures.push(`Product model, size, MOQ or carton quantity text appears to change in ${file.filename}.`);
    }

    if (isFrontendHtml(file.filename)) {
      for (const line of added) {
        const lower = line.toLowerCase();
        for (const term of forbiddenFrontendTerms) {
          if (lower.includes(term)) {
            failures.push(`Forbidden buyer-facing term "${term}" added in ${file.filename}.`);
          }
        }
      }
    }
  }
}

function buildSummary(result) {
  const lines = [];
  lines.push(result.ok ? '## Safe SEO Auto-Merge Check: Passed' : '## Safe SEO Auto-Merge Check: Failed');
  lines.push('');
  lines.push(`- PR: #${result.prNumber}`);
  lines.push(`- Title: ${result.title}`);
  lines.push(`- Branch: ${result.branch}`);
  lines.push(`- Base: ${result.base}`);
  lines.push(`- Files changed: ${result.fileCount}`);
  lines.push(`- Additions: ${result.additions}`);
  lines.push(`- Deletions: ${result.deletions}`);
  lines.push(`- Product data modified: No`);
  lines.push(`- Formspree / GA / Vercel protected values changed: ${result.protectedValuesChanged ? 'Yes' : 'No'}`);
  lines.push('');
  lines.push('### Changed Files');
  lines.push('');
  for (const file of result.files) lines.push(`- ${file}`);
  lines.push('');
  if (result.failures.length) {
    lines.push('### Blocking Reasons');
    lines.push('');
    for (const failure of result.failures) lines.push(`- ${failure}`);
    lines.push('');
  }
  if (result.warnings.length) {
    lines.push('### PR Description Warnings');
    lines.push('');
    for (const warning of result.warnings) lines.push(`- ${warning}`);
    lines.push('');
  }
  lines.push(result.ok ? 'This PR is eligible for squash merge by the safe SEO automation.' : 'This PR was not merged. Please revise the PR or merge manually after review.');
  return `${lines.join('\n')}\n`;
}

async function main() {
  await fs.mkdir(REPORT_DIR, { recursive: true });

  const pr = await github(`/repos/${owner}/${repo}/pulls/${prNumber}`);
  const files = await listFiles();
  const failures = [];
  const warnings = [];

  validatePrMetadata(pr, failures, warnings);
  const totals = validateFileList(files, failures);
  validatePatchContent(files, failures);

  const protectedValuesChanged = failures.some(failure => failure.includes('Protected integration'));
  const result = {
    ok: failures.length === 0,
    prNumber,
    title: pr.title,
    branch: pr.head?.ref || '',
    base: pr.base?.ref || '',
    fileCount: files.length,
    additions: totals.additions,
    deletions: totals.deletions,
    protectedValuesChanged,
    files: files.map(file => file.filename),
    failures,
    warnings
  };

  await fs.writeFile(SUMMARY_JSON, `${JSON.stringify(result, null, 2)}\n`);
  await fs.writeFile(SUMMARY_MD, buildSummary(result));

  if (!result.ok) process.exit(1);
}

main().catch(async error => {
  await fs.mkdir(REPORT_DIR, { recursive: true });
  const result = {
    ok: false,
    prNumber: prNumber || 'unknown',
    title: 'unknown',
    branch: 'unknown',
    base: 'unknown',
    fileCount: 0,
    additions: 0,
    deletions: 0,
    protectedValuesChanged: false,
    files: [],
    failures: [error.message],
    warnings: []
  };
  await fs.writeFile(SUMMARY_JSON, `${JSON.stringify(result, null, 2)}\n`);
  await fs.writeFile(SUMMARY_MD, buildSummary(result));
  console.error(error);
  process.exit(1);
});
