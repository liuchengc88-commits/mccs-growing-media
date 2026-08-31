import fs from "node:fs";
import path from "node:path";

const productFile = "data/products.json";
const csvFile = "data/products-cf.csv";
let products = JSON.parse(fs.readFileSync(productFile, "utf8"));

const verifiedAt = "2026-08-31";
const officialImages = new Set([
  "005", "006", "060", "060B", "072", "128", "128B", "167", "200",
  "2735", "3038", "3038B", "3545", "5050"
]);

const confirmedFactoryModels = {
  "CF-005": {
    name_en: "Cuttings Propagation Plug 5.0 cm",
    category: "Cuttings Propagation Plug",
    size: "Top Ø 2.6 cm / Bottom Ø 1.6 cm / Height 5.0 cm",
    trayFit: "Confirm against the buyer's tray drawing or physical sample",
    bestFor: "Cuttings propagation and narrow, deep propagation cells",
    description: "A narrow, deep molded plug for cuttings workflows that require stable support, air exchange and practical transplant handling.",
    applicationTags: ["Cuttings"],
  },
  "CF-006": {
    name_en: "Cuttings Propagation Plug 4.1 cm",
    category: "Cuttings Propagation Plug",
    size: "Top Ø 3.2 cm / Bottom Ø 2.2 cm / Height 4.1 cm",
    trayFit: "Confirm against the buyer's tray drawing or physical sample",
    bestFor: "Cuttings propagation and general nursery tray-fit trials",
    description: "A medium cuttings plug for propagation workflows where consistent moisture, structural support and clean transplant handling are important.",
    applicationTags: ["Cuttings"],
  },
  "CF-060": {
    name_en: "Orchid Propagation Plug 4.8 cm",
    category: "Orchid Plug",
    size: "Top Ø 4.8 cm / Bottom Ø 3.4 cm / Height 4.6 cm",
    trayFit: "60-cell orchid propagation tray",
    bestFor: "Professional Phalaenopsis propagation and tray-based nursery handling",
    description: "An orchid propagation plug sized for 60-cell trays and root-zone workflows that prioritize aeration, moisture balance and structural stability.",
    applicationTags: ["Orchid"],
  },
  "CF-072": {
    name_en: "Tissue Culture Propagation Plug 4.0 cm",
    category: "Tissue Culture Plug",
    size: "Top Ø 4.0 cm / Bottom Ø 2.0 cm / Height 4.0 cm",
    trayFit: "72-cell propagation tray",
    bestFor: "Tissue-culture acclimatization and nursery transition in 72-cell trays",
    description: "A 72-cell tissue-culture propagation plug for young plants transitioning from controlled laboratory conditions into nursery or greenhouse production.",
    applicationTags: ["Tissue Culture", "Seedling"],
  },
  "CF-128": {
    name_en: "Tissue Culture Propagation Plug 3.8 cm",
    category: "Tissue Culture Plug",
    size: "Top Ø 3.0 cm / Bottom Ø 1.4 cm / Height 3.8 cm",
    trayFit: "128-cell propagation tray",
    bestFor: "Tissue-culture acclimatization and compact nursery propagation",
    description: "A split tissue-culture plug for placing young plants around the root zone before setting the complete unit into a 128-cell tray.",
    applicationTags: ["Tissue Culture", "Seedling"],
  },
  "CF-167": {
    name_en: "Compact Cuttings Plug 3.0 cm",
    category: "Cuttings Propagation Plug",
    size: "Top Ø 2.5 cm / Bottom Ø 2.1 cm / Height 3.0 cm",
    trayFit: "Confirm against the buyer's tray drawing or physical sample",
    bestFor: "High-density cuttings propagation and compact nursery cells",
    description: "A compact cuttings plug for high-density propagation programs and buyer-side tray-fit validation.",
    applicationTags: ["Cuttings"],
  },
  "CF-200": {
    name_en: "200-Cell Cuttings Propagation Plug",
    category: "Cuttings Propagation Plug",
    size: "Top Ø 2.3 cm / Bottom Ø 2.0 cm / Height 2.8 cm",
    trayFit: "200-cell propagation tray",
    bestFor: "High-density cuttings propagation and automated 200-cell nursery workflows",
    description: "A compact molded plug aligned with 200-cell cuttings propagation and high-density nursery handling.",
    applicationTags: ["Cuttings", "Seedling"],
  },
  "CF-2735": {
    name_en: "Tissue Culture Propagation Plug 3.5 cm",
    category: "Tissue Culture Plug",
    size: "Top Ø 2.7 cm / Bottom Ø 2.3 cm / Height 3.5 cm",
    trayFit: "180-cell propagation tray",
    bestFor: "Tissue-culture acclimatization and compact high-count trays",
    description: "A compact tissue-culture propagation plug documented for 180-cell tray workflows.",
    applicationTags: ["Tissue Culture"],
  },
  "CF-3038": {
    name_en: "Cuttings Propagation Plug 3.8 cm",
    category: "Cuttings Propagation Plug",
    size: "Top Ø 3.0 cm / Bottom Ø 2.2 cm / Height 3.8 cm",
    trayFit: "Confirm against the buyer's tray drawing or physical sample",
    bestFor: "Commercial cuttings propagation and model-to-tray trials",
    description: "A cuttings propagation plug supported by a factory application video and intended for buyer-side crop and tray trials.",
    applicationTags: ["Cuttings"],
  },
  "CF-3038B": {
    name_en: "Hydroponic Propagation Plug 3.8 cm",
    category: "Hydroponic Plug",
    size: "Top Ø 3.0 cm / Bottom Ø 2.2 cm / Height 3.8 cm",
    trayFit: "Confirm against the buyer's hydroponic tray or holder",
    bestFor: "Hydroponic sowing, nursery production and controlled-environment systems",
    description: "A hydroponic propagation plug for water-based growing workflows; confirm the B variant against the buyer's tray before bulk production.",
    applicationTags: ["Hydroponic", "Seedling"],
  },
  "CF-3545": {
    name_en: "Hydroponic Propagation Plug 4.5 cm",
    category: "Hydroponic Plug",
    size: "Top Ø 3.5 cm / Bottom Ø 2.2 cm / Height 4.5 cm",
    trayFit: "Confirm against the buyer's hydroponic tray or holder",
    bestFor: "Hydroponic propagation and controlled-environment nursery production",
    description: "A hydroponic propagation plug designed around moisture distribution, air-water balance and stable transplant handling.",
    applicationTags: ["Hydroponic", "Seedling"],
  },
  "CF-5050": {
    name_en: "50-Cell Cuttings Propagation Plug",
    category: "Cuttings Propagation Plug",
    size: "Top Ø 5.0 cm / Bottom Ø 3.8 cm / Height 5.0 cm",
    trayFit: "50-cell propagation tray",
    bestFor: "Larger cuttings and commercial 50-cell nursery workflows",
    description: "A larger cuttings propagation plug documented for 50-cell tray workflows and stable transplant handling.",
    applicationTags: ["Cuttings"],
  }
};

