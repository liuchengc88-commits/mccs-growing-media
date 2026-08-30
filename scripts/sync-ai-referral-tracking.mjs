import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skippedFiles = new Set(['admin.html', 'privacy.html', 'terms.html']);
const scriptTag = '<script src="/assets/ai-referral-tracking.js" defer></script>';

function listHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (['.git', '.lighthouseci', 'node_modules', 'outputs', 'tmp'].includes(entry.name)) return [];
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(entryPath);
    return entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

let changed = 0;
for (const filePath of listHtmlFiles(root)) {
  if (skippedFiles.has(path.basename(filePath))) continue;
  const source = fs.readFileSync(filePath, 'utf8');
  if (source.includes(scriptTag) || !source.includes('</body>')) continue;
  const updated = source.replace('</body>', `${scriptTag}</body>`);
  fs.writeFileSync(filePath, updated, 'utf8');
  changed += 1;
}

console.log(`Added AI referral session tracking to ${changed} public HTML files.`);
