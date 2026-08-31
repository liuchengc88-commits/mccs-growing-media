import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const published = '2026-08-04';

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.mccsgrowingmedia.com/#organization',
  name: 'MCCS Growing Media',
  legalName: 'Guangzhou Chengfeng Trading Co., Ltd.',
  url: 'https://www.mccsgrowingmedia.com/',
  email: 'sales@mccsgrowingmedia.com',
  telephone: '+86 189 2229 0417'
};

const pages = [
  {
    kind: 'landing',
    path: 'applications/commercial-greenhouse-propagation-plugs',
    title: 'Commercial Greenhouse Propagation Plugs | B2B Sample Evaluation',
    description: 'Evaluate molded coir and peat propagation plugs for commercial greenhouse trays, hydration, handling, crop trials and recurring B2B supply.',
    label: 'Commercial greenhouse sourcing',
    h1: 'Commercial Greenhouse Propagation Plugs',
    lead: 'A buyer-focused route for matching molded coir and peat substrate plugs to commercial trays, irrigation routines, transplant handling and recurring supply requirements.',
    image: '/assets/plug-seedling-crop.jpg',
    imageAlt: 'Commercial greenhouse seedlings growing in molded coir and peat propagation plugs',
    takeaway: 'Approve a propagation plug only after the same sample lot has passed tray fit, hydration, wet-size stability, root handling and crop-response checks under the greenhouse\'s own operating conditions.',
    sections: [
      ['Start with the production workflow', 'Document the crop, tray opening, holder depth, irrigation method, transplant stage and current handling issue before comparing media. This prevents a visually similar plug from being approved for the wrong production step.', ['Measure the tray opening and usable depth.', 'Record whether loading and transplanting are manual or automated.', 'Identify the current medium and the operational reason for testing an alternative.']],
      ['Build a controlled sample comparison', 'Run the MCCS sample beside the current propagation medium using the same seed lot, nutrient program, light schedule and greenhouse zone. Keep each treatment clearly labelled and record observations at fixed intervals.', ['Use enough replicates to distinguish a repeatable result from an isolated plant.', 'Photograph dry fit, hydrated fit and the root zone at transplant.', 'Record handling time and rejected plugs as operational observations.']],
      ['Review physical and chemical evidence together', 'Physical fit alone is not sufficient. Ask for current-batch EC and pH information with the test method stated, then compare those records with hydration, drainage and crop observations from the trial.', ['Do not compare EC values produced by different extraction methods as if they were equivalent.', 'Confirm any project-specific AFP or WHC requirement before quoting.', 'Retain the sample lot reference with the trial record.']],
      ['Set a commercial decision gate', 'Purchasing, growing and operations teams should agree the pass criteria before the sample arrives. A result can then move to a larger line trial, a revised model selection or a documented stop decision.', ['Pass: fit, handling and crop response meet the agreed range.', 'Revise: the format is promising but tray or irrigation assumptions need adjustment.', 'Stop: the sample cannot be integrated without unacceptable process changes.']],
      ['Prepare for recurring supply', 'Before bulk discussion, confirm the selected model, sample reference, packaging condition, carton planning, destination, documentation needs and expected order cadence with sales. Final specifications belong in the approved quotation and project documents.']
    ],
    table: ['Evaluation area', 'Buyer protocol', 'Evidence to retain'],
    rows: [['Tray fit', 'Dry and hydrated fit in the production tray', 'Measurements and labelled photos'], ['Hydration', 'Fixed water volume, time and method', 'Time log and surface observations'], ['Handling', 'Normal loading and transplant workflow', 'Breakage and handling notes'], ['Crop trial', 'Side-by-side controlled comparison', 'Growth and root-zone observations'], ['Shipping', 'Inspect the delivered sample lot', 'Carton and product-condition record']],
    faqs: [['Are MCCS plugs a standard coco brick?', 'No. MCCS products are molded coir and peat substrate formats intended for propagation and growing workflows, not ordinary compressed coco bricks.'], ['Can one plug format suit every greenhouse crop?', 'No. Crop, tray, irrigation and transplant requirements should be matched through a controlled sample trial.'], ['What should a greenhouse buyer send with an inquiry?', 'Send the crop, tray dimensions, current medium, target destination, expected volume range and the operating issue the sample should address.']],
    links: [['Compare CF Series models', '/products/'], ['Review conical plug technical data', '/products/conical-plugs/'], ['Plan sample shipping', '/sample-shipping/'], ['Use the greenhouse evaluation checklist', '/insights/commercial-greenhouse-substrate-plug-evaluation-checklist/'], ['Read the EC and pH protocol', '/insights/substrate-plug-ec-ph-testing-protocol/'], ['Evaluate automation compatibility', '/applications/automated-transplanter-grow-plugs/'], ['Review hydroponic lettuce trials', '/applications/hydroponic-lettuce-grow-plugs/'], ['Contact MCCS sales', '/contact/']]
  },
  {
    kind: 'landing',
    path: 'applications/automated-transplanter-grow-plugs',
    title: 'Transplanting Plugs for Automated Transplanters | MCCS',
    description: 'Evaluate molded coir and peat transplanting plugs by tray fit, moisture condition, gripper handling and staged automated transplanter line trials.',
    label: 'Automation compatibility',
    h1: 'Transplanting Plugs for Automated Transplanter Trials',
    lead: 'A practical qualification workflow for growers and equipment teams comparing molded transplanting plugs across grippers, tray movement and automated transplant lines.',
    image: '/assets/micro-cellular.jpg',
    imageAlt: 'Molded substrate plug structure prepared for automated transplanter compatibility evaluation',
    takeaway: 'Automation compatibility is a measured line-trial result, not a universal product claim. Record plug dimensions, moisture condition, gripper settings and failure modes together.',
    sections: [
      ['Define the machine interface', 'Document tray geometry, pickup position, gripper type, jaw spacing, pressure settings, cycle speed and acceptable placement tolerance before choosing a sample format.', ['Use the equipment maker\'s operating limits as the starting point.', 'Record both dry and target-moisture plug dimensions.', 'Identify whether the line grips the plug, root zone, cup or tray.']],
      ['Control moisture before the gripper test', 'Mechanical behavior changes with hydration. Condition every comparison sample to the same agreed moisture method and record the elapsed time between hydration and pickup.', ['Weigh or otherwise document the conditioning method.', 'Keep water temperature and application method consistent.', 'Do not combine results from different moisture states.']],
      ['Run a staged line trial', 'Begin with manual pickup, then a slow machine cycle and finally the intended operating speed. Inspect pickup success, crumbling, deformation, placement and downstream root-zone condition at each stage.', ['Stop after repeated faults rather than forcing a full-speed trial.', 'Record machine settings beside each observation.', 'Retain failed samples for root-cause review.']],
      ['Separate media failure from setup failure', 'A missed pickup can result from plug geometry, tray alignment, gripper pressure, moisture condition or root development. The trial record should distinguish these causes before the product or machine is changed.'],
      ['Approve with a repeatable acceptance plan', 'Repeat the chosen settings across more than one tray and, where practical, more than one operating day. Confirm the accepted configuration in the buyer\'s own work instruction before bulk sourcing.']
    ],
    table: ['Trial stage', 'Controlled inputs', 'Record'],
    rows: [['Manual pickup', 'Plug, tray and target moisture', 'Grip point and visible damage'], ['Slow cycle', 'Machine settings and alignment', 'Pickup and placement failures'], ['Production speed', 'Normal line conditions', 'Cycle count and fault categories'], ['Post-placement', 'Same irrigation and handling', 'Shape and root-zone condition'], ['Repeat trial', 'Approved settings on new trays', 'Consistency across runs']],
    faqs: [['Does MCCS guarantee compatibility with every transplanter?', 'No. Compatibility must be verified with the buyer\'s tray, machine, gripper settings, moisture condition and operating speed.'], ['Why record moisture during gripper testing?', 'Hydration changes the mechanical behavior of substrate plugs, so results are not comparable unless moisture conditioning is controlled.'], ['Can MCCS review tray and machine information before sampling?', 'Yes. Buyers can share tray dimensions, equipment details and the intended handling sequence for sample-format discussion.']],
    links: [['Browse the CF Series catalog', '/products/'], ['Review technical data status', '/products/conical-plugs/'], ['Request a line-trial sample', '/sample-shipping/'], ['Use the tray-fit and automation protocol', '/insights/grow-plug-tray-fit-automation-protocol/'], ['Compare greenhouse propagation workflows', '/applications/commercial-greenhouse-propagation-plugs/'], ['Review private-label formats', '/applications/private-label-grow-plug-manufacturer/'], ['Download the technical data sheet', '/output/pdf/mccs-molded-coir-substrate-technical-data-sheet.pdf'], ['Contact sales', '/contact/']]
  },
  {
    kind: 'landing',
    path: 'applications/hydroponic-lettuce-grow-plugs',
    title: 'Hydroponic Lettuce Grow Plugs | Controlled Trial Guide',
    description: 'Evaluate molded coir and peat grow plugs for hydroponic lettuce and PFAL propagation with a controlled crop, irrigation and transplant trial.',
    label: 'Leafy-green propagation',
    h1: 'Hydroponic Lettuce Grow Plugs',
    lead: 'A controlled evaluation route for hydroponic lettuce and PFAL buyers comparing plug fit, irrigation response, root handling and transplant workflow.',
    image: '/assets/technology-root-growth.webp',
    imageAlt: 'Root development from molded substrate plugs used for hydroponic leafy-green propagation',
    takeaway: 'Use published research as context, then validate the selected plug under the buyer\'s own cultivar, nutrient solution, tray, light and transplant conditions before commercial approval.',
    sections: [
      ['Define the production baseline', 'Record cultivar, germination method, tray, nutrient program, lighting, irrigation frequency, transplant timing and the current medium. These variables form the baseline for a fair comparison.'],
      ['Use the 2025 PFAL study as research context', 'The referenced Agronomy study evaluated a molded coconut coir substrate under stated lettuce and pak choi PFAL conditions. Its findings can inform trial design, but they do not replace validation in a different facility, cultivar or operating program.', ['Read the test conditions before using any result.', 'Avoid turning a study outcome into a universal performance guarantee.', 'Link crop observations to the exact treatment and measurement method.']],
      ['Measure propagation and transplant observations', 'Track germination uniformity, hydration behavior, surface condition, root-zone handling and transplant observations at fixed dates. Use the same measurement schedule for the control and candidate plug.'],
      ['Connect irrigation records to crop observations', 'Record water application and nutrient-solution data alongside plant observations. When a difference appears, the team can then examine whether it follows media behavior, irrigation settings or another controlled variable.'],
      ['Move from trial to procurement', 'A commercial decision should combine crop response, operational handling, sample consistency, packaging condition and documentation. Confirm the final model and approved sample reference with sales before recurring orders.']
    ],
    table: ['Trial record', 'Minimum context', 'Decision use'],
    rows: [['Crop setup', 'Cultivar, tray, light and dates', 'Confirms comparable groups'], ['Irrigation', 'Water method, timing and nutrient record', 'Explains media response'], ['Propagation', 'Uniformity and visible condition', 'Screens early suitability'], ['Transplant', 'Root handling and placement notes', 'Tests workflow fit'], ['Procurement', 'Sample lot and packaging record', 'Links results to sourcing']],
    faqs: [['Does the PFAL study prove the same result in every hydroponic farm?', 'No. The study reports results under its stated test conditions. Commercial buyers should run a controlled local trial before adoption.'], ['What should be controlled in a lettuce plug comparison?', 'Use the same cultivar, tray, nutrient program, lighting, irrigation schedule and observation dates for the control and candidate plug.'], ['Where can buyers review the research source?', 'The research context page links directly to the 2025 Agronomy article and DOI.']],
    links: [['Read the PFAL research context', '/insights/middle-east-water-saving-substrate/'], ['Open the Agronomy study', 'https://doi.org/10.3390/agronomy15081929'], ['Compare CF Series formats', '/products/'], ['Review conical plug technical data', '/products/conical-plugs/'], ['Plan a sample trial', '/sample-shipping/'], ['Use the EC and pH protocol', '/insights/substrate-plug-ec-ph-testing-protocol/'], ['Review greenhouse evaluation steps', '/applications/commercial-greenhouse-propagation-plugs/'], ['Contact MCCS sales', '/contact/']]
  },
  {
    kind: 'landing',
    path: 'applications/private-label-grow-plug-manufacturer',
    title: 'Private Label Grow Plugs | Factory-Direct B2B Supply Program',
    description: 'Plan a factory-direct molded coir and peat grow plug program covering format selection, samples, packaging, documentation and export coordination.',
    label: 'OEM and private-label sourcing',
    h1: 'Private Label Grow Plug Supply Program',
    lead: 'A structured path for distributors and growing-kit brands moving from plug selection to sample approval, packaging development and export-ready project review.',
    image: '/assets/private-label-cases.webp',
    imageAlt: 'Private-label molded grow plug packaging formats for B2B sourcing programs',
    takeaway: 'Select and approve the substrate format before finalizing packaging artwork. Product performance, pack count, instructions and shipping protection must be evaluated as one commercial system.',
    sections: [
      ['Define the channel and user', 'Share the target market, sales channel, crop use, consumer experience, pack format and expected order range. A greenhouse refill pack and a retail seed-starting kit require different instructions and packaging decisions.'],
      ['Approve the product before the artwork', 'Choose candidate formats from the CF Series catalog and test hydration, fit, handling and intended use. Keep final claims off the package until the sample and documentation scope are approved.'],
      ['Develop the packaging system', 'Review inner protection, refill pouch or retail box format, count presentation, instruction card, carton markings and shipping route together. Packaging should protect the plug and communicate realistic use instructions.'],
      ['Review claims and documents', 'Product, origin, material, performance and certification language must match available evidence. SGS report support and project documents can be discussed with eligible buyers; unsupported badges or guarantees should not be printed.'],
      ['Use a staged commercial approval', 'Move through product sample, packaging prototype, combined pack test and final quotation. This sequence reduces the risk of approved artwork being attached to an unapproved product configuration.']
    ],
    table: ['Approval gate', 'Buyer supplies', 'Output'],
    rows: [['Program brief', 'Market, channel and intended use', 'Candidate format shortlist'], ['Product sample', 'Tray or user workflow', 'Approved sample reference'], ['Pack prototype', 'Brand assets and pack requirements', 'Reviewable packaging mockup'], ['Combined test', 'Shipping route and handling needs', 'Product-plus-pack condition record'], ['Commercial review', 'Volume and destination', 'Approved quotation and scope']],
    faqs: [['Can packaging be designed before the plug is selected?', 'Initial concepts can be discussed, but final dimensions, counts and instructions should follow product sample approval.'], ['Does MCCS support retail boxes and refill pouches?', 'Private-label packaging formats can be discussed after model selection and project qualification.'], ['Can buyers print certification claims immediately?', 'No. Every certification or performance claim should be supported by the documents approved for that specific project.']],
    links: [['Review private-label capabilities', '/private-label/'], ['Browse CF Series products', '/products/'], ['Plan sample and shipping', '/sample-shipping/'], ['Use the private-label checklist', '/insights/private-label-seed-starter-checklist/'], ['Review packaging examples', '/private-label/#packaging'], ['Compare greenhouse applications', '/applications/commercial-greenhouse-propagation-plugs/'], ['Read the technical data sheet', '/output/pdf/mccs-molded-coir-substrate-technical-data-sheet.pdf'], ['Start a private-label inquiry', '/contact/']]
  },
  {
    kind: 'article',
    path: 'insights/substrate-plug-ec-ph-testing-protocol',
    title: 'Substrate Plug EC and pH Testing Protocol for B2B Buyers',
    description: 'A practical EC and pH comparison protocol for substrate plug samples covering sampling, extraction method, calibration, records and acceptance criteria.',
    label: 'Technical testing protocol',
    h1: 'Substrate Plug EC and pH Testing Protocol',
    lead: 'A reproducible buyer workflow for comparing growing-media samples without mixing extraction methods, sample conditions or undocumented acceptance limits.',
    image: '/assets/mccs-technology.jpg',
    imageAlt: 'Molded growing media prepared for substrate plug EC and pH testing',
    takeaway: 'An EC or pH number has little procurement value unless the sample identity, extraction method, water, calibration, temperature and acceptance range are recorded with it.',
    sections: [
      ['1. Write the method before testing', 'Choose the laboratory or buyer method before samples are opened. Record the extraction ratio, water specification, mixing time, settling time, filtration approach and measurement temperature. Do not merge results from different methods into one acceptance table.'],
      ['2. Build a representative sample', 'Select plugs from multiple positions in the received package and identify the shipment, model and sample date. If replicates are combined, document how; if tested separately, retain every result rather than only the preferred value.'],
      ['3. Calibrate and document instruments', 'Follow the meter manufacturer\'s calibration instructions and record buffer or standard information. Rinse probes as required and note temperature compensation settings. A result without a calibration record is difficult to audit later.'],
      ['4. Record results with context', 'Report each replicate, the average if appropriate, the test method and any unusual observation such as incomplete wetting or visible contamination. Compare supplier and buyer data only when the methods are sufficiently aligned.'],
      ['5. Set project acceptance criteria', 'Acceptance limits should come from the crop program, buyer specification and agreed test method. MCCS current-batch information can be requested after the formulation and test scope are confirmed; the approved quotation or batch specification should carry the final requirement.']
    ],
    table: ['Record field', 'Why it matters', 'Example entry type'],
    rows: [['Sample identity', 'Links the number to the material tested', 'Model, lot and received date'], ['Extraction method', 'Makes results comparable', 'Ratio, water and timing'], ['Calibration', 'Supports instrument confidence', 'Standard and calibration time'], ['Replicates', 'Shows variation', 'Individual results and summary'], ['Acceptance range', 'Creates a procurement decision', 'Buyer-approved limit and method']],
    faqs: [['Can EC values from different extraction methods be compared directly?', 'Not reliably. The extraction ratio and method can change the measured result, so the method must accompany every value.'], ['Should a supplier provide only an average result?', 'Buyers should request enough replicate and method information to understand how the reported value was produced.'], ['Does this page set one universal EC or pH limit?', 'No. Acceptance limits should be agreed for the crop, formulation and stated test method.']],
    links: [['Review conical plug technical data', '/products/conical-plugs/'], ['Download the MCCS technical data sheet', '/output/pdf/mccs-molded-coir-substrate-technical-data-sheet.pdf'], ['Compare CF Series models', '/products/'], ['Plan greenhouse sample evaluation', '/applications/commercial-greenhouse-propagation-plugs/'], ['Read the tray-fit automation protocol', '/insights/grow-plug-tray-fit-automation-protocol/'], ['Review the Saudi trial protocol', '/insights/saudi-greenhouse-substrate-trial-protocol/'], ['Plan sample shipping', '/sample-shipping/'], ['Request current-batch information', '/contact/']]
  },
  {
    kind: 'article',
    path: 'insights/grow-plug-tray-fit-automation-protocol',
    title: 'Grow Plug Tray Fit and Automation Trial Protocol',
    description: 'Test grow plug dry and hydrated dimensions, tray drainage, pickup handling and automated transplanter compatibility with a staged protocol.',
    label: 'Operations testing protocol',
    h1: 'Grow Plug Tray Fit and Automation Trial Protocol',
    lead: 'A staged method for turning tray measurements, hydration conditions and machine observations into an auditable B2B sample decision.',
    image: '/assets/dimension-before-after.jpg',
    imageAlt: 'Dry and hydrated molded substrate plug dimensions for tray-fit evaluation',
    takeaway: 'Record geometry, hydration and machine settings in one trial file. A plug that fits when dry can behave differently after irrigation, and a machine result without moisture context cannot be repeated.',
    sections: [
      ['1. Measure the receiving interface', 'Record tray opening, depth, taper, drainage opening and any support ledge. Photograph the measurement points so supplier and buyer use the same geometry.'],
      ['2. Compare dry and hydrated fit', 'Measure the plug before hydration and after the agreed conditioning method. Observe seating depth, movement, drainage clearance, removal force and any deformation without forcing the sample into the tray.'],
      ['3. Define the handling condition', 'For manual or automated pickup, state the moisture condition, elapsed time, grip point and handling sequence. These inputs should remain fixed while plug or machine variables are compared.'],
      ['4. Progress through machine stages', 'Use manual pickup, slow cycle, intended production speed and a repeated run. Categorize failures such as missed pickup, deformation, crumbling, misplacement or tray obstruction instead of recording only a total failure count.'],
      ['5. Approve a configuration, not a vague product', 'The approval record should name the plug model, sample reference, tray, machine, gripper setting, moisture method and accepted operating window. Recheck after any material, tray or machine-setting change.']
    ],
    table: ['Measurement', 'Condition', 'Record'],
    rows: [['Tray geometry', 'Empty production tray', 'Opening, depth, taper and drainage'], ['Dry plug', 'As received', 'Dimensions and seating'], ['Hydrated plug', 'Agreed water method and time', 'Fit, clearance and deformation'], ['Pickup', 'Recorded moisture and gripper setting', 'Failure category and cycle'], ['Repeatability', 'Approved configuration', 'Results across trays or runs']],
    faqs: [['Why measure both dry and hydrated fit?', 'Hydration can change dimensions and mechanical behavior, so both states matter to tray and handling compatibility.'], ['What is the correct gripper pressure?', 'There is no universal value. Use the equipment maker\'s limits and determine an operating window through the buyer\'s staged trial.'], ['Should a single successful pickup approve the plug?', 'No. Approval should be based on repeatable results across a meaningful staged trial.']],
    links: [['Open the automation application page', '/applications/automated-transplanter-grow-plugs/'], ['Compare greenhouse plug workflows', '/applications/commercial-greenhouse-propagation-plugs/'], ['Review conical plug technical data', '/products/conical-plugs/'], ['Browse the CF Series catalog', '/products/'], ['Read the EC and pH protocol', '/insights/substrate-plug-ec-ph-testing-protocol/'], ['Plan sample shipping', '/sample-shipping/'], ['Download the technical data sheet', '/output/pdf/mccs-molded-coir-substrate-technical-data-sheet.pdf'], ['Discuss a line-trial sample', '/contact/']]
  },
  {
    kind: 'article',
    path: 'insights/saudi-greenhouse-substrate-trial-protocol',
    title: 'Saudi Greenhouse Substrate Trial Protocol | Local Sample Plan',
    description: 'A Saudi greenhouse trial protocol for comparing substrate plugs under local water, climate, irrigation, tray and crop conditions with local samples by arrangement.',
    label: 'Saudi local trial protocol',
    h1: 'Saudi Greenhouse Substrate Trial Protocol',
    lead: 'A controlled method for Saudi growers and project teams evaluating molded coir and peat substrate plugs under local water, climate-control and irrigation conditions.',
    image: '/assets/sample-shipping-hero.webp',
    imageAlt: 'MCCS substrate plug samples prepared for Saudi greenhouse evaluation',
    takeaway: 'Saudi-local MCCS samples can be arranged for qualified projects. Use them in a controlled local comparison and record water source, greenhouse conditions, irrigation and crop observations before importing at scale.',
    sections: [
      ['1. Record the local operating context', 'Document city or project location, greenhouse type, crop, tray, cooling method, water source, nutrient program and trial dates. Conditions can differ substantially between projects, so a generic regional claim is not enough.'],
      ['2. Characterize water and irrigation inputs', 'Record source-water EC and pH using the project\'s normal method, irrigation volume and frequency, drainage observations and any water treatment. Keep these inputs linked to each treatment.'],
      ['3. Use Saudi-local samples for screening', 'For qualified Saudi projects, local sample access can shorten initial evaluation. Confirm sample availability, model and collection or delivery arrangement with sales before planning the trial. Local availability does not replace model confirmation or a documented protocol.'],
      ['4. Compare under the same greenhouse zone', 'Place control and candidate treatments in comparable positions and use the same crop and observation schedule. Record hydration, surface condition, plant uniformity, root-zone handling and transplant observations.'],
      ['5. Add import and supply review after technical fit', 'Once the local trial passes, review required volume, packaging, shipping route, documentation and replenishment timing. Separate the agronomic decision from the commercial logistics decision, then approve both before scale-up.']
    ],
    table: ['Trial factor', 'Record in Saudi project', 'Reason'],
    rows: [['Location and dates', 'City, greenhouse and trial period', 'Frames climate context'], ['Water', 'Source, EC, pH and treatment', 'Explains irrigation input'], ['Irrigation', 'Volume, frequency and drainage', 'Connects water to media response'], ['Crop response', 'Fixed observation schedule', 'Supports comparable decisions'], ['Supply plan', 'Volume, route and packaging', 'Tests commercial readiness']],
    faqs: [['Are MCCS samples available inside Saudi Arabia?', 'Saudi-local samples can be arranged for qualified projects, subject to model availability and confirmation with MCCS sales.'], ['Can results from one Saudi greenhouse be applied to every project?', 'No. Water, cooling, crop, greenhouse design and irrigation programs vary, so each project should validate locally.'], ['What information should a Saudi buyer send first?', 'Send the crop, tray dimensions, project location, water source, irrigation method, expected volume range and the trial objective.']],
    links: [['Open the Middle East buyer page', '/middle-east/'], ['Read the Saudi sourcing report', '/insights/saudi-greenhouse-substrate-sourcing-2026/'], ['Review water-saving substrate context', '/insights/middle-east-water-saving-substrate/'], ['Compare hydroponic lettuce trials', '/applications/hydroponic-lettuce-grow-plugs/'], ['Browse CF Series products', '/products/'], ['Plan sample and shipping', '/sample-shipping/'], ['Read the EC and pH protocol', '/insights/substrate-plug-ec-ph-testing-protocol/'], ['Request a Saudi-local sample', '/contact/?market=saudi']]
  }
];

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c');

