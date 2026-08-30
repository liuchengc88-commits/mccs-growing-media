import fs from 'node:fs';

const origin = 'https://www.mccsgrowingmedia.com';
const host = 'www.mccsgrowingmedia.com';
const key = '9876baf78823107e0a1099d058acb1d1';
const keyLocation = `${origin}/${key}.txt`;

const sitemap = fs.readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const requestedUrls = process.argv.slice(2);
const urlList = requestedUrls.length ? requestedUrls : sitemapUrls;

if (!urlList.length) throw new Error('No URLs were found for IndexNow submission.');
if (urlList.some((url) => !url.startsWith(`${origin}/`))) {
  throw new Error(`Every URL must use the canonical origin ${origin}.`);
}

const keyResponse = await fetch(keyLocation, { redirect: 'follow' });
const deployedKey = (await keyResponse.text()).trim();
if (!keyResponse.ok || deployedKey !== key) {
  throw new Error(`IndexNow key is not deployed at ${keyLocation}; refusing submission.`);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList })
});

if (![200, 202].includes(response.status)) {
  const details = await response.text();
  throw new Error(`IndexNow returned HTTP ${response.status}: ${details}`);
}

console.log(`IndexNow accepted ${urlList.length} canonical URLs with HTTP ${response.status}.`);
