import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = "https://www.mccsgrowingmedia.com";
const pages = [
  ["index.html", ""],
  ["products/index.html", "products"],
  ["sample-shipping/index.html", "sample-shipping"],
  ["private-label/index.html", "private-label"],
  ["insights/index.html", "insights"],
  ["middle-east/index.html", "middle-east"],
  ["about/index.html", "about"],
  ["contact/index.html", "contact"],
  ["products/conical-plugs/index.html", "products/conical-plugs"],
  ["insights/hydroponic-grow-plug-guide/index.html", "insights/hydroponic-grow-plug-guide"],
  ["insights/substrate-plug-ec-ph-testing-protocol/index.html", "insights/substrate-plug-ec-ph-testing-protocol"],
  ["applications/automated-transplanter-grow-plugs/index.html", "applications/automated-transplanter-grow-plugs"],
  ["applications/hydroponic-lettuce-grow-plugs/index.html", "applications/hydroponic-lettuce-grow-plugs"]
];

for (const [relativePath, route] of pages) {
  const file = path.join(root, relativePath);
  let html = fs.readFileSync(file, "utf8");
  const cnPath = `/cn/${route ? `${route}/` : ""}`;
  const alternate = `<link rel="alternate" hreflang="zh-CN" href="${site}${cnPath}">`;

  if (!/hreflang=["']zh-CN["']/i.test(html)) {
    html = html.replace(/<\/head>/i, `${alternate}</head>`);
  }

  if (!new RegExp(`href=["']${cnPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`).test(html)) {
    html = html.replace(
      /(<div\b[^>]*class=["'][^"']*language-switcher[^"']*["'][^>]*>)([\s\S]*?)(<\/div>)/i,
      `$1$2<a href="${cnPath}" lang="zh-CN">中文</a>$3`
    );
  }

  fs.writeFileSync(file, html, "utf8");
}

console.log(`Added Chinese alternates to ${pages.length} English pages.`);
