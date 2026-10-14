import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const material = 'Molded coconut coir and peat substrate with project-specific binder formulation. Confirm the applicable material documentation before ordering.';
const productsPath = path.join(root, 'data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
for (const product of products) product.material = material;
fs.writeFileSync(productsPath, `${JSON.stringify(products, null, 2)}\n`);

const replacements = [
  ['塑形椰糠与泥炭复合基质，植物纤维粘结比例可按项目讨论。', '塑形椰糠与泥炭复合基质；粘结剂配方及材料文件按具体项目确认。'],
  ['<h1>Molded Coir &amp; Peat Grow Plugs for Hydroponic Greenhouses</h1>', '<h1>Molded Coir &amp; Peat Grow Plugs</h1>'],
  ['Formed shape, plant-fiber-based media, adjustable geometry and formulation by project.', 'Formed coir and peat substrate; geometry and binder formulation confirmed by project.'],
  ['Molded coconut coir and peat substrate with adjustable plant-fiber binder ratio.', material],
  ['MCCS products use molded coconut coir and peat substrate with adjustable plant-fiber binder ratios for different applications.', 'MCCS products use molded coconut coir and peat substrate with a project-specific binder formulation. Confirm the applicable formulation and material documentation with sales.'],
  ['coco coir, peat moss and plant-fiber binder ratios', 'coco coir, peat moss and project-specific binder formulation'],
  ['Los productos MCCS utilizan un sustrato moldeado de fibra de coco y turba; la proporción de aglutinante vegetal puede ajustarse según la aplicación.', 'Los productos MCCS utilizan coco y turba moldeados con un aglutinante definido para cada proyecto. Confirme la formulación y los documentos del material antes del pedido.'],
  ['تستخدم منتجات MCCS ركيزة مصبوبة من ألياف جوز الهند والبيتموس، ويمكن تعديل نسبة الرابط النباتي حسب التطبيق.', 'تستخدم منتجات MCCS ركيزة مصبوبة من ألياف جوز الهند والبيتموس مع تركيبة رابط خاصة بالمشروع. أكد التركيبة ووثائق المادة قبل الطلب.'],
  ['Up to 100,000 Units/Day', 'Project-Based Production'],
  ['Authorized manufacturing support with up to 100,000 individual molded substrate units per day under full-line operation; actual output depends on model, packaging and schedule.', 'Manufacturing allocation and lead time are confirmed after reviewing the model, order volume, packaging and production schedule.'],
  ['Up to 100,000 individual molded substrate units per day under full-line operation; actual output depends on model, packaging and schedule.', 'Manufacturing allocation and lead time are confirmed after reviewing the model, order volume, packaging and production schedule.'],
  ['Up to 100,000 individual molded substrate units per day under full-line operation. Actual output depends on model, packaging and production schedule.', 'Manufacturing allocation and lead time are confirmed after reviewing the model, order volume, packaging and production schedule.'],
  ['Up to 100,000 individual molded substrate units per day under full-line operation; actual output depends on model, packaging and production schedule', 'Production allocation and lead time are confirmed by model, order volume, packaging and production schedule'],
  ['Up to 100,000 individual molded substrate units per day under full-line operation. Actual output depends on model, formulation, packaging and production schedule.', 'Production allocation and lead time are confirmed by model, formulation, order volume, packaging and production schedule.'],
  ['全线运行时日产能最高约 100,000 个独立塑形基质块，实际产出按型号、包装和排期确认。', '按型号、订单数量、包装要求和工厂排期确认可用产能与交期。'],
  ['Hasta 100.000 unidades/día', 'Producción según el proyecto'],
  ['Hasta 100.000 unidades individuales al día bajo operación completa; la producción real depende del modelo, empaque y programa.', 'La disponibilidad de producción y el plazo se confirman según el modelo, el volumen, el embalaje y la programación.'],
  ['Hasta 100.000 unidades individuales de sustrato moldeado al día con la línea a plena operación; la producción real depende del modelo, empaque y programa.', 'La disponibilidad de producción y el plazo se confirman según el modelo, el volumen, el embalaje y la programación.'],
  ['Sustrato moldeado de coco y turba de alto rendimiento. Producido por nuestro socio fabricante autorizado en Guangzhou, con una capacidad de hasta 100.000 unidades individuales al día bajo operación completa. La producción real depende del modelo, empaque y programa.', 'Plugs de coco y turba moldeados, suministrados mediante un socio fabricante autorizado en Guangzhou. Compare modelos y confirme muestras, embalaje y plazo para su proyecto.'],
  ['حتى 100,000 وحدة يومياً', 'إنتاج حسب المشروع'],
  ['طاقة تصل إلى 100,000 وحدة مصبوبة منفردة يومياً عند تشغيل الخط بالكامل؛ يعتمد الإنتاج الفعلي على الموديل والتغليف والجدول.', 'تُؤكد مخصصات الإنتاج والمهلة حسب الموديل وحجم الطلب والتغليف وجدول التصنيع.'],
  ['سدادات زراعة عالية الأداء من ألياف جوز الهند والبيتموس. يتم الإنتاج عبر شريك تصنيع معتمد في قوانغتشو، بطاقة تصل إلى 100,000 وحدة مصبوبة منفردة يومياً عند تشغيل الخط بالكامل. يعتمد الإنتاج الفعلي على الموديل والتغليف والجدول.', 'سدادات مصبوبة من ألياف جوز الهند والبيتموس، تُورّد عبر شريك تصنيع معتمد في قوانغتشو. قارن الموديلات وأكد العينات والتغليف والمهلة لمشروعك.'],
  ['Daily Capacity', 'Production Planning'], ['Daily capacity', 'Production planning'],
  ['Capacidad diaria', 'Planificación de producción'], ['الطاقة اليومية', 'تخطيط الإنتاج'],
  ['Full-Line Reference Capacity', 'Production Planning'], ['<span class="evidence-mark">100K</span>', '<span class="evidence-mark">B2B</span>'],
  ['Reference capacity', 'Production planning'], ['Capacity reference', 'Production planning'],
  ['common substrate material system used across CF models', 'applicable substrate material system, subject to formulation confirmation'],
  ['<b>CANIN24009790302 · 21 May 2024</b>', '<b>SGS · 21 May 2024</b>'],
  ['<dd>CANIN24009790302</dd>', '<dd>SGS submitted-sample screening</dd>'],
  ['Report CANIN24009790302 records a pass', 'The manufacturing-partner SGS report records a pass'],
  ['MCCS is operated by Guangzhou Chengfeng Trading Co., Ltd. as an export-facing B2B brand, with production supplied through an authorized manufacturing partner in Guangzhou. Request samples for tray-fit, hydration and root-zone testing.', 'Molded coir and peat plugs supplied through an authorized manufacturing partner. Compare CF models and test samples in your own tray and growing system.']
];

const skip = new Set(['.git', '.lighthouseci', 'node_modules', 'outputs', 'output', 'tmp', 'reports', 'docs']);
for (const name of fs.readdirSync(root, { recursive: true })) {
  if (name.split(/[\\/]/).some(part => skip.has(part))) continue;
  if (!/\.(?:html|mjs|py)$/.test(name) || name.endsWith('sync-verified-buyer-copy.mjs') || /scripts[\\/]test/.test(name)) continue;
  if (['admin.html', 'privacy.html', 'terms.html'].includes(name)) continue;
  const target = path.join(root, name);
  const before = fs.readFileSync(target, 'utf8');
  let after = before;
  for (const [from, to] of replacements) after = after.replaceAll(from, to);
  // The source template splits this sentence across PDF lines.
  after = after.replaceAll('adjustable plant-fiber binder ratio', 'project-specific binder formulation');
  if (after !== before) fs.writeFileSync(target, after);
}
console.log('Synchronized conservative material and production disclosures; product identifiers and quantities are unchanged.');
