import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const productCount = JSON.parse(
  fs.readFileSync(path.join(root, 'data/products.json'), 'utf8')
).length;

function update(file, replacements) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) html = html.replaceAll(from, to);
  fs.writeFileSync(filePath, html, 'utf8');
}

function ensureHeadMarkup(file, markup) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes(markup)) html = html.replace('</head>', `${markup}</head>`);
  fs.writeFileSync(filePath, html, 'utf8');
}

const spanishCommon = [
  ['Factory-Direct Growing Media', 'Sustratos moldeados para compradores B2B'],
  ['Factory-direct supply', 'Suministro coordinado con fábrica'],
  ['Molded substrate plugs, custom formulation and private-label packaging for B2B sourcing.', 'Plugs de sustrato moldeado, formulación por proyecto y envases de marca privada para compras B2B.'],
  ['Custom Mold Design', 'Diseño de molde a medida'],
  ['Tray-fit, cup-fit and specialty shapes can be developed for qualified OEM projects.', 'Se pueden desarrollar formatos para bandejas, vasos y aplicaciones especiales en proyectos OEM cualificados.'],
  ['Private Label Packaging', 'Envases de marca privada'],
  ['Bulk cartons, retail boxes, refill pouches and instruction cards are available by project.', 'Hay cajas a granel, cajas minoristas, bolsas de recarga y tarjetas de instrucciones según el proyecto.'],
  ['What is MCCS made from?', '¿De qué están hechos los plugs MCCS?'],
  ['MCCS products use molded coconut coir and peat substrate with adjustable plant-fiber binder ratios for different applications.', 'Los productos MCCS utilizan un sustrato moldeado de fibra de coco y turba; la proporción de aglutinante vegetal puede ajustarse según la aplicación.'],
  ['Can you customize the mold?', '¿Se puede personalizar el molde?'],
  ['Yes. Custom mold design can be discussed for qualified B2B projects with tray, cup or retail packaging requirements.', 'Sí. El diseño de moldes puede evaluarse para proyectos B2B cualificados con requisitos de bandeja, vaso o envase minorista.'],
  ['What is the MOQ?', '¿Cuál es la cantidad mínima de pedido?'],
  ['MOQ depends on model, carton size, retail packaging and shipping method. Trial orders are available for qualified B2B buyers.', 'La cantidad mínima depende del modelo, la caja, el envase y el método de envío. Se pueden preparar pruebas para compradores B2B cualificados.'],
  ['Can you provide SGS documents?', '¿Pueden facilitar documentación SGS?'],
  ['SGS test report and batch testing information can be shared with eligible buyers during project review.', 'El informe SGS y la información de pruebas aplicable pueden compartirse con compradores cualificados durante la revisión del proyecto.'],
  ['How long is sample preparation?', '¿Cuánto tarda la preparación de muestras?'],
  ['Standard sample preparation is usually 3–7 business days after model confirmation.', 'La preparación estándar suele requerir entre 3 y 7 días laborables después de confirmar el modelo.'],
  ['Do you support private label packaging?', '¿Ofrecen envases de marca privada?'],
  ['Yes. Retail box, refill pouch, carton markings and instruction cards can be developed after product selection.', 'Sí. Tras seleccionar el producto se pueden desarrollar cajas minoristas, bolsas de recarga, marcas de cartón y tarjetas de instrucciones.'],
  ['Send your application, model, target market and monthly volume so we can recommend a suitable sample and packaging plan.', 'Indique la aplicación, el modelo, el mercado de destino y el volumen mensual para que podamos recomendar una muestra y un plan de embalaje.'],
  ['CF Series Catalog', 'Catálogo de la serie CF'],
  ['Compare Models', 'Comparar modelos'],
  ['Privacy Policy', 'Política de privacidad'],
  ['Guangzhou, Guangdong, China', 'Guangzhou, Guangdong, China']
];

update('es/index.html', [
  ...spanishCommon,
  ['Fabricante Premium MCCS | Directo de Fábrica', 'Proveedor B2B de plugs de sustrato moldeado'],
  ['Hasta 30% ahorro de agua', 'Hidratación validada mediante muestras'],
  ['La estructura moldeada patentada de MCCS ofrece un 30% de ahorro de agua comprobado frente a sustratos sueltos.', 'La retención de agua y el intervalo de riego deben validarse con el cultivo, la bandeja y el protocolo de prueba del comprador.'],
  ['Compare 30 modelos de sustrato', `Compare ${productCount} modelos de sustrato`],
  ['SGS test report for MCCS molded coconut coir and peat substrate plugs', 'Informe SGS disponible para la revisión de proyectos MCCS cualificados']
]);

