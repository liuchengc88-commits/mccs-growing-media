import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'output', 'outputs', 'reports', 'tmp']);
const protectedFiles = new Set(['/admin.html', '/privacy.html', '/terms.html']);
const localePrefixes = new Set(['cn', 'es', 'ar']);
const labels = { en: 'EN', es: 'ES', ar: 'AR', cn: '中文' };
const groups = new Map();
const routeFiles = new Map();

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(target));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(target);
  }
  return files;
}

function publicRoute(file) {
  let relative = path.relative(root, file).replaceAll('\\', '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

for (const file of walk(root)) {
  const route = publicRoute(file);
  if (protectedFiles.has(route)) continue;
  routeFiles.set(route, file);
  const parts = route.split('/').filter(Boolean);
  const locale = localePrefixes.has(parts[0]) ? parts.shift() : 'en';
  const baseRoute = `/${parts.join('/')}${route.endsWith('/') ? '/' : ''}`.replace('//', '/');
  const group = groups.get(baseRoute) || {};
  group[locale] = route;
  groups.set(baseRoute, group);
}

const manifest = {};
for (const group of groups.values()) {
  if (Object.keys(group).length < 2) continue;
  const options = Object.entries(group).map(([locale, href]) => ({ locale, label: labels[locale], href }));
  for (const { href } of options) manifest[href] = options;
}

fs.writeFileSync('assets/language-routes.json', `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

for (const [route, options] of Object.entries(manifest)) {
  const file = routeFiles.get(route);
  if (!file) continue;
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<link\b(?=[^>]*\brel=["']alternate["'])[^>]*>\s*/gi, '');
  const tags = options.map(({ locale, href }) => {
    const hreflang = locale === 'cn' ? 'zh-CN' : locale;
    return `<link rel="alternate" hreflang="${hreflang}" href="https://www.mccsgrowingmedia.com${href}">`;
  });
  const defaultOption = options.find(({ locale }) => locale === 'en') || options[0];
  tags.push(`<link rel="alternate" hreflang="x-default" href="https://www.mccsgrowingmedia.com${defaultOption.href}">`);
  const canonicalPattern = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i;
  if (!canonicalPattern.test(html)) throw new Error(`Missing canonical link in ${route}`);
  html = html.replace(canonicalPattern, (canonical) => `${canonical}${tags.join('')}`);
  fs.writeFileSync(file, html, 'utf8');
}
console.log(`Generated language choices for ${Object.keys(manifest).length} translated routes.`);
