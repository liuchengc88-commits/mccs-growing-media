import fs from 'node:fs';
import { syncPublicSgsSource } from './public-sgs-source.mjs';
for(const language of ['en','cn','es','ar']) {
 const file=(language==='en'?'':language+'/')+'technical-evidence/index.html';
 fs.writeFileSync(file,syncPublicSgsSource(fs.readFileSync(file,'utf8'),language));
}
const pages = ['contact/index.html','cn/contact/index.html','es/contact/index.html','ar/contact/index.html'];
for (const file of pages) {
 let html = fs.readFileSync(file,'utf8');
 if (!html.includes('/assets/model-inquiry.js')) html=html.replace('</body>','<script src="/assets/model-inquiry.js" defer></script></body>');
 fs.writeFileSync(file,html);
}
for (const prefix of ['', 'cn/', 'es/', 'ar/']) {
 const file = prefix+'private-label/index.html';
 let html = fs.readFileSync(file,'utf8');
 if (!html.includes('id="packaging"')) {
  const main = html.indexOf('<main>');
  const firstEnd = html.indexOf('</section>',main);
  const section = html.indexOf('<section',firstEnd);
  if (section < 0) throw new Error('Packaging section unavailable: '+file);
  html=html.slice(0,section)+html.slice(section).replace('<section','<section id="packaging"');
 }
 fs.writeFileSync(file,html);
}
const catalogCopy = {
 es: {
 'CF Series · MCCS Factory Direct':'Serie CF · Suministro directo de fábrica',
 'Download CSV':'Descargar CSV','Core B2B Information':'Información para compras B2B',
 'Material:':'Material:','Custom formulation:':'Formulación del proyecto:',
 'Carton quantity:':'Cantidad por caja:','Testing:':'Documentación:',
 'Molded coconut coir and peat substrate with adjustable formulation.':'Sustrato moldeado de coco y turba; confirme la formulación del proyecto.',
 'Coco coir, peat moss and binder ratio can be discussed by crop, tray and packaging plan.':'Confirme la formulación y el aglutinante según el cultivo, la bandeja y el embalaje.',
 'Reference only. Final quantity per carton may change by outer-carton size, retail packaging and shipping method.':'Cifras de referencia. La cantidad final depende de la caja, el embalaje y el transporte.',
 'SGS test report and batch testing can be discussed for eligible B2B projects.':'Confirme el informe aplicable y el alcance de pruebas para su proyecto.',
 'All Categories':'Todas las categorías','All Products':'Todos los modelos','Seedling':'Plántulas','Orchid':'Orquídeas','Tissue Culture':'Cultivo de tejidos','Hydroponic':'Hidroponía','Succulent':'Suculentas',
 'MCCS Technical Capability':'Desarrollo según el proyecto','Expert Tips':'Selección por aplicación',
 'Comparison Table':'Tabla de especificaciones','Compare Models by Size, Tray Fit and Application':'Comparar tamaño, bandeja y aplicación',
 'Model':'Modelo','Product':'Producto','Size':'Tamaño','Tray / Container Fit':'Bandeja / soporte','Application':'Aplicación',
 'MCCS puede ajustar proporciones de coco, turba y aglutinante vegetal según planta, bandeja, hidratación y empaque retail. Moldes personalizados disponibles para proyectos B2B cualificados.':'La formulación y los moldes se revisan según el cultivo, la bandeja y el embalaje. Confirme la documentación aplicable y apruebe muestras antes de comprar.'
 },
 ar: {
 'CF Series · MCCS Factory Direct':'سلسلة CF · توريد مباشر من المصنع',
 'Download CSV':'تنزيل CSV','Core B2B Information':'معلومات الشراء التجاري',
 'Material:':'المادة:','Custom formulation:':'تركيبة المشروع:','Carton quantity:':'كمية الكرتون:','Testing:':'الوثائق:',
 'Molded coconut coir and peat substrate with adjustable formulation.':'وسط مقولب من ألياف جوز الهند والخث؛ تُؤكد تركيبة المشروع.',
 'Coco coir, peat moss and binder ratio can be discussed by crop, tray and packaging plan.':'تُراجع التركيبة والمادة الرابطة حسب المحصول والصينية والتغليف.',
 'Reference only. Final quantity per carton may change by outer-carton size, retail packaging and shipping method.':'أرقام مرجعية؛ تعتمد الكمية النهائية على الكرتون والتغليف والشحن.',
 'SGS test report and batch testing can be discussed for eligible B2B projects.':'أكد التقرير المعني ونطاق فحوص المشروع.',
 'All Categories':'جميع الفئات','All Products':'جميع الطرازات','Seedling':'الشتلات','Orchid':'الأوركيد','Tissue Culture':'زراعة الأنسجة','Hydroponic':'الزراعة المائية','Succulent':'العصاريات',
 'MCCS Technical Capability':'تطوير حسب المشروع','Expert Tips':'الاختيار حسب الاستخدام',
 'Comparison Table':'جدول المواصفات','Compare Models by Size, Tray Fit and Application':'مقارنة المقاس والصينية والاستخدام',
 'Model':'الطراز','Product':'المنتج','Size':'المقاس','Tray / Container Fit':'الصينية / الحامل','Application':'الاستخدام',
 'يمكن لـ MCCS مناقشة نسب جوز الهند والبيتموس والمواد الرابطة النباتية حسب نوع النبات وحجم الدرج وسلوك الترطيب وخطة التغليف.':'تُراجع التركيبة والقوالب حسب المحصول والصينية والتغليف. أكد الوثائق المعنية واعتمد العينات قبل الشراء.'
 }
};
for (const [locale,replacements] of Object.entries(catalogCopy)) {
 const file=locale+'/products/index.html';
 let html=fs.readFileSync(file,'utf8');
 // Replace text nodes, not URLs, model identifiers, JSON-LD or filter keys.
 html=html.replace(/(<script\b[^>]*>[\s\S]*?<\/script>)|>([^<]+)</g,(match,script,text)=>{
  if(script) return script;
  let output=text;
  for(const [from,to] of Object.entries(replacements)) {
   if (output.trim()===from) output=output.replace(from,to);
   else if (from.length>24) output=output.replaceAll(from,to);
  }
  for(const [from,to] of Object.entries(replacements)) {
   if (['Seedling','Orchid','Tissue Culture','Hydroponic','Succulent'].includes(from)) output=output.replace(new RegExp('^(\\s*[^\\p{L}]*?)'+from+'(\\s*)$','u'),'$1'+to+'$2');
  }
  return '>'+output+'<';
 });
 const placeholder=locale==='es'?'Buscar modelo o aplicación':'البحث بالطراز أو الاستخدام';
 html=html.replace(/(<input\b(?=[^>]*id="productFilter")[^>]*placeholder=")[^"]*"/,'$1'+placeholder+'"');
 fs.writeFileSync(file,html);
}
console.log('Synchronized model inquiry, packaging anchors and localized catalog headings.');
for (const lang of ['es','ar']) {
 const common=lang==='es' ? {
  'CF Series Catalog':'Catálogo de la serie CF','Compare Models':'Comparar modelos','Privacy Policy':'Política de privacidad',
  'Request Model Recommendation':'Solicitar recomendación de modelo','Products':'Productos','Private Label':'Marca privada','Contact':'Contacto',
  'Search model, product, tray fit, application':'Buscar modelo, producto, bandeja o aplicación','Application filters':'Filtros de aplicación','Open navigation':'Abrir navegación'
 } : {
  'CF Series Catalog':'كتالوج سلسلة CF','Compare Models':'مقارنة الطرازات','Privacy Policy':'سياسة الخصوصية',
  'Request Model Recommendation':'طلب توصية بطراز','Products':'المنتجات','Private Label':'العلامة الخاصة','Contact':'اتصال',
  'Search model, product, tray fit, application':'البحث بالطراز أو المنتج أو الصينية أو الاستخدام','Application filters':'مرشحات الاستخدام','Open navigation':'فتح التنقل'
 };
 for(const name of fs.readdirSync(lang,{recursive:true})) {
  if(!name.endsWith('.html')) continue;
  const file=lang+'/'+name;
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/(<script\b[^>]*>[\s\S]*?<\/script>)|>([^<]+)</g,(match,script,text)=>{
   if(script) return script;
   return '>'+text.replace(text.trim(),common[text.trim()]||text.trim())+'<';
  });
  for(const [from,to] of Object.entries(common)) {
   html=html.replaceAll('aria-label="'+from+'"','aria-label="'+to+'"').replaceAll('placeholder="'+from+'"','placeholder="'+to+'"');
  }
  fs.writeFileSync(file,html);
 }
}