const videoByApplication = {
  Cuttings: {
    src: "assets/videos/cf-3038-cuttings.mp4",
    title: "Cuttings propagation application reference",
    scope: "Application reference; CF-3038 is the model shown."
  },
  Orchid: {
    src: "assets/videos/cf-orchid-application.mp4",
    title: "Phalaenopsis nursery application reference",
    scope: "Application reference; confirm the selected CF model before trial."
  },
  "Tissue Culture": {
    src: "assets/videos/cf-128-tissue-culture.mp4",
    title: "Tissue-culture plug handling reference",
    scope: "CF-128 handling is shown; other CF models require separate tray-fit confirmation."
  },
  Hydroponic: {
    src: "assets/videos/cf-plant-factory-seedling.mp4",
    title: "Plant-factory seedling application reference",
    scope: "Application reference; confirm the selected CF model and holder dimensions."
  },
  Seedling: {
    src: "assets/videos/cf-transplanter-application.mp4",
    title: "Automated transplanting application reference",
    scope: "Application reference; machine and tray compatibility must be validated by trial."
  },
  default: {
    src: "assets/videos/cf-material-overview.mp4",
    title: "Molded substrate material overview",
    scope: "Material-family reference; not a model-specific performance test."
  }
};

function cfModel(value) {
  return typeof value === "string"
    ? value.replace(/\b(?:ZY|X)-(\d+[A-Z]?)\b/g, "CF-$1")
    : value;
}

