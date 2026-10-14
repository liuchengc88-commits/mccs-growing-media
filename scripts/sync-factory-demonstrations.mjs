import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'data/factory-demonstrations.json'), 'utf8'));
const site = 'https://www.mccsgrowingmedia.com';
const assets = '/assets/factory-demonstrations/';
const videos = ['water-absorption', 'wet-airflow', 'nursery-roots', 'post-transplant-roots'];
const photos = ['nursery-comparison-roots', 'nursery-comparison-foliage'];
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const route = l => `${l.prefix}/insights/${content.slug}/`;
const fileFor = url => path.join(root, url.replace(/^\//, ''), 'index.html');

function requiredMatch(source, expression, label) {
  const match = source.match(expression);
  if (!match) throw new Error(`Missing ${label}; no page was written.`);
  return match[0];
}

function image(l, index, priority = 'lazy') {
  const name = photos[index];
  return `<a href="${assets}${name}-960.webp"><img src="${assets}${name}-960.webp" srcset="${assets}${name}-480.webp 480w, ${assets}${name}-960.webp 960w" sizes="(max-width:680px) 88vw, 420px" width="960" height="1708" alt="${escape(l.photoAlts[index])}" loading="${priority}" ${priority === 'eager' ? 'fetchpriority="high" ' : ''}decoding="async"></a>`;
}

function preview(l, kind) {
  const heading = kind === 'evidence' ? l.evidenceHeading : l.previewHeading;
  const intro = kind === 'evidence' ? l.evidenceText : l.summary;
  return `<!-- factory-demonstrations:start --><section class="section factory-preview" id="factory-demonstrations" aria-labelledby="factory-preview-title"><div class="container factory-preview-grid"><div><span class="section-label">${escape(l.label)}</span><h2 id="factory-preview-title">${escape(heading)}</h2><p>${escape(intro)}</p><div class="hero-actions"><a class="btn btn-primary" href="${route(l)}">${escape(l.open)}</a><a class="btn btn-outline" href="${l.prefix}/contact/#quoteForm">${escape(l.sample)}</a></div></div><a class="factory-preview-photo" href="${route(l)}"><img src="${assets}${photos[0]}-480.webp" srcset="${assets}${photos[0]}-480.webp 480w, ${assets}${photos[0]}-960.webp 960w" sizes="(max-width:680px) 82vw, 260px" width="480" height="854" alt="${escape(l.photoAlts[0])}" loading="lazy" decoding="async"></a></div></section><!-- factory-demonstrations:end -->`;
}

function article(l) {
  const template = fs.readFileSync(fileFor(`${l.prefix}/insights/cutting-propagation-root-observations/`), 'utf8');
  let header = requiredMatch(template, /<header class="site-header">[\s\S]*?<\/header>/, 'site header');
  const languageLinks = Object.values(content.locales).map(x => `<a href="${route(x)}" lang="${x.lang}"${x.lang === l.lang ? ' aria-current="page"' : ''}>${({'en':'EN','zh-CN':'中文','es':'ES','ar':'AR'})[x.lang]}</a>`).join('');
  header = header.replace(/<div[^>]*class="language-switcher"[^>]*>[\s\S]*?<\/div>/, `<div class="language-switcher" aria-label="Language">${languageLinks}</div>`);
  const tail = requiredMatch(template, /<footer class="site-footer">[\s\S]*?(?=<\/body>)/, 'footer and consent controls');
  const analytics = [...template.split('</head>')[0].matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)]
    .map(m => m[0]).filter(s => !s.includes('application/ld+json')).join('\n');
  const schemas = [...template.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => {
    const schema = JSON.parse(m[1]);
    return schema['@graph'] || [schema];
  });
  const organization = schemas.find(s => s['@type'] === 'Organization');
  if (!organization) throw new Error(`Missing organization in ${l.lang} template.`);
  const url = `${site}${route(l)}`;
  const graph = [organization, {
    '@type': 'Article', '@id': `${url}#article`, headline: l.h1, description: l.description,
    inLanguage: l.lang, datePublished: content.reviewDate, dateModified: content.reviewDate,
    author: {'@id': `${site}/#organization`}, publisher: {'@id': `${site}/#organization`},
    mainEntityOfPage: url, image: photos.map(name => `${site}${assets}${name}-960.webp`),
    citation: [content.source, 'https://www.ecopluggrow.com/technology/']
  }, {
    '@type': 'BreadcrumbList', itemListElement: [[l.home, `${site}${l.prefix}/`], [l.insights, `${site}${l.prefix}/insights/`], [l.h1, url]].map(([name, item], i) => ({'@type':'ListItem', position:i+1, name, item}))
  }, {
    '@type': 'FAQPage', mainEntity: l.faqs.map(([name, text]) => ({'@type':'Question', name, acceptedAnswer:{'@type':'Answer', text}}))
  }];
  const alternates = Object.values(content.locales).map(x => `<link rel="alternate" hreflang="${x.lang}" href="${site}${route(x)}">`).join('\n');
  const localProtocol = `${l.prefix}/insights/substrate-plug-ec-ph-testing-protocol/`;
  const protocolExists = fs.existsSync(fileFor(localProtocol));
  const protocol = protocolExists ? localProtocol : '/insights/substrate-plug-ec-ph-testing-protocol/';
  const protocolLanguage = protocolExists ? '' : ({en:'', 'zh-CN':'（英文）', es:' (en inglés)', ar:' (بالإنجليزية)'})[l.lang];
  const videoMarkup = videos.map((name, i) => `<figure><h3 id="factory-video-${i}">${i+1}. ${escape(l.videos[i][0])}</h3><video class="factory-video" controls playsinline preload="none" poster="${assets}${name}-poster.webp" width="${i<2?720:576}" height="${i<2?1280:1080}" style="aspect-ratio:${i<2?'9/16':'8/15'}" aria-labelledby="factory-video-${i}" aria-describedby="factory-video-note-${i}"><source src="${assets}${name}.mp4" type="video/mp4"><a href="${assets}${name}.mp4">${escape(l.fallback)}</a></video><figcaption id="factory-video-note-${i}">${escape(l.videos[i][1])}</figcaption><a href="${assets}${name}.mp4">${escape(l.fallback)}</a></figure>`).join('\n');
  return `<!DOCTYPE html>
<html lang="${l.lang}" dir="${l.dir}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(l.title)}</title><meta name="description" content="${escape(l.description)}">
<link rel="canonical" href="${url}">${alternates}
<link rel="alternate" hreflang="x-default" href="${site}${route(content.locales.en)}">
<meta property="og:type" content="article"><meta property="og:title" content="${escape(l.h1)}"><meta property="og:description" content="${escape(l.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}${assets}${photos[0]}-960.webp"><meta property="og:image:width" content="960"><meta property="og:image:height" content="1708"><meta property="og:image:alt" content="${escape(l.photoAlts[0])}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/assets/yunnan-rooting.css"><link rel="stylesheet" href="/assets/factory-demonstrations.css"><link rel="stylesheet" href="/assets/vendor/photoswipe/photoswipe.css">
${analytics}
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g, '\\u003c')}</script>
</head><body class="yunnan-article factory-article">${header}
<main><article class="container yunnan-story"><header class="yunnan-heading"><span class="section-label">${escape(l.label)}</span><h1>${escape(l.h1)}</h1><p class="article-meta">MCCS Growing Media · <time datetime="${content.reviewDate}">${escape(l.date)}</time></p><p class="lead">${escape(l.lead)}</p></header>
<section aria-labelledby="factory-photos"><h2 id="factory-photos">${escape(l.photosHeading)}</h2><div class="factory-photo-grid">${photos.map((_,i)=>`<figure>${image(l,i,'eager')}<figcaption>${escape(l.photoCaptions[i])}</figcaption></figure>`).join('')}</div><p>${escape(l.photoScope)}</p></section>
<section aria-labelledby="factory-videos"><h2 id="factory-videos">${escape(l.videoHeading)}</h2><p>${escape(l.videoIntro)}</p><div class="factory-video-grid">${videoMarkup}</div><p class="factory-source"><b>${escape(l.sourceLabel)}:</b> ${escape(l.sourceText)} <a href="${content.source}" target="_blank" rel="noopener">Eco Plug</a></p></section>
<section><h2>${escape(l.tableHeading)}</h2><p>${escape(l.tableIntro)}</p><div class="factory-table-wrap" role="region" aria-label="${escape(l.tableHeading)}" tabindex="0"><table class="yunnan-facts"><thead><tr>${l.columns.map(x=>`<th scope="col">${escape(x)}</th>`).join('')}</tr></thead><tbody>${l.rows.map(row=>`<tr>${row.map((x,i)=>i===0?`<th scope="row">${escape(x)}</th>`:`<td>${escape(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>
<section><h2>${escape(l.chemHeading)}</h2><p>${escape(l.chemText)}</p><p><a href="${protocol}"${protocolExists?'':' hreflang="en"'}>${escape(l.chemLink + protocolLanguage)}</a> · <a href="${l.prefix}/technical-evidence/">${escape(l.evidenceLink)}</a></p><p class="factory-source">${escape(l.documentNote)} <a href="https://www.ecopluggrow.com/wp-content/uploads/2026/10/XMIN2405000839CM01_EN2.pdf" target="_blank" rel="noopener">${escape(l.reportLabel)}</a></p></section>
<section><h2>${escape(l.faqHeading)}</h2><div class="technical-faq">${l.faqs.map(([q,a])=>`<details><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('')}</div></section>
<section class="yunnan-cta"><h2>${escape(l.ctaHeading)}</h2><p>${escape(l.ctaText)}</p><div class="hero-actions"><a class="btn btn-primary" href="${l.prefix}/contact/#quoteForm">${escape(l.sample)}</a><a class="btn btn-outline" href="${l.prefix}/products/">${escape(l.models)}</a></div><p><a href="${l.prefix}/insights/cutting-propagation-root-observations/">${escape(l.relatedLink)}</a></p></section>
</article></main>${tail}</body></html>\n`;
}

export function syncFactoryEntries() {
  for (const l of Object.values(content.locales)) {
    for (const [url, kind] of [[`${l.prefix}/`, 'home'], [`${l.prefix}/insights/`, 'insights'], [`${l.prefix}/technical-evidence/`, 'evidence']]) {
      const file = fileFor(url);
      if (!fs.existsSync(file)) continue;
      let source = fs.readFileSync(file, 'utf8');
      source = source.replace(/<!-- factory-demonstrations:start -->[\s\S]*?<!-- factory-demonstrations:end -->/g, '');
      if (!source.includes('/assets/factory-demonstrations.css')) source = source.replace('</head>', '<link rel="stylesheet" href="/assets/factory-demonstrations.css"></head>');
      // Each existing hero is the first complete section inside main.
      const hero = /(<main\b[^>]*>[\s\S]*?<\/section>)/;
      if (!hero.test(source)) throw new Error(`Missing insertion point in ${url}`);
      source = source.replace(hero, `$1${preview(l, kind)}`);
      fs.writeFileSync(file, source, 'utf8');
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const l of Object.values(content.locales)) {
    const file = fileFor(route(l));
    fs.mkdirSync(path.dirname(file), {recursive:true});
    fs.writeFileSync(file, article(l), 'utf8');
  }
  syncFactoryEntries();
  console.log('Synchronized four-language factory media guide and buyer entry points.');
}
