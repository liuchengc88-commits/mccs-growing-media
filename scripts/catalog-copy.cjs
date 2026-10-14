const models = {
  'CF-001': ['Plug hidropónico cónico 6.5 cm','Tapón estrecho y cónico para sistemas hidropónicos compactos; confirme el soporte y la abertura de plantación.','قالب مائي مخروطي 6.5 cm','قالب ضيق مخروطي للأنظمة المائية المدمجة؛ تُراجع فتحة الزراعة والحامل بالعينة.'],
  'CF-003': ['Plug de iniciación doméstica 3.7 cm','Formato compacto para kits de siembra, recambios y pequeñas bandejas de vivero.','قالب للزراعة المنزلية 3.7 cm','صيغة مدمجة لأطقم البذر وعبوات التعبئة وصواني المشاتل الصغيرة.'],
  'CF-005': ['Plug para esquejes 5.0 cm','Formato estrecho y profundo para evaluar el soporte de esquejes y la manipulación durante el trasplante.','قالب لإكثار العقل 5.0 cm','صيغة ضيقة وعميقة لتقييم دعم العقل والمناولة عند الشتل.'],
  'CF-006': ['Plug para esquejes 4.1 cm','Formato intermedio para ensayos de esquejes y compatibilidad con bandejas.','قالب لإكثار العقل 4.1 cm','صيغة متوسطة لتجارب العقل وملاءمة الصواني.'],
  'CF-015': ['Plug para orquídeas 4.5 cm','Formato para bandejas de 60 celdas y planificación del trasplante por etapas.','قالب للأوركيد 4.5 cm','صيغة لصواني 60 خلية وتخطيط الشتل على مراحل.'],
  'CF-017': ['Plug para orquídeas 5.3 cm','Para plantas jóvenes de orquídea, transición del cultivo de tejidos y primer trasplante.','قالب للأوركيد 5.3 cm','للأوركيد الصغير والانتقال من زراعة الأنسجة والشتل المبكر.'],
  'CF-025': ['Copa de cultivo para orquídeas 6.5 cm','Mayor volumen de sustrato para etapas intermedias y trasplante a recipientes mayores.','كوب زراعة للأوركيد 6.5 cm','حجم وسط أكبر للمراحل المتوسطة والشتل في أوعية أكبر.'],
  'CF-028': ['Copa alta para orquídeas 8.3 cm','Formato alto para plantas de mayor desarrollo; compruebe la compatibilidad del recipiente.','كوب أوركيد طويل 8.3 cm','صيغة طويلة للنباتات الأكثر تطوراً؛ تُراجع ملاءمة الوعاء.'],
  'CF-035': ['Copa alta para orquídeas 10.5 cm','Copa de mayor tamaño para plantas desarrolladas y proyectos de trasplante.','كوب أوركيد طويل 10.5 cm','كوب أكبر للنباتات المتطورة ومشاريع الشتل.'],
  'CF-060': ['Plug de propagación de orquídeas 4.8 cm','Para evaluar propagación de Phalaenopsis y manejo en bandejas de 60 celdas.','قالب إكثار أوركيد 4.8 cm','لتقييم إكثار الفالينوبسيس والمناولة في صواني 60 خلية.'],
  'CF-060B': ['Plug de propagación de orquídeas 5.2 cm','Formato de mayor volumen para Phalaenopsis en bandejas de 60 celdas.','قالب إكثار أوركيد 5.2 cm','صيغة ذات حجم أكبر للفالينوبسيس في صواني 60 خلية.'],
  'CF-067': ['Copa para suculentas 6.7 cm','Para plantación de suculentas, recipientes decorativos y kits de jardinería doméstica.','كوب زراعة للعصاريات 6.7 cm','لزراعة العصاريات والأوعية الزخرفية وأطقم الحدائق المنزلية.'],
  'CF-072': ['Plug para cultivo de tejidos 4.0 cm','Para aclimatación de plantas de laboratorio en bandejas de 72 celdas.','قالب لزراعة الأنسجة 4.0 cm','لأقلمة نباتات المختبر في صواني 72 خلية.'],
  'CF-104': ['Plug de vivero 4.0 cm','Diámetro superior de 3.1 cm para ensayos de siembra, propagación y ajuste a bandejas.','قالب للمشاتل 4.0 cm','بقطر علوي 3.1 cm لتجارب البذر والإكثار وملاءمة الصواني.'],
  'CF-128': ['Plug para cultivo de tejidos 3.8 cm','Formato partido para colocar la planta alrededor de las raíces antes de introducirla en una bandeja de 128 celdas.','قالب لزراعة الأنسجة 3.8 cm','صيغة مشقوقة لوضع النبات حول الجذور قبل إدخاله في صينية 128 خلية.'],
  'CF-128B': ['Plug para esquejes de 128 celdas','Formato partido para esquejes; valide la colocación de raíces y el manejo en bandeja.','قالب عقل لصواني 128 خلية','صيغة مشقوقة للعقل؛ تُختبر وضعية الجذور والمناولة في الصينية.'],
  'CF-129': ['Plug cilíndrico 3.1 cm','Perfil redondo para siembra, esquejes y cavidades cilíndricas.','قالب أسطواني 3.1 cm','مقطع دائري للبذر والعقل والتجاويف الأسطوانية.'],
  'CF-167': ['Plug compacto para esquejes 3.0 cm','Formato compacto para propagación de alta densidad y ensayos con la bandeja del comprador.','قالب عقل مدمج 3.0 cm','صيغة مدمجة للإكثار عالي الكثافة وتجارب صينية المشتري.'],
  'CF-200': ['Plug para esquejes de 200 celdas','Para ensayos de propagación de alta densidad y manejo en bandejas de 200 celdas.','قالب عقل لصواني 200 خلية','لتجارب الإكثار عالي الكثافة والمناولة في صواني 200 خلية.'],
  'CF-901': ['Bola de montaje para helechos 20 cm','Formato grande para ensayos de montaje de helechos cuerno de alce y exhibiciones de epífitas.','كرة تثبيت للسرخس 20 cm','صيغة كبيرة لتجارب تثبيت سرخس قرن الأيل وعرض النباتات الهوائية.'],
  'CF-902': ['Bola de montaje para helechos 16 cm','Formato intermedio para montaje de helechos cuerno de alce y exhibiciones de epífitas.','كرة تثبيت للسرخس 16 cm','صيغة متوسطة لتثبيت سرخس قرن الأيل وعرض النباتات الهوائية.'],
  'CF-903': ['Bola de montaje para helechos 11 cm','Formato compacto para montaje de helechos cuerno de alce y pequeñas exhibiciones de epífitas.','كرة تثبيت للسرخس 11 cm','صيغة مدمجة لتثبيت سرخس قرن الأيل وعروض النباتات الهوائية الصغيرة.'],
  'CF-3038': ['Plug para esquejes 3.8 cm','Para propagación comercial por esquejes y ensayos de ajuste a bandejas.','قالب لإكثار العقل 3.8 cm','للإكثار التجاري بالعقل وتجارب ملاءمة الصواني.'],
  'CF-3038B': ['Plug hidropónico 3.8 cm B','Para siembra y propagación hidropónica; confirme el soporte antes de comprar.','قالب مائي 3.8 cm B','للبذر والإكثار المائي؛ يُراجع الحامل قبل الشراء.'],
  'CF-3545': ['Plug hidropónico 4.5 cm','Para ensayos de propagación hidropónica en producción de ambiente controlado.','قالب مائي 4.5 cm','لتجارب الإكثار المائي في الإنتاج ذي البيئة المتحكم بها.'],
  'CF-3550': ['Plug alto de vivero 5.3 cm','Para plántulas y esquejes que requieren mayor profundidad de sustrato.','قالب مشتل طويل 5.3 cm','للشتلات والعقل التي تحتاج عمقاً أكبر من الوسط.'],
  'CF-5050': ['Plug para esquejes de 50 celdas','Para esquejes de mayor tamaño y ensayos comerciales con bandejas de 50 celdas.','قالب عقل لصواني 50 خلية','للعقل الأكبر وتجارب المشاتل التجارية بصواني 50 خلية.'],
  'CF-7050': ['Plug alto de vivero 6.8 cm','Para bandejas profundas y evaluación de etapas de trasplante; abertura superior de 4.8 cm.','قالب مشتل طويل 6.8 cm','للصواني العميقة وتقييم مراحل الشتل؛ فتحة علوية 4.8 cm.']
};
const tray = {
  "Home hydroponic planter holes, 5 cm nursery cups or non-standard propagation holders": ['Orificios de hidroponía doméstica, vasos de vivero de 5 cm o soportes especiales','فتحات الزراعة المائية المنزلية أو أكواب مشتل 5 cm أو حوامل خاصة','家庭水培定植孔、5 cm 育苗杯或非标准育苗支架'],
  "12-cell home nursery boxes and small seed-starting trays": ['Cajas de 12 celdas y pequeñas bandejas de siembra','صناديق منزلية 12 خلية وصواني بذر صغيرة','12 穴家庭育苗盒及小型播种盘'],
  "Confirm against the buyer's tray drawing or physical sample": ['Confirmar con plano o muestra de la bandeja del comprador','يُؤكد برسم صينية المشتري أو عينة فعلية','按买方穴盘图纸或实物样品确认'],
  "60-cell orchid trays": ['Bandejas de 60 celdas para orquídeas','صواني أوركيد 60 خلية','60 穴兰花盘'],
  "50-cell orchid or tissue-culture transition tray": ['Bandeja de 50 celdas para orquídeas o transición de cultivo de tejidos','صينية 50 خلية للأوركيد أو انتقال زراعة الأنسجة','50 穴兰花或组培过渡盘'],
  "Orchid pots or 15–21-cell large planting trays": ['Macetas de orquídea o bandejas grandes de 15–21 celdas','أصص أوركيد أو صواني كبيرة 15–21 خلية','兰花盆或 15–21 穴大规格种植盘'],
  "Orchid pots or 12–15-cell planting trays": ['Macetas de orquídea o bandejas de 12–15 celdas','أصص أوركيد أو صواني 12–15 خلية','兰花盆或 12–15 穴种植盘'],
  "Orchid pots or 6–12-cell planting trays": ['Macetas de orquídea o bandejas de 6–12 celdas','أصص أوركيد أو صواني 6–12 خلية','兰花盆或 6–12 穴种植盘'],
  "60-cell orchid propagation tray": ['Bandeja de propagación de orquídeas de 60 celdas','صينية إكثار أوركيد 60 خلية','60 穴兰花育苗盘'],
  "6.7 cm pot holders, succulent cup display trays or decorative planters": ['Soportes de 6.7 cm, bandejas de exposición de suculentas o macetas decorativas','حوامل 6.7 cm أو صواني عرض العصاريات أو أوعية زخرفية','6.7 cm 盆架、多肉杯展示盘或装饰花器'],
  "72-cell propagation tray": ['Bandeja de propagación de 72 celdas','صينية إكثار 72 خلية','72 穴育苗盘'],
  "Nursery and propagation trays with approximately 3.1 cm openings": ['Bandejas de vivero con aberturas de aproximadamente 3.1 cm','صواني مشتل بفتحات نحو 3.1 cm','开口约 3.1 cm 的育苗盘'],
  "128-cell propagation tray": ['Bandeja de propagación de 128 celdas','صينية إكثار 128 خلية','128 穴育苗盘'],
  "128-cell cuttings propagation tray": ['Bandeja de esquejes de 128 celdas','صينية عقل 128 خلية','128 穴扦插盘'],
  "105-cell or 128-cell propagation trays": ['Bandejas de propagación de 105 o 128 celdas','صواني إكثار 105 أو 128 خلية','105 穴或 128 穴育苗盘'],
  "200-cell propagation tray": ['Bandeja de propagación de 200 celdas','صينية إكثار 200 خلية','200 穴育苗盘'],
  "Staghorn fern mounting boards, hanging displays or epiphyte mounting systems": ['Tablas de montaje de helechos, expositores colgantes o soportes de epífitas','ألواح تثبيت السرخس أو عروض معلقة أو حوامل نباتات هوائية','鹿角蕨上板、悬挂展示或附生植物安装系统'],
  "Confirm against the buyer's hydroponic tray or holder": ['Confirmar con la bandeja o soporte hidropónico del comprador','يُؤكد بصينية أو حامل الزراعة المائية لدى المشتري','按买方水培穴盘或支架确认'],
  "Deeper nursery and propagation trays with approximately 3.7 cm openings": ['Bandejas profundas con aberturas de aproximadamente 3.7 cm','صواني عميقة بفتحات نحو 3.7 cm','开口约 3.7 cm 的深型育苗盘'],
  "50-cell propagation tray": ['Bandeja de propagación de 50 celdas','صينية إكثار 50 خلية','50 穴育苗盘'],
  "Deep nursery trays, pots or holders with approximately 4.8 cm openings": ['Bandejas profundas, macetas o soportes con aberturas de aproximadamente 4.8 cm','صواني عميقة أو أصص أو حوامل بفتحات نحو 4.8 cm','开口约 4.8 cm 的深型盘、盆或支架']
};
const labels = {
 en: {category:'Category',size:'Size',tray:'Tray fit',best:'Application',carton:'Carton quantity',moq:'MOQ',quick:'Details',close:'Details',quote:'Request Sample',previous:'Previous page',next:'Next page',page:'Page',results:'models',empty:'No matching models. Clear the filters to see all models.',error:'Catalog could not load. Use the complete specification table below or contact sales.',comparison:'All model specifications',material:'Material',materialText:'Molded coconut coir and peat; confirm the project-specific binder formulation and applicable documents.',terms:'Confirm final pack count and MOQ for the approved model, packaging and freight route.',reference:'Reference only; final count depends on the carton and packaging.',docs:'Request documentation for this model',all:'All categories'},
 es: {category:'Categoría',size:'Tamaño',tray:'Bandeja / soporte',best:'Aplicación',carton:'Cantidad por caja',moq:'Pedido mínimo',quick:'Detalles',close:'Detalles',quote:'Solicitar muestra',previous:'Página anterior',next:'Página siguiente',page:'Página',results:'modelos',empty:'No hay modelos coincidentes. Borre los filtros para ver todos.',error:'No se pudo cargar el catálogo. Consulte la tabla completa o contacte con ventas.',comparison:'Especificaciones de todos los modelos',material:'Material',materialText:'Coco y turba moldeados; confirme la formulación del aglutinante y los documentos aplicables al proyecto.',terms:'Confirme el recuento final y pedido mínimo según modelo, embalaje y transporte aprobados.',reference:'Referencia; el recuento final depende de la caja y el embalaje.',docs:'Solicitar documentos de este modelo',all:'Todas las categorías'},
 ar: {category:'الفئة',size:'المقاس',tray:'الصينية / الحامل',best:'الاستخدام',carton:'كمية الكرتون',moq:'الحد الأدنى للطلب',quick:'التفاصيل',close:'التفاصيل',quote:'طلب عينة',previous:'الصفحة السابقة',next:'الصفحة التالية',page:'صفحة',results:'طرازات',empty:'لا توجد طرازات مطابقة. امسح المرشحات لعرض الجميع.',error:'تعذر تحميل الكتالوج. راجع جدول المواصفات الكامل أو تواصل مع المبيعات.',comparison:'مواصفات جميع الطرازات',material:'المادة',materialText:'ألياف جوز هند وخث مقولبان؛ تُؤكد تركيبة المادة الرابطة ووثائق المشروع المعنية.',terms:'تُؤكد الكمية النهائية والحد الأدنى حسب الطراز والتغليف ومسار الشحن المعتمد.',reference:'مرجع فقط؛ تعتمد الكمية النهائية على حجم الكرتون والتغليف.',docs:'طلب وثائق هذا الطراز',all:'جميع الفئات'},
 cn: {category:'类别',size:'尺寸',tray:'穴盘 / 支架',best:'应用',carton:'装箱数量',moq:'起订条件',quick:'详细信息',close:'详细信息',quote:'申请样品',previous:'上一页',next:'下一页',page:'页',results:'个型号',empty:'没有匹配的型号，请清除筛选条件。',error:'产品目录暂时无法加载，请查看下方完整规格表或联系销售。',comparison:'全部型号规格',material:'材料',materialText:'椰糠和泥炭成型基质；粘结剂配方及适用文件按具体项目确认。',terms:'最终装箱数量及起订条件按批准的型号、包装和运输方案确认。',reference:'仅供参考，最终数量受纸箱及包装形式影响。',docs:'索取此型号资料',all:'全部类别'}
};
const categories = {
 'Hydroponic Plug':['Plug hidropónico','قالب مائي','水培育苗块'],
 'Succulent Plug':['Plug para suculentas','قالب للعصاريات','多肉育苗块'],
 'Orchid Plug':['Plug para orquídeas','قالب أوركيد','兰花基质块'],
 'Orchid Planting Cup':['Copa para orquídeas','كوب أوركيد','兰花种植杯'],
 'Tissue Culture Plug':['Plug para cultivo de tejidos','قالب زراعة أنسجة','组培基质块'],
 'Seedling Plug':['Plug de vivero','قالب مشتل','育苗块'],
 'High-Density Plug':['Plug de alta densidad','قالب عالي الكثافة','高密度育苗块'],
 'Square Plug':['Plug cuadrado','قالب مربع','方形基质块'],
 'Staghorn Fern Mounting Ball':['Bola de montaje para helechos','كرة تثبيت سرخس','鹿角蕨上板球'],
 'Cylindrical Plug':['Plug cilíndrico','قالب أسطواني','圆柱形育苗块'],
 'Succulent Growing Cup':['Copa para suculentas','كوب عصاريات','多肉种植杯'],
 'Growing Cup':['Copa de cultivo','كوب زراعة','种植杯'],
 'Cuttings Propagation Plug':['Plug para esquejes','قالب إكثار عقل','扦插育苗块']
};
const dimensionWords = {
 es: {Top:'Superior',Bottom:'Base',Height:'Altura',Diameter:'Diámetro','Center hole':'Orificio central'},
 ar: {Top:'أعلى',Bottom:'قاعدة',Height:'ارتفاع',Diameter:'قطر','Center hole':'فتحة وسطية'},
 cn: {Top:'顶部',Bottom:'底部',Height:'高度',Diameter:'直径','Center hole':'中心孔'}
};
module.exports = { models, tray, labels, categories, dimensionWords };
