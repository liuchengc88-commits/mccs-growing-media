const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mccs-root-evidence-'));

function generate(script) {
  execFileSync(process.execPath, [path.join(tempRoot, 'scripts', script)], {
    cwd: tempRoot,
    stdio: 'pipe'
  });
}

try {
  fs.mkdirSync(path.join(tempRoot, 'scripts'));
  fs.mkdirSync(path.join(tempRoot, 'data'));
  fs.copyFileSync(path.join(root, 'data/products.json'), path.join(tempRoot, 'data/products.json'));
  for (const script of ['generate-cn-site.mjs', 'generate-seo-authority-pages.mjs']) {
    fs.copyFileSync(path.join(root, 'scripts', script), path.join(tempRoot, 'scripts', script));
    generate(script);
  }

  const cn = fs.readFileSync(path.join(tempRoot, 'cn/insights/index.html'), 'utf8');
  const expectedRoute = 'https://www.mccsgrowingmedia.com/cn/insights/cutting-propagation-root-observations/';
  assert.ok(cn.includes('class="cn-site root-evidence-page"'));
  assert.ok(cn.includes('class="container root-evidence-entry"'));
  assert.ok(cn.includes('href="/assets/root-evidence-entry.css"'));
  assert.ok(cn.includes('src="/assets/yunnan-rooting/rooted-cuttings-4-1280.webp"'));
  assert.ok(cn.includes('width="1280" height="1707"'));
  assert.ok(cn.includes('href="/cn/contact/#quoteForm"'));
  const schemas = [...cn.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1]));
  const collection = schemas.find(schema => schema['@type'] === 'CollectionPage');
  assert.equal(collection.mainEntity.itemListElement[0].url, expectedRoute);

  const cannabis = fs.readFileSync(path.join(tempRoot, 'applications/cannabis-clone-propagation-plugs/index.html'), 'utf8');
  assert.ok(cannabis.includes('href="/insights/cutting-propagation-root-observations/"'));
  assert.equal(cannabis.includes('href="/contact/"'), false);
  assert.ok([...cannabis.matchAll(/href="\/contact\/#quoteForm"/g)].length >= 6);
  assert.equal(cannabis.includes('cannabis-root-observation'), false);

  const greenhouse = fs.readFileSync(path.join(tempRoot, 'applications/commercial-greenhouse-propagation-plugs/index.html'), 'utf8');
  assert.ok(greenhouse.includes('href="/contact/"'));
  assert.equal(greenhouse.includes('href="/contact/#quoteForm"'), false);

  const firstCn = cn;
  const firstCannabis = cannabis;
  generate('generate-cn-site.mjs');
  generate('generate-seo-authority-pages.mjs');
  assert.equal(fs.readFileSync(path.join(tempRoot, 'cn/insights/index.html'), 'utf8'), firstCn);
  assert.equal(fs.readFileSync(path.join(tempRoot, 'applications/cannabis-clone-propagation-plugs/index.html'), 'utf8'), firstCannabis);
  console.log('PASS: source generators preserve root photo entry, schema and scoped quote-form links across repeated regeneration.');
} finally {
  const absolute = path.resolve(tempRoot);
  assert.equal(path.dirname(absolute), path.resolve(os.tmpdir()));
  assert.ok(path.basename(absolute).startsWith('mccs-root-evidence-'));
  fs.rmSync(absolute, { recursive: true, force: true });
}
