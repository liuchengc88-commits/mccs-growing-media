const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'mccs-factory-guide-'));
const config = JSON.parse(fs.readFileSync(path.join(root, 'data/factory-demonstrations.json')));
const locales = Object.values(config.locales);
const markers = source => (source.match(/<!-- factory-demonstrations:start -->/g) || []).length;
const run = script => execFileSync(process.execPath, [path.join(temp, 'scripts', script)], {cwd:temp, stdio:'pipe'});

try {
  for (const relative of ['data/factory-demonstrations.json', 'data/products.json', 'scripts/sync-factory-demonstrations.mjs', 'scripts/generate-cn-site.mjs', 'scripts/sync-localized-trust-pages.mjs']) {
    fs.mkdirSync(path.dirname(path.join(temp, relative)), {recursive:true});
    fs.copyFileSync(path.join(root, relative), path.join(temp, relative));
  }
  for (const l of locales) {
    assert.equal(l.photoCaptions.some(caption => /eco\s*plug/i.test(caption)), false, 'Third-party brand in comparison caption');
    for (const url of [`${l.prefix}/`, `${l.prefix}/insights/`, `${l.prefix}/technical-evidence/`, `${l.prefix}/insights/cutting-propagation-root-observations/`, `${l.prefix}/insights/substrate-plug-ec-ph-testing-protocol/`, '/insights/substrate-plug-ec-ph-testing-protocol/']) {
      const relative = path.join(url.replace(/^\//, ''), 'index.html');
      if (!fs.existsSync(path.join(root, relative))) continue;
      fs.mkdirSync(path.dirname(path.join(temp, relative)), {recursive:true});
      fs.copyFileSync(path.join(root, relative), path.join(temp, relative));
    }
  }
  const productBefore = fs.readFileSync(path.join(temp, 'data/products.json'), 'utf8');
  run('sync-factory-demonstrations.mjs');
  const files = [];
  for (const l of locales) {
    const article = path.join(temp, l.prefix.replace(/^\//, ''), 'insights', config.slug, 'index.html');
    const source = fs.readFileSync(article, 'utf8');
    files.push(article);
    assert.equal((source.match(/<h1>/g) || []).length, 1);
    assert.ok(source.includes(`lang="${l.lang}" dir="${l.dir}"`));
    assert.ok(source.includes(`href="${l.prefix}/contact/#quoteForm"`));
    assert.equal((source.match(/preload="none"/g) || []).length, 4);
    assert.equal((source.match(/<video\b/g) || []).length, 4);
    assert.equal(/<video[^>]*(autoplay|\bloop\b)/.test(source), false);
    assert.equal(source.includes('undefined'), false);
    assert.equal(source.includes('CANIN24009790301'), true);
    assert.ok(source.includes('width="960" height="1708"'));
    assert.ok(source.includes('width="576" height="1080"'));
    assert.equal((source.match(/src="\/assets\/factory-demonstrations\/[^" ]+\.mp4"/g) || []).length, 4);
    for (const x of locales) assert.ok(source.includes(`hreflang="${x.lang}" href="https://www.mccsgrowingmedia.com${x.prefix}/insights/${config.slug}/"`));
    const schemas = [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])['@graph'] || []);
    assert.equal(schemas.find(s=>s['@type']==='FAQPage').mainEntity.length, l.faqs.length);
    assert.equal(schemas.find(s=>s['@type']==='Article').datePublished, config.reviewDate);
    assert.equal(schemas.some(s=>s['@type']==='VideoObject'), false);
    for (const m of source.matchAll(/href="(\/[^"#]+)(?:#[^"]*)?"/g)) {
      const target = m[1];
      if (target.includes('substrate-plug-ec-ph-testing-protocol')) {
        assert.ok(fs.existsSync(path.join(temp, target.replace(/^\//, ''), 'index.html')), target);
      }
    }
    for (const url of [`${l.prefix}/`, `${l.prefix}/insights/`, `${l.prefix}/technical-evidence/`]) {
      const file = path.join(temp, url.replace(/^\//, ''), 'index.html');
      assert.equal(markers(fs.readFileSync(file,'utf8')), 1, url);
      files.push(file);
    }
  }
  for (const file of files) {
    const checkedIn = path.join(root, path.relative(temp, file));
    const normalize = source => source.replace(/\r\n/g, '\n');
    assert.equal(normalize(fs.readFileSync(file, 'utf8')), normalize(fs.readFileSync(checkedIn, 'utf8')), `Stale buyer page: ${checkedIn}. Run node scripts/sync-factory-demonstrations.mjs.`);
  }
  const first = files.map(file=>fs.readFileSync(file,'utf8'));
  run('sync-factory-demonstrations.mjs');
  files.forEach((file,i)=>assert.equal(fs.readFileSync(file,'utf8'), first[i], `Non-idempotent: ${file}`));
  run('generate-cn-site.mjs');
  run('sync-localized-trust-pages.mjs');
  for (const l of locales) {
    for (const url of [`${l.prefix}/`, `${l.prefix}/insights/`, `${l.prefix}/technical-evidence/`]) {
      assert.equal(markers(fs.readFileSync(path.join(temp,url.replace(/^\//,''),'index.html'),'utf8')),1,url);
    }
  }
  assert.equal(fs.readFileSync(path.join(temp,'data/products.json'),'utf8'),productBefore);
  console.log('PASS: four locales, video loading, source scope, links, schema, idempotence and regeneration preservation.');
} finally {
  assert.equal(path.dirname(path.resolve(temp)),path.resolve(os.tmpdir()));
  assert.ok(path.basename(temp).startsWith('mccs-factory-guide-'));
  fs.rmSync(temp,{recursive:true,force:true});
}