function header() {
  return `<header class="site-header"><div class="container nav"><a class="brand" href="/"><span class="brand-mark"><svg class="brand-seedling" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M31.8 45.6c-1.9 0-3.4-1.5-3.4-3.4V31.7c-6.9-.8-13.1-5.9-15.2-12.9-.4-1.3.5-2.6 1.9-2.7 8.3-.7 15.1 3.9 17.1 10.8 2.2-6.7 8.9-11.1 17-10.5 1.4.1 2.3 1.5 1.9 2.8-2.3 6.9-8.4 11.9-15.2 12.6v10.4c0 1.9-1.5 3.4-3.4 3.4h-.7z"/></svg></span><span><strong>MCCS Plug</strong><small>Factory-Direct Growing Media</small></span></a><button class="mobile-menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span><span></span></button><nav class="menu"><a href="/">Home</a><a href="/products/">Products</a><a href="/sample-shipping/">Sample &amp; Shipping</a><a href="/private-label/">Private Label</a><a href="/insights/">Insights</a><a href="/middle-east/">Middle East</a><a href="/about/">About</a><a href="/contact/">Contact</a></nav><div class="language-switcher" aria-label="Language switcher"><a href="/" lang="en">EN</a><a href="/es/" lang="es">ES</a><a href="/ar/" lang="ar">AR</a></div><a class="btn btn-primary" href="/contact/">Request Sample</a></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container footer-grid"><div><strong>MCCS Growing Media</strong><p>Factory-authorized molded coconut coir and peat substrate plugs for commercial propagation, hydroponic and private-label projects.</p><img class="footer-badge" src="/assets/sgs-badge.svg" alt="SGS report support for eligible MCCS B2B projects"></div><div><b>Products</b><a href="/products/">CF Series Catalog</a><a href="/products/conical-plugs/">Technical Data</a><a href="/sample-shipping/">Sample &amp; Shipping</a><a href="/private-label/">Private Label</a></div><div><b>Resources</b><a href="/insights/">Insights</a><a href="/middle-east/">Middle East</a><a href="/about/">About</a><a href="/contact/">Contact Sales</a></div><div><b>Contact</b><span>sales@mccsgrowingmedia.com</span><span>+86 189 2229 0417</span><span>Guangzhou, Guangdong, China</span></div></div></footer><a class="whatsapp-float" href="https://wa.me/8618922290417" target="_blank" rel="noopener">WhatsApp Sales</a><script src="/assets/mobile-ux.js"></script>`;
}

