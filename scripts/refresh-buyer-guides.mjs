import fs from 'node:fs';
const origin = 'https://www.mccsgrowingmedia.com';
const topics = [
  [
    "how-to-choose-substrate-plugs",
    [
      "Choose Substrate Plugs by Application",
      "Start with the crop, propagation stage and handling system, then compare samples in the buyer’s own tray.",
      "Define the job before choosing a size",
      "Record whether the project starts from seed, a cutting or a tissue-culture plantlet. Note the next transplant stage, container and handling equipment. These details determine which models deserve a trial; a photograph alone cannot establish compatibility. A nursery moving plants by hand may need a different evaluation from a line using mechanical grippers.",
      "Build a practical shortlist",
      "Compare the approved CF model dimensions, opening profile and tray guidance. Cell count is not a universal fit standard: different tray suppliers may use different tapers and drainage features. Send an actual tray drawing or sample if the opening is uncertain. Keep a record of the model and material documentation supplied with each sample.",
      "Approve a trial, not a general promise",
      "Run shortlisted samples beside the current medium under the same crop, irrigation and handling conditions. Label groups and record wet fit, moisture condition at removal, plug integrity and visible roots at agreed checkpoints. Record unsuccessful units as well as successful ones. Root photographs are visual references, not evidence of a universal rooting time or survival percentage.",
      "Prepare a complete RFQ",
      "Send the model shortlist, tray details, application, destination, estimated purchase volume and packaging route. Ask which report applies to the proposed formulation and batch rather than assuming that a family-level document covers every variant. Approve product and packaging separately, then request a quotation based on the confirmed scope. Keep a retained sample for comparison with the first commercial delivery."
    ],
    [
      "Cómo elegir plugs de sustrato por aplicación",
      "Defina el cultivo, la etapa y el sistema de manejo antes de comparar muestras en su propia bandeja.",
      "Defina el uso",
      "Indique si parte de semillas, esquejes o plantas de cultivo de tejidos. Anote el siguiente trasplante, el recipiente y el equipo de manipulación. Una fotografía no demuestra la compatibilidad con su proceso.",
      "Prepare una selección",
      "Compare las dimensiones aprobadas del modelo CF, el perfil de la cavidad y la bandeja. El número de celdas no garantiza el ajuste entre fabricantes. Envíe un plano o una muestra cuando la abertura o la conicidad no estén claras.",
      "Evalúe las muestras",
      "Compare con el medio actual usando el mismo cultivo y condiciones de riego. Identifique cada grupo y registre ajuste húmedo, integridad del plug, humedad al retirarlo y raíces visibles. Incluya las unidades que no cumplieron el criterio. Las imágenes no garantizan un plazo de enraizamiento ni una tasa de supervivencia.",
      "Solicite una oferta concreta",
      "Envíe modelos, bandeja, aplicación, destino, volumen previsto y embalaje. Confirme qué documento corresponde a la formulación y al lote propuestos. Apruebe por separado el producto y el embalaje; conserve una muestra para comprobar la primera entrega."
    ],
    [
      "اختيار قوالب وسط الزراعة حسب الاستخدام",
      "حدد المحصول ومرحلة الإكثار ونظام المناولة قبل مقارنة العينات في صينية المشتري.",
      "حدد المهمة أولاً",
      "وضح هل تبدأ بالبذور أم العقل أم نباتات زراعة الأنسجة. سجل مرحلة الشتل التالية والوعاء ومعدات المناولة. لا تثبت الصورة وحدها توافق القالب مع نظامك.",
      "أعد قائمة قصيرة",
      "قارن أبعاد طراز CF المعتمدة وشكل التجويف وإرشادات الصينية. لا يضمن عدد الخلايا وحده التوافق بين موردي الصواني. أرسل رسماً أو عينة عند عدم وضوح الفتحة أو التدرج المخروطي.",
      "اختبر العينات",
      "قارن العينات مع الوسط الحالي باستخدام المحصول والري وظروف المناولة نفسها. عرّف المجموعات وسجل الملاءمة بعد الترطيب وتماسك القالب ورطوبته عند الإخراج والجذور المرئية. سجل الوحدات غير المقبولة أيضاً؛ الصور ليست ضماناً لمدة تجذير أو نسبة بقاء.",
      "أرسل طلب عرض واضحاً",
      "اذكر الطراز والصينية والاستخدام والوجهة والحجم المتوقع والتغليف. أكد الوثيقة المعنية بالتركيبة والدفعة المقترحتين. اعتمد المنتج والتغليف بصورة منفصلة واحتفظ بعينة لمراجعة أول تسليم."
    ]
  ],
  [
    "how-to-evaluate-tray-fit",
    [
      "Evaluate Grow Plug and Tray Fit",
      "Check physical fit before making a bulk decision; a nominal cell count is only the starting point.",
      "Measure the actual tray",
      "Record opening width or diameter, depth, taper, internal ribs and drainage opening. Include the tray maker and reference code. Measure several cells, including edge and center positions, rather than relying on a single opening. Send a dimensioned drawing and photographs with a scale if a physical tray cannot be shipped.",
      "Check dry and wet handling",
      "Identify the sample model and hydrate it using the intended procedure. Record the water condition and drainage interval instead of comparing a saturated plug with a partially dry control. Check insertion depth, contact with the cell wall and clearance at the base. A plug that drops into a dry cell may behave differently once hydrated.",
      "Rehearse removal and transplanting",
      "Use the intended manual or machine handling sequence at the agreed moisture condition. Look for unwanted movement, sticking, compression and loose particles. With mechanized handling, document jaw shape, contact position and operating settings. A general structural demonstration is not proof that a particular gripper or tray combination will work.",
      "Write an acceptance record",
      "Agree which observations constitute a pass before testing. List the sample model, tray identifier, date, preparation method and outcome of each unit. Keep the failed observations in the record. Confirm any changes in tray supplier, plug geometry or packing arrangement before repeating an order. Include the approved reference sample and packing requirements in the purchase specification, not only in an informal message."
    ],
    [
      "Cómo evaluar el ajuste del plug a la bandeja",
      "Compruebe el ajuste físico antes de comprar; el número nominal de celdas solo es un punto de partida.",
      "Mida la bandeja real",
      "Registre abertura, profundidad, conicidad, nervios y drenaje. Identifique fabricante y referencia. Mida varias celdas, tanto centrales como de borde. Si no puede enviar la bandeja, facilite un plano acotado y fotografías con escala.",
      "Revise en seco y húmedo",
      "Identifique el modelo e hidrate con el procedimiento previsto. Registre el agua y el intervalo de drenaje. Compruebe profundidad de inserción, contacto con paredes y espacio en la base; no compare muestras con estados de humedad distintos.",
      "Ensaye la extracción",
      "Repita la secuencia manual o mecánica prevista. Observe desplazamiento, adherencia, compresión y partículas sueltas. Para pinzas mecánicas, registre geometría, punto de contacto y ajustes. Una demostración general no acredita compatibilidad con una máquina concreta.",
      "Documente la aceptación",
      "Acuerde criterios antes de probar. Registre modelo, bandeja, fecha, preparación y resultado de cada unidad, incluidas las no conformes. Conserve una muestra aprobada y repita la evaluación si cambia la bandeja, geometría o embalaje."
    ],
    [
      "تقييم ملاءمة القالب وصينية الإكثار",
      "تحقق من الملاءمة الفعلية قبل الشراء؛ عدد الخلايا الاسمي مجرد نقطة بداية.",
      "قس الصينية الفعلية",
      "سجل الفتحة والعمق والتدرج والأضلاع الداخلية والتصريف. حدد المصنع ومرجع الصينية. قس خلايا من الوسط والحواف. أرسل رسماً بأبعاد وصوراً بمقياس إن تعذر شحن الصينية.",
      "راجع الجاف والمرطب",
      "حدد الطراز ورطب وفق الإجراء المقصود. سجل الماء ومدة التصريف. افحص عمق الإدخال والتلامس مع الجدار والخلوص السفلي. لا تقارن عينات تختلف حالتها المائية.",
      "جرب الإخراج والشتل",
      "كرر تسلسل المناولة اليدوية أو الآلية المتوقع. راقب الحركة والالتصاق والانضغاط والجزيئات المنفصلة. سجل شكل الماسك وموضع التلامس والإعدادات. العرض العام لا يثبت توافق آلة محددة.",
      "وثق القبول",
      "اتفق على المعايير قبل الاختبار. سجل الطراز والصينية والتاريخ والتحضير ونتيجة كل وحدة بما فيها غير المقبولة. احتفظ بالعينة المعتمدة وأعد التقييم عند تغيير الصينية أو الشكل أو التغليف."
    ]
  ],
  [
    "private-label-seed-starter-checklist",
    [
      "Private Label Seed Starter Procurement Checklist",
      "Approve the grow plug and the pack as two linked but separate parts of the project.",
      "Confirm the product scope",
      "Define the intended application, CF model, tray or holder and destination channel. Do not choose the model solely because it fits an attractive retail box. Ask for product samples and relevant formulation documents first. Record what is included in the kit and which components the buyer will source separately.",
      "Prepare the artwork brief",
      "Provide the approved brand artwork, language, pack format, barcode allocation and required label fields. Confirm the plug count without replacing the approved catalog data with an assumed standard. Keep unsupported environmental, certification and crop-performance statements out of the label. The buyer or importer should review destination-market requirements before artwork approval.",
      "Review physical packaging samples",
      "Check whether the plug is protected during transit and whether the contents can be removed without damage. Review the layout of instructions, batch identification and carton markings. Confirm the final packed dimensions and weight before comparing freight quotations. A render or packaging photograph is not a substitute for approving the actual pack construction.",
      "Separate approvals and release",
      "Keep a signed or otherwise traceable record of product approval, artwork approval and packing approval. Ask for the applicable sample, packaging and production lead times instead of assuming a generic daily capacity. Agree how changed artwork, model variants or pack counts trigger a new approval. Start the commercial quotation only after these inputs are clear, and retain approved samples for incoming inspection."
    ],
    [
      "Lista de compra para kits de siembra de marca privada",
      "Apruebe el plug y el envase como partes relacionadas, pero independientes, del proyecto.",
      "Defina el producto",
      "Indique aplicación, modelo CF, bandeja y canal de destino. No elija el modelo solo por el tamaño de una caja atractiva. Solicite muestras y documentación de la formulación; detalle qué componentes incluye el kit.",
      "Prepare el diseño",
      "Envíe marca, idiomas, formato, código de barras y campos de etiqueta. Confirme el contenido sin sustituir las cifras aprobadas del catálogo por supuestos. Evite afirmaciones ambientales, de certificación o rendimiento sin respaldo. El importador debe revisar los requisitos del mercado.",
      "Revise el embalaje físico",
      "Compruebe protección en transporte, extracción sin daños, instrucciones, identificación del lote y marcas de caja. Confirme dimensiones y peso del paquete antes de comparar fletes. Una imagen de diseño no sustituye una muestra física aprobada.",
      "Separe las aprobaciones",
      "Conserve un registro del producto, diseño y embalaje aceptados. Confirme los plazos específicos del proyecto. Un cambio de modelo, contenido o diseño puede requerir nueva aprobación. Mantenga muestras de referencia para inspeccionar la entrega."
    ],
    [
      "قائمة شراء أطقم البذر بعلامة خاصة",
      "اعتمد القالب والعبوة كجزأين مترابطين لكن منفصلين في المشروع.",
      "حدد المنتج",
      "اذكر الاستخدام وطراز CF والصينية وقناة الوجهة. لا تختَر الطراز لمجرد ملاءمته لصندوق جذاب. اطلب عينات ووثائق التركيبة وحدد مكونات الطقم ومن يوفرها.",
      "جهز التصميم",
      "قدم العلامة واللغات وصيغة العبوة والباركود وحقول الملصق. أكد عدد الوحدات دون استبدال بيانات الكتالوج المعتمدة بافتراضات. تجنب الادعاءات البيئية والشهادات والأداء غير المدعومة. يراجع المستورد متطلبات السوق قبل اعتماد التصميم.",
      "راجع عبوة فعلية",
      "افحص الحماية أثناء النقل وإخراج المحتوى دون تلف والتعليمات وتعريف الدفعة وعلامات الكرتون. أكد المقاس والوزن المعبأ قبل مقارنة الشحن. لا يغني التصميم المصور عن العينة الفعلية.",
      "افصل الموافقات",
      "احتفظ بسجل قبول المنتج والتصميم والتعبئة. أكد المهل الخاصة بالمشروع. قد يستلزم تغيير الطراز أو العدد أو التصميم اعتماداً جديداً. احتفظ بعينات مرجعية لفحص التسليم."
    ]
  ],
  [
    "rockwool-alternative-for-retail-kits",
    [
      "Evaluate a Rockwool Alternative for Retail Kits",
      "Compare the whole kit workflow rather than assuming one medium is a drop-in replacement.",
      "Start from the current kit",
      "Record the holder geometry, planting method, instructions and intended customer. Identify which steps currently require support or produce returns. Keep the reference medium and its normal preparation method as the comparison baseline. A different substrate may require different hydration guidance even when its nominal size looks similar.",
      "Compare the physical workflow",
      "Check dry packing, hydration, insertion into the holder and removal at the intended stage. Record plug integrity and loose particles using the same handling sequence. Do not label a molded coir and peat plug as universally cleaner, safer or more productive without a defined comparison and supporting results.",
      "Check documents and instructions",
      "Confirm the proposed formulation, binder documentation and any treatment required by the buyer. Review which report covers the sample and which claims it actually supports. Rewrite preparation instructions from an approved product trial; do not copy the reference medium’s instructions unchanged. Keep language understandable for the kit customer.",
      "Compare cost on an equal basis",
      "Ask for the approved plug count, packaging scope and packed shipping dimensions. Compare the landed cost of the complete kit rather than unit plug price alone. Include observed packing or handling losses where the buyer has measured them. Approve a small project-specific trial before a broader changeover, retain the evaluation record and confirm how future batch or packaging changes will be managed."
    ],
    [
      "Cómo evaluar una alternativa a la lana de roca en kits",
      "Compare el proceso completo del kit; no suponga una sustitución directa entre materiales.",
      "Documente el kit actual",
      "Registre soporte, método de plantación, instrucciones y usuario previsto. Mantenga el medio actual y su preparación habitual como referencia. Un sustrato distinto puede necesitar instrucciones de hidratación diferentes aunque parezca del mismo tamaño.",
      "Compare el manejo",
      "Revise embalaje seco, hidratación, inserción y extracción. Registre integridad y partículas sueltas con una secuencia igual. No afirme que un medio es universalmente más limpio, seguro o productivo sin un ensayo definido.",
      "Revise documentos",
      "Confirme formulación, documentación del aglutinante y tratamiento solicitado. Verifique qué muestra cubre el informe y qué afirma. Redacte las instrucciones a partir de la prueba aprobada; no copie automáticamente las del material anterior.",
      "Compare el coste completo",
      "Solicite cantidad aprobada, alcance del embalaje y dimensiones de envío. Compare el coste del kit puesto en destino, no solo el precio unitario del plug. Antes del cambio general, apruebe una prueba acotada y documente cómo revisar futuros cambios de lote o envase."
    ],
    [
      "تقييم بديل للصوف الصخري في أطقم الزراعة",
      "قارن مسار استخدام الطقم كاملاً ولا تفترض الاستبدال المباشر بين المواد.",
      "وثق الطقم الحالي",
      "سجل شكل الحامل وطريقة الزراعة والتعليمات والمستخدم المقصود. أبق الوسط الحالي وتحضيره المعتاد مرجعاً للمقارنة. قد يحتاج الوسط المختلف تعليمات ترطيب مختلفة حتى عند تشابه المقاس.",
      "قارن المناولة",
      "راجع التغليف الجاف والترطيب والإدخال والإخراج. سجل التماسك والجزيئات المنفصلة بالتسلسل نفسه. لا تدّع نظافة أو أماناً أو إنتاجية أفضل بصورة عامة دون مقارنة محددة ونتائج داعمة.",
      "راجع الوثائق",
      "أكد التركيبة ووثائق المادة الرابطة والمعالجة المطلوبة. تحقق من العينة التي يغطيها التقرير وحدود نتائجه. اكتب التعليمات من التجربة المعتمدة ولا تنسخ تعليمات الوسط السابق تلقائياً.",
      "قارن التكلفة الكاملة",
      "اطلب العدد المعتمد ونطاق التغليف وأبعاد الشحن. قارن تكلفة الطقم عند الوجهة وليس سعر القالب وحده. اعتمد تجربة محدودة قبل التغيير الشامل ووثق مراجعة تغييرات الدفعة أو العبوة."
    ]
  ],
  [
    "sample-to-bulk-shipping-guide",
    [
      "From Grow Plug Samples to Bulk Shipping",
      "Use the sample phase to confirm the product and shipment brief before commercial ordering.",
      "Send one complete sample brief",
      "Include the application, preferred CF models, actual tray or holder, destination country and intended packaging. Distinguish a free product sample from the courier charge: a sample offer does not automatically mean free international freight. Confirm the recipient, delivery address and any courier-account preference directly with sales.",
      "Approve product suitability",
      "Document the model and preparation procedure used in the buyer’s evaluation. Record fit, handling and the agreed observations before requesting production quantities. Separate sample observations from any laboratory report. Ask which document applies to the proposed commercial material and whether additional testing is needed for the project.",
      "Request a comparable freight quote",
      "Confirm the approved pack count, carton dimensions, shipment weight, destination and shipping scope. Ask what the quotation includes and excludes; do not compare a courier-to-door price with a port-only freight figure as though they were equivalent. Delivery time estimates are not guarantees and depend on the selected route and clearance.",
      "Release the bulk order",
      "Agree the product specification, packing approval, quantity, commercial terms and inspection plan before production release. Confirm available production allocation rather than assuming a website capacity figure is a delivery commitment. Keep a retained approved sample and shipping records so the first commercial batch can be checked on arrival. Reconfirm packaging and freight when the model mix or delivery destination changes."
    ],
    [
      "De las muestras al envío a granel",
      "Use la fase de muestras para confirmar el producto y la logística antes del pedido comercial.",
      "Envíe una solicitud completa",
      "Incluya aplicación, modelos CF, bandeja, país y embalaje. Distinga muestra gratuita de flete gratuito: una oferta de producto sin coste no implica transporte internacional incluido. Confirme destinatario, dirección y cuenta de mensajería con ventas.",
      "Apruebe la idoneidad",
      "Registre modelo, preparación, ajuste y manejo durante la evaluación. Separe las observaciones del ensayo de los informes de laboratorio. Consulte qué documento corresponde al material comercial propuesto y si su proyecto necesita pruebas adicionales.",
      "Compare fletes equivalentes",
      "Confirme contenido, dimensiones de caja, peso, destino y alcance. Pregunte qué incluye y excluye la oferta. Un servicio puerta a puerta no equivale a un flete solo hasta puerto. Los plazos son estimaciones sujetas a ruta y despacho.",
      "Libere el pedido comercial",
      "Acuerde especificación, embalaje, cantidad, condiciones e inspección antes de producción. Confirme disponibilidad real, no una cifra genérica de capacidad. Conserve muestra y registros para comprobar la primera entrega; recalcule el transporte si cambia el destino o la mezcla de modelos."
    ],
    [
      "من عينات قوالب الزراعة إلى الشحن التجاري",
      "استخدم مرحلة العينات لتأكيد المنتج ونطاق الشحنة قبل الطلب التجاري.",
      "أرسل طلب عينة كاملاً",
      "اذكر الاستخدام وطرازات CF والصينية والدولة والتغليف. فرّق بين مجانية المنتج ومجانية الشحن؛ عرض العينة لا يعني تضمين النقل الدولي. أكد المستلم والعنوان وتفضيل حساب شركة الشحن مع المبيعات.",
      "اعتمد ملاءمة المنتج",
      "سجل الطراز والتحضير والملاءمة والمناولة في تقييم المشتري. افصل ملاحظات التجربة عن تقارير المختبر. اسأل عن الوثيقة المتعلقة بالمادة التجارية المقترحة والحاجة لفحوص إضافية للمشروع.",
      "قارن نطاق شحن متماثلاً",
      "أكد المحتوى وأبعاد الكرتون والوزن والوجهة والنطاق. اسأل عما يشمله العرض وما يستثنيه. خدمة الباب إلى الباب ليست شحناً إلى الميناء فقط. المهل تقديرية وتتأثر بالمسار والتخليص.",
      "حرر الطلب التجاري",
      "اتفق على المواصفات والتعبئة والكمية والشروط والفحص قبل الإنتاج. أكد التخصيص الفعلي ولا تعتمد رقم طاقة عاماً. احتفظ بالعينة والسجلات لمراجعة أول تسليم وأعد حساب الشحن عند تغيير الوجهة أو مزيج الطرازات."
    ]
  ],
  [
    "mccs-vs-traditional-substrate",
    [
      "Compare Molded Plugs and Loose Substrate",
      "Compare the handling system and measured observations, not an assumed universal winner.",
      "Define the baseline",
      "Use the same crop and propagation stage. Record the current medium, tray, irrigation and transfer procedure.",
      "Observe practical differences",
      "Record filling or insertion work, material loss, wet handling and removal. A molded shape and a loose medium require different preparation; write down both methods.",
      "Keep evidence separate",
      "Images show visible roots and handling at one moment. They do not establish faster growth, universal water savings or a success percentage. Review formulation documents and agreed measurements separately.",
      "Make a project decision",
      "Compare the complete packing and handling cost with recorded buyer-side results. Confirm the approved model and acceptance criteria before repeat orders."
    ],
    [
      "Comparar plugs moldeados y sustrato suelto",
      "Compare el sistema de manejo y las observaciones medidas, sin dar por hecho un ganador universal.",
      "Defina la referencia",
      "Use el mismo cultivo y etapa de propagación. Registre medio actual, bandeja, riego y procedimiento de traslado para que la comparación sea interpretable.",
      "Observe el trabajo real",
      "Anote llenado o inserción, pérdida de material, manejo húmedo y extracción. Una forma moldeada y un medio suelto requieren preparaciones distintas; documente ambas.",
      "Separe las pruebas",
      "Las imágenes muestran raíces y manejo en un momento concreto. No establecen mayor crecimiento, ahorro universal de agua ni un porcentaje de éxito. Revise por separado documentos de formulación y mediciones acordadas.",
      "Decida por proyecto",
      "Compare costes completos de embalaje y manejo con resultados registrados por el comprador. Identifique modelo, lote y criterios de aceptación antes de repetir pedidos. Si cambia el riego o la bandeja, repita la parte correspondiente de la evaluación."
    ],
    [
      "مقارنة القوالب المقولبة والوسط السائب",
      "قارن نظام المناولة والملاحظات المقاسة دون افتراض فائز عام.",
      "حدد المرجع",
      "استخدم المحصول ومرحلة الإكثار نفسيهما. سجل الوسط الحالي والصينية والري وإجراء النقل حتى تكون المقارنة قابلة للتفسير.",
      "راقب العمل الفعلي",
      "سجل الملء أو الإدخال وفقد المادة والمناولة بعد الترطيب والإخراج. يحتاج القالب والوسط السائب إلى تحضير مختلف؛ وثق الطريقتين.",
      "افصل الأدلة",
      "تعرض الصور الجذور والمناولة في لحظة محددة. لا تثبت نمواً أسرع أو وفراً عاماً للماء أو نسبة نجاح. راجع وثائق التركيبة والقياسات المتفق عليها بصورة منفصلة.",
      "قرر حسب المشروع",
      "قارن تكاليف التغليف والمناولة الكاملة بنتائج المشتري المسجلة. حدد الطراز والدفعة ومعايير القبول قبل تكرار الطلب. عند تغيير الري أو الصينية أعد الجزء المعني من التقييم."
    ]
  ],
  [
    "middle-east-water-saving-substrate",
    [
      "Evaluate Growing Media for Middle East Projects",
      "Validate the proposed medium with the project’s water, irrigation and crop conditions.",
      "Describe the operating conditions",
      "Record the intended crop, propagation stage, greenhouse or indoor system and irrigation equipment. Regional labels do not define one set of growing conditions.",
      "Document water and material inputs",
      "Ask for relevant water-quality and current material results using stated methods and units. Confirm whether wash or buffer treatment is part of the proposed specification.",
      "Measure before claiming savings",
      "Compare water input and observed plant response against the existing process under the same conditions. Do not infer a water-saving percentage from a photograph or a different crop study.",
      "Plan supply around the trial",
      "Share destination, sample route and planned volume. Agree the model and evidence scope before choosing packaging and commercial shipment."
    ],
    [
      "Evaluar sustratos para proyectos en Oriente Medio",
      "Valide el medio con el agua, el riego y el cultivo reales del proyecto.",
      "Describa las condiciones",
      "Indique cultivo, etapa, sistema de invernadero o interior y equipo de riego. Una etiqueta regional no describe una única condición de cultivo; registre también los cambios previstos en el proceso.",
      "Documente los materiales",
      "Solicite resultados pertinentes del agua y material actual con método y unidades. Confirme si el lavado o tamponado forma parte de la especificación ofrecida. No deduzca el tratamiento de una descripción genérica.",
      "Mida antes de afirmar ahorro",
      "Compare aporte de agua y respuesta observada con el proceso actual bajo condiciones iguales. Una fotografía o un estudio en otro cultivo no demuestra un porcentaje de ahorro aplicable a su proyecto.",
      "Planifique el suministro",
      "Comparta destino, ruta de muestras y volumen previsto. Acuerde modelo y alcance documental antes de elegir embalaje y envío comercial. Conserve las observaciones para revisar el primer lote."
    ],
    [
      "تقييم أوساط الزراعة لمشاريع الشرق الأوسط",
      "اختبر الوسط بماء المشروع وريه ومحصوله الفعلي.",
      "صف الظروف",
      "حدد المحصول والمرحلة ونظام الدفيئة أو الزراعة الداخلية ومعدات الري. الوصف الإقليمي لا يعني ظروف زراعة موحدة؛ سجل تغييرات العملية المتوقعة أيضاً.",
      "وثق المدخلات",
      "اطلب نتائج الماء والمادة الحالية ذات الصلة مع الطريقة والوحدات. أكد إن كان الغسل أو المعالجة جزءاً من المواصفات المعروضة. لا تستنتج المعالجة من وصف عام.",
      "قس قبل ادعاء التوفير",
      "قارن الماء المضاف والاستجابة المرصودة مع العملية الحالية في ظروف متماثلة. لا تثبت الصورة أو دراسة محصول آخر نسبة توفير تنطبق على المشروع.",
      "خطط للتوريد",
      "شارك الوجهة ومسار العينات والحجم المتوقع. اتفق على الطراز ونطاق الوثائق قبل اختيار التغليف والشحنة التجارية. احتفظ بالملاحظات لمراجعة الدفعة الأولى."
    ]
  ],
  [
    "hydroponic-grow-plug-guide",
    [
      "Hydroponic Grow Plug Buyer Guide",
      "Review holder fit, hydration, material documentation and buyer-side handling before commercial sourcing.",
      "Match the holder",
      "Measure the real opening, support depth and intended planting position. Compare approved model dimensions and test samples rather than relying on a nominal label.",
      "Agree the preparation method",
      "Use the intended water and irrigation procedure. Record hydration, drainage and handling moisture for both the candidate and reference medium.",
      "Define evidence and acceptance",
      "Confirm formulation documentation and any project-specific pH or EC results with methods stated. Photographs and general demonstrations do not establish model-specific performance.",
      "Complete the sourcing brief",
      "Provide application, tray or holder, destination, volume and packaging. Approve the sample and freight scope before bulk quotation."
    ],
    [
      "Guía de compra de plugs hidropónicos",
      "Revise ajuste, hidratación, documentos y manejo antes de la compra comercial.",
      "Ajuste al soporte",
      "Mida la abertura real, profundidad de apoyo y posición de plantación. Compare dimensiones aprobadas y ensaye muestras. Un nombre de modelo o un número de celdas no demuestra compatibilidad con soportes de distintos fabricantes.",
      "Preparación comparable",
      "Use el agua y procedimiento de riego previstos. Registre hidratación, drenaje y humedad al manipular tanto el candidato como el medio de referencia. Mantenga identificados modelo y lote.",
      "Documentos y aceptación",
      "Confirme formulación y resultados de pH o EC específicos del proyecto, con sus métodos. Las fotos y demostraciones generales no prueban rendimiento por modelo. Acuerde los criterios antes de evaluar las muestras.",
      "Solicitud completa",
      "Envíe aplicación, bandeja o soporte, destino, volumen y embalaje. Apruebe muestra y alcance del flete antes de cotizar a granel. Conserve registros y una muestra para revisar la primera entrega."
    ],
    [
      "دليل شراء قوالب الزراعة المائية",
      "راجع ملاءمة الحامل والترطيب والوثائق والمناولة قبل التوريد التجاري.",
      "الملاءمة مع الحامل",
      "قس الفتحة الفعلية وعمق الدعم وموضع الزراعة. قارن الأبعاد المعتمدة وجرب العينات. لا يثبت اسم الطراز أو عدد الخلايا التوافق مع حوامل مصانع مختلفة.",
      "تحضير قابل للمقارنة",
      "استخدم الماء وإجراء الري المقصودين. سجل الترطيب والتصريف والرطوبة عند المناولة للمرشح والوسط المرجعي. حافظ على تعريف الطراز والدفعة لكل مجموعة.",
      "الوثائق والقبول",
      "أكد التركيبة ونتائج الحموضة أو التوصيل الكهربائي الخاصة بالمشروع مع طرقها. لا تثبت الصور والعروض العامة أداء طراز محدد. اتفق على معايير القبول قبل تقييم العينات.",
      "طلب توريد كامل",
      "اذكر الاستخدام والصينية أو الحامل والوجهة والحجم والتغليف. اعتمد العينة ونطاق الشحن قبل تسعير الكميات التجارية. احتفظ بالسجلات وعينة لمراجعة التسليم الأول."
    ]
  ]
];
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const locales = {
 en: {prefix:'/',resources:'Buyer guides',products:'Compare Models',contact:'Request Sample',evidence:'Review technical evidence',updated:'Updated 14 October 2026',home:'Home',related:'Sourcing resources'},
 es: {prefix:'/es/',resources:'Guías de compra',products:'Comparar modelos',contact:'Solicitar muestra',evidence:'Revisar evidencia técnica',updated:'Actualizado el 14 de octubre de 2026',home:'Inicio',related:'Recursos de compra'},
 ar: {prefix:'/ar/',resources:'أدلة الشراء',products:'مقارنة الطرازات',contact:'طلب عينة',evidence:'مراجعة الأدلة الفنية',updated:'تحديث 14 أكتوبر 2026',home:'الرئيسية',related:'موارد التوريد'}
};
for (const topic of topics) {
 for (const [index,lang] of ['en','es','ar'].entries()) {
  // Existing English specialist pages retain their expanded evidence sections.
  if (lang === 'en' && ['mccs-vs-traditional-substrate','middle-east-water-saving-substrate','hydroponic-grow-plug-guide'].includes(topic[0])) continue;
  const [title,lead,...sections] = topic[index+1];
  const t = locales[lang];
  const route = t.prefix + 'insights/' + topic[0] + '/';
  const file = '.' + route + 'index.html';
  let html = fs.readFileSync(file,'utf8');
  const body = sections.reduce((out,text,i) => out + (i % 2 === 0 ? '<h2>'+escape(text)+'</h2>' : '<p>'+escape(text)+'</p>'), '');
  const actions = '<div class="hero-actions"><a class="btn btn-primary" href="'+t.prefix+'products/">'+t.products+'</a><a class="btn btn-outline" href="'+t.prefix+'contact/#quoteForm">'+t.contact+'</a></div>';
  const main = '<main><section class="page-hero article-hero"><div class="container breadcrumbs"><a href="'+t.prefix+'">'+t.home+'</a><span>/</span><a href="'+t.prefix+'insights/">'+t.resources+'</a></div><div class="container"><span class="section-label">'+t.resources+'</span><h1>'+escape(title)+'</h1><p class="lead">'+escape(lead)+'</p><p class="article-meta"><time datetime="2026-10-14">'+t.updated+'</time> · MCCS Growing Media</p></div></section><section class="section"><div class="container article-layout"><article class="article-body">'+body+actions+'</article><aside class="article-side"><div class="instruction-card"><b>'+t.related+'</b><a href="'+t.prefix+'products/">'+t.products+'</a><a href="'+t.prefix+'technical-evidence/">'+t.evidence+'</a><a href="'+t.prefix+'contact/#quoteForm">'+t.contact+'</a></div></aside></div></section></main>';
  html = html.replace(/<main>[\s\S]*?<\/main>/,main)
   .replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(title)+' | MCCS</title>')
   .replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'')
   .replace(/<meta\b(?=[^>]*(?:name=["']description["']|property=["']og:description["']))[^>]*>/gi,tag => tag.replace(/content=["'][^"']*["']/,'content="'+escape(lead)+'"'))
   .replace(/<meta\b(?=[^>]*property=["']og:title["'])[^>]*>/gi,tag => tag.replace(/content=["'][^"']*["']/,'content="'+escape(title)+' | MCCS"'))
   .replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(match,json) => {
     const entity = JSON.parse(json);
     if (entity['@type'] !== 'Article') return match;
     entity.headline=title; entity.description=lead; entity.inLanguage=lang; entity.dateModified='2026-10-14'; entity.mainEntityOfPage=origin+route;
     return '<script type="application/ld+json">'+JSON.stringify(entity)+'</script>';
   });
  fs.writeFileSync(file,html);
 }
}
for (const [index,lang] of ['en','es','ar'].entries()) {
 const t=locales[lang];
 const file='.'+t.prefix+'insights/index.html';
 let html=fs.readFileSync(file,'utf8');
 html=html.replace(/<a class="post-card" href="([^"]+)">([\s\S]*?)<\/a>/g,(match,href,body)=>{
  const topic=topics.find(topic=>href===t.prefix+'insights/'+topic[0]+'/');
  if(!topic || lang==='en' && ['mccs-vs-traditional-substrate','middle-east-water-saving-substrate','hydroponic-grow-plug-guide'].includes(topic[0])) return match;
  const [title,lead]=topic[index+1];
  return '<a class="post-card" href="'+href+'">'+body.replace(/<b>[\s\S]*?<\/b>/,'<b>'+escape(title)+'</b>').replace(/<p>[\s\S]*?<\/p>/,'<p>'+escape(lead)+'</p>').replace(/<span>[\s\S]*?<\/span>/,'<span>'+t.resources+' →</span>')+'</a>';
 });
 fs.writeFileSync(file,html);
}
console.log('Refreshed five English procurement guides, sixteen complete ES/AR guides and their index cards.');