function applyMedia(product) {
  const suffix = product.model.replace("CF-", "");
  if (officialImages.has(suffix)) {
    product.image = `assets/products/CF-${suffix}-factory.webp`;
    product.imageAlt = `${product.model} factory product image`;
    product.imageType = "Factory product image";
  } else {
    product.image = product.image.replace(/assets\/products\/ZY-/i, "assets/products/CF-");
    product.imageAlt ||= `${product.model} molded substrate product image`;
    product.imageType ||= "Product catalog image";
  }

  product.gallery = (product.gallery || [product.image]).map((item) =>
    item.replace(/assets\/products\/ZY-/i, "assets/products/CF-")
  );
  product.gallery[0] = product.image;

  const primaryTag = (product.applicationTags || []).find((tag) => videoByApplication[tag]);
  product.video = videoByApplication[primaryTag] || videoByApplication.default;
  if (product.model === "CF-3038") {
    product.video = {
      src: "assets/videos/cf-3038-cuttings.mp4",
      title: "CF-3038 cuttings propagation record",
      scope: "Model-specific factory application video."
    };
  }
  if (product.model === "CF-128") {
    product.video = {
      src: "assets/videos/cf-128-tissue-culture.mp4",
      title: "CF-128 tissue-culture handling sequence",
      scope: "Model-specific factory application video."
    };
  }
}

products = products.filter((product) => !["X-090", "ZY-090", "CF-090"].includes(product.model));

for (const product of products) {
  const oldModel = product.model;
  product.model = cfModel(oldModel);
  delete product.sourceModel;
  delete product.sourceUrl;
  product.slug = product.slug.replace(/^(?:zy|x)-/, "cf-");
  for (const key of ["name", "name_en", "desc", "description", "variantNote", "positioningNote"]) {
    if (key in product) product[key] = cfModel(product[key]);
  }

  const confirmed = confirmedFactoryModels[product.model];
  if (confirmed) {
    Object.assign(product, confirmed);
    product.name = `${product.model} ${product.name_en}`;
    product.desc = product.description;
    product.factorySpecificationStatus = "Dimensions and application cross-checked against the factory website.";
    product.sourceVerifiedAt = verifiedAt;
  } else {
    product.factorySpecificationStatus = "Listed in the approved product catalog; confirm the current production drawing during sampling.";
  }
  applyMedia(product);
}

function cloneProduct(baseModel, overrides) {
  const base = products.find((product) => product.model === baseModel);
  if (!base) throw new Error(`Missing base model ${baseModel}`);
  return JSON.parse(JSON.stringify({ ...base, ...overrides }));
}

if (!products.some((product) => product.model === "CF-060B")) {
  products.push(cloneProduct("CF-060", {
    model: "CF-060B",
    slug: "cf-060b",
    name_en: "Orchid Propagation Plug 5.2 cm",
    name: "CF-060B Orchid Propagation Plug 5.2 cm",
    size: "Top Ø 5.2 cm / Bottom Ø 3.8 cm / Height 4.8 cm",
    description: "A larger 60-cell orchid propagation plug for Phalaenopsis nursery programs that require additional plug volume.",
    desc: "A larger 60-cell orchid propagation plug for Phalaenopsis nursery programs that require additional plug volume.",
    image: "assets/products/CF-060B-factory.webp",
    imageAlt: "CF-060B factory product image",
    gallery: ["assets/products/CF-060B-factory.webp", "assets/factory-packaging.webp", "assets/sample-shipping-hero.webp"],
    status: "New"
  }));
}

if (!products.some((product) => product.model === "CF-128B")) {
  products.push(cloneProduct("CF-128", {
    model: "CF-128B",
    slug: "cf-128b",
    name_en: "128-Cell Cuttings Propagation Plug",
    name: "CF-128B 128-Cell Cuttings Propagation Plug",
    category: "Cuttings Propagation Plug",
    size: "Top Ø 3.0 cm / Bottom Ø 1.4 cm / Height 3.8 cm",
    trayFit: "128-cell cuttings propagation tray",
    bestFor: "High-density cuttings propagation in 128-cell trays",
    description: "A split 128-cell plug positioned for cuttings propagation; confirm root placement and tray handling in a buyer-side trial.",
    desc: "A split 128-cell plug positioned for cuttings propagation; confirm root placement and tray handling in a buyer-side trial.",
    applicationTags: ["Cuttings"],
    image: "assets/products/CF-128B-factory.webp",
    imageAlt: "CF-128B factory product image",
    gallery: ["assets/products/CF-128B-factory.webp", "assets/factory-packaging.webp", "assets/sample-shipping-hero.webp"],
    status: "New",
    video: videoByApplication.Cuttings
  }));
}