function render(page) {
  const url = `https://www.mccsgrowingmedia.com/${page.path}/`;
  const entity = page.kind === 'article' ? {
    '@context': 'https://schema.org', '@type': 'Article', headline: page.h1,
    description: page.description, image: `https://www.mccsgrowingmedia.com${page.image}`,
    datePublished: published, dateModified: published, author: organization,
    publisher: organization, mainEntityOfPage: url
  } : {
    '@context': 'https://schema.org', '@type': 'WebPage', name: page.h1,
    description: page.description, url, inLanguage: 'en', about: 'Molded coir and peat substrate plugs for B2B growing projects',
    provider: organization
  };
  const faq = {'@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faqs.map(([name, text]) => ({'@type': 'Question', name, acceptedAnswer: {'@type': 'Answer', text}}))};
  const sectionHtml = page.sections.map(([heading, paragraph, bullets]) => `<h2>${esc(heading)}</h2><p>${esc(paragraph)}</p>${bullets ? `<ul>${bullets.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}`).join('');
  const tableHtml = `<div class="compare-table-wrap"><table class="spec-table protocol-table"><thead><tr>${page.table.map(item => `<th scope="col">${esc(item)}</th>`).join('')}</tr></thead><tbody>${page.rows.map(row => `<tr>${row.map(item => `<td>${esc(item)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const related = page.links.map(([label, href]) => `<a href="${esc(href)}">${esc(label)}</a>`).join('');
  const faqHtml = page.faqs.map(([question, answer]) => `<details><summary><h3>${esc(question)}</h3></summary><p>${esc(answer)}</p></details>`).join('');
  const crumb = page.kind === 'article' ? `<a href="/insights/">Insights</a>` : `<span>Applications</span>`;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="en" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}">
<meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:type" content="${page.kind === 'article' ? 'article' : 'website'}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://www.mccsgrowingmedia.com${page.image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="https://www.mccsgrowingmedia.com${page.image}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css?v=20260804a"><script async src="https://www.googletagmanager.com/gtag/js?id=G-JGR2SQBQHW"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-JGR2SQBQHW');</script><script type="application/ld+json">${json(organization)}</script><script type="application/ld+json">${json(entity)}</script><script type="application/ld+json">${json(faq)}</script></head>
<body class="page-insights authority-page">${header()}<main><section class="page-hero article-hero"><div class="container breadcrumbs"><a href="/">Home</a><span>/</span>${crumb}<span>/</span><span>${esc(page.h1)}</span></div><div class="container authority-hero-grid"><div><span class="section-label">${esc(page.label)}</span><h1>${esc(page.h1)}</h1><p class="lead">${esc(page.lead)}</p><p class="article-meta"><time datetime="${published}">August 4, 2026</time> - Reviewed by MCCS Growing Media</p><div class="hero-actions"><a class="btn btn-primary" href="/contact/">Request Sample</a><a class="btn btn-outline" href="/products/">Compare Models</a></div></div><figure class="authority-hero-media"><img src="${page.image}" alt="${esc(page.imageAlt)}"><figcaption>Use project-specific samples and agreed test methods before bulk approval.</figcaption></figure></div></section>
<section class="section"><div class="container article-layout"><article class="article-body"><div class="article-cta"><b>Procurement takeaway</b><p>${esc(page.takeaway)}</p></div>${sectionHtml}<h2>Buyer evaluation matrix</h2>${tableHtml}<div class="article-cta"><b>Move from evidence to a sourcing decision</b><p>Send the crop or application, tray dimensions, current workflow, destination, expected volume range and required evidence with the inquiry. MCCS sales can then discuss a relevant sample route without changing protected product specifications.</p><div class="hero-actions"><a class="btn btn-primary" href="/contact/">Contact Sales</a><a class="btn btn-outline" href="/sample-shipping/">Plan Sample Shipping</a></div></div></article><aside class="article-side"><div class="instruction-card"><b>Method note</b><p>Record the model, sample reference, conditions and method beside every result. Batch- or project-specific values should not be generalized without supporting evidence.</p></div><div class="instruction-card"><b>Related sourcing resources</b>${related}</div></aside></div></section>
<section class="section section-soft"><div class="container"><span class="section-label">Buyer FAQ</span><h2>Technical and procurement questions</h2><div class="technical-faq">${faqHtml}</div></div></section></main>${footer()}</body></html>`;
}

for (const page of pages) {
  const directory = path.join(root, page.path);
  await mkdir(directory, {recursive: true});
  const html = render(page).replace(
    '</body>',
    '<script src="/assets/ai-referral-tracking.js" defer></script></body>'
  );
  await writeFile(path.join(directory, 'index.html'), html, 'utf8');
}

console.log(`Generated ${pages.length} SEO authority pages.`);
