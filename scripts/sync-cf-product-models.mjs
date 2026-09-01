import fs from "node:fs";
import path from "node:path";

const productFile = "data/products.json";
const csvFile = "data/products-cf.csv";
let products = JSON.parse(fs.readFileSync(productFile, "utf8"));

const verifiedAt = "2026-09-01";
const factoryModels = new Set([
  "CF-005", "CF-006", "CF-060", "CF-060B", "CF-072", "CF-128", "CF-128B",
  "CF-167", "CF-200", "CF-2735", "CF-3038", "CF-3038B", "CF-3545",
  "CF-5050"
]);
const duplicateModels = new Set([
  // Same dimensions as CF-003 and not listed on the factory website.
  "CF-004",
  // Same dimensions as factory-listed CF-006.
  "CF-010",
]);
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
  "CF-060B": {
    name_en: "Orchid Propagation Plug 5.2 cm",
    category: "Orchid Plug",
    size: "Top Ø 5.2 cm / Bottom Ø 3.8 cm / Height 4.8 cm",
    trayFit: "60-cell orchid propagation tray",
    bestFor: "Professional Phalaenopsis propagation requiring a larger plug volume",
    description: "A larger 60-cell orchid propagation plug for Phalaenopsis nursery programs that require additional plug volume.",
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
  "CF-128B": {
    name_en: "128-Cell Cuttings Propagation Plug",
    category: "Cuttings Propagation Plug",
    size: "Top Ø 3.0 cm / Bottom Ø 1.4 cm / Height 3.8 cm",
    trayFit: "128-cell cuttings propagation tray",
    bestFor: "High-density cuttings propagation in 128-cell trays",
    description: "A split 128-cell plug positioned for cuttings propagation; confirm root placement and tray handling in a buyer-side trial.",
    applicationTags: ["Cuttings"],
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

  delete product.video;
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
  }));
}

products = products.filter((product) => !duplicateModels.has(product.model) && product.model !== "CF-3240");
for (const product of products) {
  if (product.model === "CF-003") {
    product.desc = "A compact home starter plug for seed-starting kits, refill packs and small nursery trays.";
    product.description = product.desc;
    product.variantNote = "Compact format for home seed-starting and refill-pack programs.";
    product.positioningNote = "Positioned for home seed-starting and small nursery trays.";
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
    delete product.sourceVerifiedAt;
  }
  applyMedia(product);
}

for (const model of factoryModels) {
  if (!products.some((product) => product.model === model)) {
    throw new Error(`Factory-listed model is missing from the public catalog: ${model}`);
  }
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
      .replace(/\b(?:15|29|32) (molded coconut coir and peat substrate )?models\b/gi, (match, middle = "") => `${products.length} ${middle}models`)
      .replace(/\b(?:15|29|32) modelos\b/gi, `${products.length} modelos`)
      .replace(/(?:15|29|32) نموذجاً/g, `${products.length} نموذجاً`)
      .replace(/(?:15|29|32) 个/g, `${products.length} 个`)
      .replace(/Browse \d+ molded coconut coir and peat substrate models/, `Browse ${products.length} molded coconut coir and peat substrate models`);
    fs.writeFileSync(target, text, "utf8");
  }
}
migrateBuyerCopy(".");

console.log(`Synchronized ${products.length} public CF models with factory-model provenance and media mappings.`);
