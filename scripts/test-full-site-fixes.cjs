const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const products = JSON.parse(read('data/products.json'));
const originalFields = products.map(({material,...product}) => product);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(originalFields)).digest('hex'),
 '05dc3105e8fe2de4467ef01112d89199cba6af6eb41704d30952b93da1dc7702',
 'Only the explicitly authorized material disclosure may change; preserve every other product field.');
assert.equal(products.length,28);
assert.ok(products.every(product => product.material.includes('project-specific binder formulation')));
const locales = JSON.parse(read('data/catalog-locales.json'));
for (const lang of ['es','ar','cn']) {
 assert.equal(Object.keys(locales[lang].models).length,products.length);
 for (const product of products) {
  const translated = locales[lang].models[product.model];
  assert.ok(translated.name && translated.description && translated.tray && translated.size);
  assert.deepEqual(translated.size.match(/\d+(?:\.\d+)?/g),product.size.match(/\d+(?:\.\d+)?/g),'Localized dimensions must preserve all numeric values.');
 }
}
const topics = ['how-to-choose-substrate-plugs','how-to-evaluate-tray-fit','mccs-vs-traditional-substrate','middle-east-water-saving-substrate','private-label-seed-starter-checklist','rockwool-alternative-for-retail-kits','sample-to-bulk-shipping-guide','hydroponic-grow-plug-guide'];
for (const lang of ['es','ar']) for (const slug of topics) {
 const html=read(lang+'/insights/'+slug+'/index.html');
 assert.doesNotMatch(html,/<meta\b(?=[^>]*name=["']robots["'])(?=[^>]*content=["'][^"']*noindex)/);
 assert.ok(html.includes('dateModified":"2026-10-14"'));
 assert.ok(html.includes('hreflang="'+lang+'"'));
 const body=html.match(/<main>([\s\S]*?)<\/main>/)[1];
 assert.doesNotMatch(body,/Buyer checklist|Related resources|Growing Media Insight|Continue with the next practical/);
 assert.equal((body.match(/<h2>/g)||[]).length,4);
 assert.ok(read('sitemap.xml').includes('/'+lang+'/insights/'+slug+'/'));
}
for (const prefix of ['', 'cn/', 'es/', 'ar/']) {
 assert.ok(read(prefix+'technical-evidence/index.html').includes('CANIN24009790301'));
 assert.doesNotMatch(read(prefix+'technical-evidence/index.html'),/CANIN24009790302/);
 assert.match(read(prefix+'products/index.html'),/src="\/assets\/products\.js(?:\?[^"]*)?"/);
 assert.doesNotMatch(read(prefix+'products/index.html'),/src="\/assets\/products-cn\.js/);
 assert.ok(read(prefix+'private-label/index.html').includes('id="packaging"'));
 const form=read(prefix+'contact/index.html');
 assert.ok(form.includes('/assets/model-inquiry.js'));
 assert.ok(form.includes('https://formspree.io/f/mredrnea'));
}
function pages(dir) {
 return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry => {
  if(entry.isDirectory()) return ['.git','node_modules','output','outputs','reports','tmp','.lighthouseci'].includes(entry.name)?[]:pages(path.join(dir,entry.name));
  return entry.name.endsWith('.html') && entry.name!=='admin.html' ? [path.join(dir,entry.name)] : [];
 });
}
for(const file of pages(root)) {
 const html=fs.readFileSync(file,'utf8');
 if(!html.includes('googletagmanager.com/gtag/js')) continue;
 const consent=html.match(/<script id="mccs-consent-default">([\s\S]*?)<\/script>/);
 assert.ok(consent,file+' must set consent before loading analytics.');
 assert.ok(html.indexOf('id="mccs-consent-default"')<html.indexOf('googletagmanager.com/gtag/js'),file);
 for(const stored of ['', 'denied', 'granted']) {
  const context={localStorage:{getItem:key=>key==='mccs_cookie_consent'?stored:null}};
  context.window=context;
  vm.runInNewContext(consent[1],context);
  const defaults=Array.from(context.dataLayer[0]);
  assert.equal(defaults[2].analytics_storage,stored==='granted'?'granted':'denied');
 }
}
const mobile=read('assets/mobile-ux.js');
for(const stored of ['', 'denied', 'granted']) {
 const values=new Map([['mccs_cookie_consent',stored]]);
 function element() {return {style:{},children:[],listeners:{},classList:{add(){},remove(){}},setAttribute(){},focus(){},scrollIntoView(){},addEventListener(type,fn){this.listeners[type]=fn;},appendChild(node){this.children.push(node);},insertBefore(node){this.children.push(node);},querySelector(selector){return this.children.find(node=>'.'+node.className===selector)||null;}};}
 const cookie=element(), accept=element(), footer=element();
 const context={localStorage:{getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)},
 document:{readyState:'complete',documentElement:{lang:'en'},body:element(),getElementById:id=>id==='cookieBanner'?cookie:accept,
 querySelector:selector=>selector.startsWith('.site-footer')?footer:null,createElement:element},setTimeout:fn=>fn(),clearTimeout(){}};
 context.window={gtag(){}};
 vm.runInNewContext(mobile.slice(0,mobile.indexOf('    // Make contact CTAs'))+'  });\n})();',context);
 footer.children[0].listeners.click();
 assert.equal(cookie.style.display,'');
 cookie.querySelector('.cookie-reject').listeners.click();
 assert.equal(values.get('mccs_cookie_consent'),'denied');
 footer.children[0].listeners.click();
 accept.listeners.click();
 assert.equal(values.get('mccs_cookie_consent'),'granted','Returning visitors can change their choice.');
}
assert.match(read('assets/form-protection.js'),/const hostedVerification = true;/);
assert.doesNotMatch(read('assets/products.js'),/mobileCompareCards/);
async function modelHarness(query, ok=true) {
 let select;
 const message={value:'Existing buyer notes must remain unchanged',before(node){select=node;}};
 const form={querySelector(){return message;}};
 const context={URLSearchParams, location:{search:query}, Option:class {constructor(label,value){this.label=label;this.value=value;}},
  document:{documentElement:{lang:'en'},getElementById(){return form;},createElement(){return {value:'',options:[],add(option){this.options.push(option);},setAttribute(){},remove(){this.removed=true;}};}},
  fetch:async()=>({ok,json:async()=>products})};
 vm.runInNewContext(read('assets/model-inquiry.js'),context);
 await new Promise(setImmediate);
 return {select,message};
}
(async()=>{
 const valid=await modelHarness('?model=CF-200');
 assert.equal(valid.select.value,'CF-200');
 assert.equal(valid.select.options.length,29);
 assert.equal(valid.message.value,'Existing buyer notes must remain unchanged');
 const invalid=await modelHarness('?model=CF-999%3Cscript%3E');
 assert.equal(invalid.select.value,'');
 const failed=await modelHarness('?model=CF-200',false);
 assert.equal(failed.select.removed,true,'Keep the native form usable when optional model data is unavailable.');
 console.log('PASS: protected product fields, complete locale catalogs, 16 indexable translations, model prefill and fallback, packaging anchors and consent including both legal pages.');
})().catch(error=>{console.error(error);process.exitCode=1;});