const arabicCommon = [
  ['Factory-Direct Growing Media', 'وسائط زراعة مصبوبة للمشترين التجاريين'],
  ['Factory-direct supply', 'توريد منسق مع المصنع'],
  ['Molded substrate plugs, custom formulation and private-label packaging for B2B sourcing.', 'سدادات ركيزة مصبوبة وتركيبات حسب المشروع وتغليف بعلامة خاصة للمشترين التجاريين.'],
  ['Custom Mold Design', 'تصميم قالب مخصص'],
  ['Tray-fit, cup-fit and specialty shapes can be developed for qualified OEM projects.', 'يمكن تطوير أشكال تناسب الصواني والأكواب والتطبيقات الخاصة للمشاريع المؤهلة.'],
  ['Private Label Packaging', 'تغليف بعلامة خاصة'],
  ['Bulk cartons, retail boxes, refill pouches and instruction cards are available by project.', 'تتوفر كراتين بالجملة وعبوات بيع بالتجزئة وأكياس إعادة تعبئة وبطاقات تعليمات حسب المشروع.'],
  ['What is MCCS made from?', 'مم تصنع سدادات MCCS؟'],
  ['MCCS products use molded coconut coir and peat substrate with adjustable plant-fiber binder ratios for different applications.', 'تستخدم منتجات MCCS ركيزة مصبوبة من ألياف جوز الهند والبيتموس، ويمكن تعديل نسبة الرابط النباتي حسب التطبيق.'],
  ['Can you customize the mold?', 'هل يمكن تخصيص القالب؟'],
  ['Yes. Custom mold design can be discussed for qualified B2B projects with tray, cup or retail packaging requirements.', 'نعم، يمكن مناقشة تصميم قالب مخصص للمشاريع التجارية المؤهلة وفق متطلبات الصينية أو الوعاء أو العبوة.'],
  ['What is the MOQ?', 'ما الحد الأدنى للطلب؟'],
  ['MOQ depends on model, carton size, retail packaging and shipping method. Trial orders are available for qualified B2B buyers.', 'يعتمد الحد الأدنى للطلب على الموديل والكرتون والتغليف وطريقة الشحن، وتتوفر طلبات تجريبية للمشترين المؤهلين.'],
  ['Can you provide SGS documents?', 'هل تتوفر وثائق SGS؟'],
  ['SGS test report and batch testing information can be shared with eligible buyers during project review.', 'يمكن مشاركة تقرير SGS ومعلومات الاختبار المطبقة مع المشترين المؤهلين أثناء مراجعة المشروع.'],
  ['How long is sample preparation?', 'كم يستغرق تجهيز العينة؟'],
  ['Standard sample preparation is usually 3–7 business days after model confirmation.', 'يستغرق تجهيز العينة القياسية عادة من 3 إلى 7 أيام عمل بعد تأكيد الموديل.'],
  ['Do you support private label packaging?', 'هل يتوفر تغليف بعلامة خاصة؟'],
  ['Yes. Retail box, refill pouch, carton markings and instruction cards can be developed after product selection.', 'نعم، يمكن تطوير عبوات البيع وأكياس إعادة التعبئة وعلامات الكرتون وبطاقات التعليمات بعد اختيار المنتج.'],
  ['Send your application, model, target market and monthly volume so we can recommend a suitable sample and packaging plan.', 'أرسل التطبيق والموديل والسوق المستهدف والحجم الشهري لنقترح عينة وخطة تغليف مناسبة.'],
  ['CF Series Catalog', 'كتالوج سلسلة CF'],
  ['Compare Models', 'مقارنة الموديلات'],
  ['Privacy Policy', 'سياسة الخصوصية'],
  ['SGS test report for MCCS molded coconut coir and peat substrate plugs', 'تقرير SGS متاح لمراجعة مشاريع MCCS المؤهلة']
];