if (!products.some((product) => product.model === "CF-3240")) {
  products.push(cloneProduct("CF-3038", {
    model: "CF-3240",
    slug: "cf-3240",
    name_en: "Cuttings Propagation Plug 4.0 cm",
    name: "CF-3240 Cuttings Propagation Plug 4.0 cm",
    size: "Top Ø 3.2 cm / Bottom Ø 2.5 cm / Height 4.0 cm",
    trayFit: "Confirm against the buyer's tray drawing or physical sample",
    bestFor: "Cuttings propagation and tray-fit projects requiring a 3.2 cm top diameter",
    description: "A cuttings propagation model documented by factory dimensions. The factory product photograph is not yet published, so the catalog uses a dimension reference instead of a substituted product photo.",
    desc: "A cuttings propagation model documented by factory dimensions. The factory product photograph is not yet published, so the catalog uses a dimension reference instead of a substituted product photo.",
    image: "assets/products/CF-3240-dimensions.webp",
    imageAlt: "CF-3240 confirmed dimension reference diagram",
    imageType: "Confirmed dimension reference",
    gallery: ["assets/products/CF-3240-dimensions.webp", "assets/factory-packaging.webp", "assets/sample-shipping-hero.webp"],
    status: "New",
    video: videoByApplication.Cuttings
  }));
}

products.sort((a, b) => a.model.localeCompare(b.model, "en", { numeric: true }));
const models = products.map((product) => product.model);
if (models.some((model) => !/^CF-/.test(model))) throw new Error("A public product model does not start with CF-");
if (new Set(models).size !== models.length) throw new Error("The CF model migration created duplicate models");

fs.writeFileSync(productFile, `${JSON.stringify(products, null, 2)}\n`, "utf8");

const columns = [
  "model", "name", "size", "tray_fit", "best_for", "moq",
  "carton_qty", "carton_note", "material", "packaging"
];
const escapeCsv = (value = "") => {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const rows = products.map((product) => [
  product.model, product.name_en, product.size, product.trayFit,
  product.bestFor, product.moq, product.cartonQty, product.cartonNote, product.material,
  product.packaging
].map(escapeCsv).join(","));
fs.writeFileSync(csvFile, `${columns.join(",")}\n${rows.join("\n")}\n`, "utf8");

const skipped = new Set([".git", "node_modules", "output", "outputs", "reports", "tmp"]);
function migrateBuyerCopy(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) migrateBuyerCopy(target);
    if (!entry.isFile()) continue;
    if (![".html", ".md", ".txt"].includes(path.extname(entry.name))) continue;
    if (["admin.html", "privacy.html", "terms.html"].includes(entry.name)) continue;
    let text = fs.readFileSync(target, "utf8");
    text = text
      .replace(/\bZY-(\d+[A-Z]?)\b/g, "CF-$1")
      .replaceAll("ZY Series", "CF Series")
      .replaceAll("ZY 系列", "CF 系列")
      .replaceAll("ZY models", "CF models")
      .replaceAll("ZY model", "CF model")
      .replace(/\b29 (molded coconut coir and peat substrate )?models\b/gi, (match, middle = "") => `32 ${middle}models`)
      .replace(/\b29 modelos\b/gi, "32 modelos")
      .replace(/29 نموذجاً/g, "32 نموذجاً")
      .replace(/29 个/g, "32 个")
      .replace(/Browse \d+ molded coconut coir and peat substrate models/, `Browse ${products.length} molded coconut coir and peat substrate models`);
    fs.writeFileSync(target, text, "utf8");
  }
}
migrateBuyerCopy(".");

console.log(`Synchronized ${products.length} public CF models with factory-model provenance and media mappings.`);
