import fs from "node:fs";
import path from "node:path";

const productFile = "data/products.json";
const csvFile = "data/products-cf.csv";
let products = JSON.parse(fs.readFileSync(productFile, "utf8"));
products = products.filter((product) => !["X-090", "ZY-090"].includes(product.model));
const mountingCopy = {
  "ZY-901": {
    name: "Staghorn Fern Mounting Ball 20 cm",
    bestFor: "Large staghorn fern board-mounting trials and decorative epiphyte displays",
    desc: "A large molded-media mounting ball for staghorn fern board-mounting trials and decorative epiphyte display programs."
  },
  "ZY-902": {
    name: "Staghorn Fern Mounting Ball 16 cm",
    bestFor: "Medium staghorn fern board-mounting trials and retail epiphyte displays",
    desc: "A medium molded-media mounting ball for staghorn fern board-mounting trials and decorative epiphyte display programs."
  },
  "ZY-903": {
    name: "Staghorn Fern Mounting Ball 11 cm",
    bestFor: "Compact staghorn fern board-mounting trials and small epiphyte displays",
    desc: "A compact molded-media mounting ball for staghorn fern board-mounting trials and small decorative epiphyte displays."
  }
};

function updateReferences(value) {
  if (typeof value !== "string") return value;
  return value.replace(/\b(?:CF|X)-(\d+[A-Z]?)\b/g, "ZY-$1");
}

for (const product of products) {
  const oldModel = product.model;
  product.model = updateReferences(oldModel);
  product.slug = product.slug.replace(/^(?:cf|x)-/, "zy-");

  for (const key of ["name", "name_en", "desc", "description", "variantNote", "positioningNote"]) {
    if (key in product) product[key] = updateReferences(product[key]);
  }

  const mounting = mountingCopy[product.model];
  if (!mounting) continue;

  product.name_en = mounting.name;
  product.name = `${product.model} ${mounting.name}`;
  product.category = "Staghorn Fern Mounting Ball";
  product.category_en = "Staghorn Fern Mounting Ball";
  product.trayFit = "Staghorn fern mounting boards, hanging displays or epiphyte mounting systems";
  product.bestFor = mounting.bestFor;
  product.desc = mounting.desc;
  product.description = mounting.desc;
  product.applicationTags = ["Staghorn Fern", "Epiphyte"];
}

const models = products.map((product) => product.model);
if (models.some((model) => !/^ZY-/.test(model))) throw new Error("A product model does not start with ZY-");
if (new Set(models).size !== models.length) throw new Error("The ZY model migration created duplicate models");

fs.writeFileSync(productFile, `${JSON.stringify(products, null, 2)}\n`, "utf8");

const columns = [
  "model", "name", "size", "tray_fit", "best_for", "moq", "carton_qty",
  "carton_note", "material", "packaging"
];
const escapeCsv = (value = "") => {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const rows = products.map((product) => [
  product.model,
  product.name_en,
  product.size,
  product.trayFit,
  product.bestFor,
  product.moq,
  product.cartonQty,
  product.cartonNote,
  product.material,
  product.packaging
].map(escapeCsv).join(","));
fs.writeFileSync(csvFile, `${columns.join(",")}\n${rows.join("\n")}\n`, "utf8");

const buyerPages = [];
const skippedDirectories = new Set([".git", ".github", "ar", "assets", "cn", "data", "docs", "es", "node_modules", "output", "reports", "scripts", "tmp"]);
function findEnglishBuyerPages(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) findEnglishBuyerPages(target);
    if (entry.isFile() && entry.name === "index.html") buyerPages.push(target);
  }
}
findEnglishBuyerPages(".");
buyerPages.push("es/products/index.html", "ar/products/index.html");

for (const file of buyerPages) {
  const html = fs.readFileSync(file, "utf8")
    .replaceAll("CF Series", "ZY Series")
    .replaceAll("CF models", "ZY models")
    .replaceAll("CF model", "ZY model")
    .replace(/Browse \d+ molded coconut coir and peat substrate models/, `Browse ${products.length} molded coconut coir and peat substrate models`)
    .replaceAll("Succulent mounting forms", "Staghorn fern mounting forms")
    .replaceAll("Succulents and decorative planting concepts.", "Staghorn ferns and epiphyte mounting concepts.");
  fs.writeFileSync(file, html, "utf8");
}

console.log(`Synchronized ${products.length} ZY product models, buyer copy and the downloadable CSV.`);