update('ar/index.html', [
  ...arabicCommon,
  ['مصنع MCCS متميز | توريد مباشر من المصنع', 'مورد تجاري لسدادات الركيزة المصبوبة'],
  ['توفير مياه حتى 30%', 'اختبار الترطيب حسب المشروع'],
  ['توفر البنية المصبوبة الخاصة بـ MCCS وفراً مثبتاً في المياه بنسبة 30% مقارنة بالركائز السائبة.', 'يجب التحقق من احتفاظ الماء وفاصل الري باستخدام المحصول والصينية وبروتوكول الاختبار الفعلي.'],
  ['قارن 30 نموذجاً', `قارن ${productCount} نموذجاً`]
]);

update('products/conical-plugs/index.html', [
  ['used across ZY formats', 'used across CF Series formats'],
  ['compare ZY dimensions', 'compare CF Series dimensions']
]);

update('es/products/conical-plugs/index.html', [
  ...spanishCommon,
  ['Catálogo técnico de plugs cónicos ZY', 'Catálogo técnico de plugs cónicos CF'],
  ['Use the MCCS CF Series product catalog for molded coconut coir and peat substrate plug models.', 'Consulte el catálogo MCCS CF para comparar modelos, dimensiones, bandejas, embalaje y condiciones de pedido.'],
  ['CF Series Product Catalog', 'Catálogo de productos de la serie CF'],
  ['Please use the updated CF Series catalog for model selection, size, tray fit, carton quantity and MOQ information.', 'Utilice el catálogo actualizado de la serie CF para comparar modelos, dimensiones, bandejas, cantidades por caja y condiciones de pedido.'],
  ['Open Product Catalog', 'Abrir el catálogo de productos']
]);

update('ar/products/conical-plugs/index.html', [
  ...arabicCommon,
  ['الكتالوج الفني لسدادات ZY المخروطية', 'الكتالوج الفني لسدادات CF المخروطية'],
  ['Use the MCCS CF Series product catalog for molded coconut coir and peat substrate plug models.', 'استخدم كتالوج MCCS CF لمقارنة الموديلات والأبعاد وملاءمة الصواني والتغليف وشروط الطلب.'],
  ['CF Series Product Catalog', 'كتالوج منتجات سلسلة CF'],
  ['Please use the updated CF Series catalog for model selection, size, tray fit, carton quantity and MOQ information.', 'استخدم كتالوج سلسلة CF المحدث لاختيار الموديل والمقاس والصينية وكمية الكرتون وشروط الطلب.'],
  ['Open Product Catalog', 'فتح كتالوج المنتجات']
]);

update('es/insights/hydroponic-grow-plug-guide/index.html', [
  ...spanishCommon,
  ['How to select molded grow plugs for commercial and home hydroponic systems.', 'Cómo seleccionar plugs moldeados para sistemas hidropónicos comerciales y domésticos.'],
  ['Hydroponic Grow Plug Selection Guide', 'Guía para elegir plugs hidropónicos'],
  ['Growing Media Insight', 'Guía de sustratos'],
  ['June 1, 2026', '1 de junio de 2026'],
  ['4 min read', '4 min de lectura'],
  ['Hydroponic buyers should confirm holder diameter, water contact, plug stability and root access before selecting a model. Washed-grade options and sample testing help reduce sourcing risk in commercial programs.', 'Antes de elegir un modelo, confirme el diámetro del soporte, el contacto con el agua, la estabilidad del plug y el acceso de las raíces. La selección final debe basarse en muestras y pruebas con el sistema real.'],
  ['Buyer checklist', 'Lista de comprobación del comprador'],
  ['Confirm application and target tray or holder.', 'Confirme la aplicación y la bandeja o soporte.'],
  ['Request wet-size data and sample testing before bulk order.', 'Solicite dimensiones en húmedo y pruebe muestras antes del pedido a granel.'],
  ['Clarify packaging format, carton quantity and monthly volume.', 'Defina el embalaje, la cantidad por caja y el volumen mensual.'],
  ['Discuss SGS test report and export documents if required by your market.', 'Revise el informe SGS y los documentos de exportación exigidos por su mercado.'],
  ['Continue with the next practical sourcing step based on this topic.', 'Continúe con el siguiente paso práctico de selección.'],
  ['Related resources', 'Recursos relacionados'],
  ['Products', 'Productos']
]);

