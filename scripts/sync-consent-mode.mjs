import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['.git', '.lighthouseci', 'node_modules', 'output', 'outputs', 'tmp']);
const skipPages = new Set(['admin.html', 'privacy.html', 'terms.html']);
const marker = 'id="mccs-consent-default"';
const consentInit = `<script id="mccs-consent-default">window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};try{var mccsConsent=localStorage.getItem('mccs_cookie_consent')||(localStorage.getItem('mccs_cookie_ok')==='1'?'granted':'denied')}catch(e){var mccsConsent='denied'}gtag('consent','default',{analytics_storage:mccsConsent==='granted'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});</script>`;

let changed = 0;
for (const filePath of fs.readdirSync(root, { recursive: true })) {
  if (!filePath.endsWith('.html')) continue;
  if (skipPages.has(filePath.replaceAll('\\', '/'))) continue;
  const parts = filePath.split(/[\\/]/);
  if (parts.some((part) => skipDirs.has(part))) continue;
  const absolute = path.join(root, filePath);
  let html = fs.readFileSync(absolute, 'utf8');
  if (!html.includes('googletagmanager.com/gtag/js')) continue;

  if (!html.includes(marker)) {
    html = html.replace(
      /<script\s+async(?:="")?\s+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-JGR2SQBQHW"><\/script>/,
      `${consentInit}<script async src="https://www.googletagmanager.com/gtag/js?id=G-JGR2SQBQHW"></script>`
    );
  } else {
    html = html.replace(/<script id="mccs-consent-default">[\s\S]*?<\/script>/, consentInit);
  }
  html = html.replaceAll(
    "localStorage.setItem('mccs_cookie_ok','1');cb.style.display='none'",
    "cb.style.display='none'"
  );
  fs.writeFileSync(absolute, html, 'utf8');
  changed += 1;
}

console.log(`Synchronized consent defaults in ${changed} HTML files.`);