update('ar/insights/hydroponic-grow-plug-guide/index.html', [
  ...arabicCommon,
  ['How to select molded grow plugs for commercial and home hydroponic systems.', 'كيفية اختيار سدادات زراعة مصبوبة للأنظمة المائية التجارية والمنزلية.'],
  ['Hydroponic Grow Plug Selection Guide', 'دليل اختيار سدادات الزراعة المائية'],
  ['Growing Media Insight', 'دليل وسائط الزراعة'],
  ['June 1, 2026', '1 يونيو 2026'],
  ['4 min read', 'قراءة 4 دقائق'],
  ['Hydroponic buyers should confirm holder diameter, water contact, plug stability and root access before selecting a model. Washed-grade options and sample testing help reduce sourcing risk in commercial programs.', 'قبل اختيار الموديل، تحقق من قطر الحامل وملامسة الماء وثبات السدادة ووصول الجذور. يعتمد الاختيار النهائي على عينة واختبار بالنظام الفعلي.'],
  ['Buyer checklist', 'قائمة مراجعة المشتري'],
  ['Confirm application and target tray or holder.', 'أكد التطبيق والصينية أو الحامل المستهدف.'],
  ['Request wet-size data and sample testing before bulk order.', 'اطلب أبعاد الحالة المبللة واختبر العينات قبل الطلب بالجملة.'],
  ['Clarify packaging format, carton quantity and monthly volume.', 'حدد التغليف وكمية الكرتون والحجم الشهري.'],
  ['Discuss SGS test report and export documents if required by your market.', 'راجع تقرير SGS ووثائق التصدير المطلوبة في سوقك.'],
  ['Continue with the next practical sourcing step based on this topic.', 'انتقل إلى خطوة الاختيار العملية التالية.'],
  ['Related resources', 'موارد ذات صلة'],
  ['Products', 'المنتجات']
]);

for (const locale of ['', 'cn/', 'es/', 'ar/']) {
  const file = `${locale}contact/index.html`;
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(
    /(<input\b[^>]*\bname=["']whatsapp["'][^>]*?)\srequired(?:=["']["'])?([^>]*>)/i,
    '$1$2'
  );
  fs.writeFileSync(filePath, html, 'utf8');
}

const optionalPhoneLabels = {
  'contact/index.html': ['WhatsApp / Phone', 'WhatsApp / Phone (optional)'],
  'cn/contact/index.html': ['WhatsApp / 电话', 'WhatsApp / 电话（可选）'],
  'es/contact/index.html': ['WhatsApp / teléfono', 'WhatsApp / teléfono (opcional)'],
  'ar/contact/index.html': ['واتساب / الهاتف', 'واتساب / الهاتف (اختياري)']
};
for (const [file, [current, optional]] of Object.entries(optionalPhoneLabels)) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const inputPattern = new RegExp(`(<input\\b[^>]*\\bname=["']whatsapp["'][^>]*>)`, 'i');
  html = html.replace(inputPattern, (input) => input
    .replace(`aria-label="${current}"`, `aria-label="${optional}"`)
    .replace(`placeholder="${current}"`, `placeholder="${optional}"`));
  fs.writeFileSync(filePath, html, 'utf8');
}

const filterLabels = {
  'products/index.html': 'Filter by product category',
  'cn/products/index.html': '按产品类别筛选',
  'es/products/index.html': 'Filtrar por categoría de producto',
  'ar/products/index.html': 'تصفية حسب فئة المنتج'
};
for (const [file, label] of Object.entries(filterLabels)) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace('<select id="categoryFilter">', `<select id="categoryFilter" aria-label="${label}">`);
  fs.writeFileSync(filePath, html, 'utf8');
}

for (const file of Object.keys(filterLabels)) {
  const responsivePreload = '<link rel="preload" as="image" href="/assets/backgrounds/products-bg.webp" media="(min-width: 761px)" fetchpriority="high">';
  update(file, [[
    '<link rel="preload" as="image" href="/assets/backgrounds/products-bg.webp" fetchpriority="high">',
    responsivePreload
  ]]);
  ensureHeadMarkup(file, responsivePreload);
}

console.log(`Normalized buyer-facing claims and localized priority content for ${productCount} products.`);
