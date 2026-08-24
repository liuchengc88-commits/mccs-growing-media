const productCn = {
  "ZY-001": ["锥形水培育苗块 6.5 cm", "适用于紧凑型水培定植孔、家庭水培设备和小型育苗项目。"],
  "ZY-004": ["多肉育苗块 3.7 cm", "适用于多肉繁殖、小型装饰盆和零售种植套装。"],
  "ZY-017": ["兰花基质块 5.3 cm", "适用于兰花幼苗、组培苗过渡和早期换盆。"],
  "ZY-025": ["兰花种植杯 6.5 cm", "适用于兰花中期生长和较大容器换盆。"],
  "ZY-028": ["高型兰花种植杯 8.3 cm", "适用于较高兰花植株和专项换盆项目。"],
  "ZY-035": ["大型兰花种植杯 10.5 cm", "适用于较成熟兰花和大规格容器。"],
  "ZY-128": ["组培育苗块 3.7 cm", "适用于组培生根、整齐幼苗和高密度育苗盘。"],
  "ZY-072": ["72 穴育苗块 4.0 cm", "适用于蔬菜、花卉和商业育苗。"],
  "ZY-200": ["高密度育苗块 2.8 cm", "适用于植物工厂和高密度育苗系统。"],
  "ZY-005": ["方形水培育苗块 5.0 cm", "适用于方形定植孔、家庭水培和零售育苗套装。"],
  "ZY-003": ["家庭育苗块 3.7 cm", "适用于家庭播种、补充装和入门育苗套装。"],
  "ZY-006": ["方形育苗块 4.0 cm", "适用于方形穴盘和常规育苗。"],
  "ZY-901": ["鹿角蕨上板球 20 cm", "适用于大型鹿角蕨上板测试和附生植物装饰展示。"],
  "ZY-902": ["鹿角蕨上板球 16 cm", "适用于中型鹿角蕨上板测试和附生植物展示。"],
  "ZY-903": ["鹿角蕨上板球 11 cm", "适用于小型鹿角蕨上板测试和紧凑型附生植物展示。"],
  "ZY-129": ["圆柱形育苗块 3.1 cm", "适用于扦插、播种和圆柱形穴孔。"],
  "ZY-067": ["多肉种植杯 6.7 cm", "适用于多肉种植、装饰花器和家庭园艺套装。"],
  "ZY-010": ["通用育苗块 4.1 cm", "适用于播种、扦插和不同穴盘的前期测试。"],
  "ZY-015": ["兰花育苗块 4.5 cm", "适用于兰花育苗和分阶段换盆。"],
  "ZY-060": ["蝴蝶兰育苗块（双规格）", "提供两种目录规格，取样前需确认所选尺寸和穴盘匹配。"],
  "ZY-2735": ["紧凑型组培基质块 3.5 cm", "适用于组培苗过渡和紧凑型育苗盘。"],
  "ZY-104": ["通用育苗块 4.0 cm", "适用于常规育苗、播种和移栽测试。"],
  "ZY-167": ["紧凑型育苗块 3.1 cm", "适用于高密度播种、扦插和紧凑型穴盘。"],
  "ZY-3038": ["育苗基质块 3.8 cm", "适用于常规育苗、扦插和穴盘匹配测试。"],
  "ZY-3038B": ["育苗基质块 3.8 cm B 型", "与 ZY-3038 外部目录尺寸相同，需按实物样品确认具体型号。"],
  "ZY-3545": ["育苗基质块 4.5 cm", "适用于蔬菜、花卉和常规育苗。"],
  "ZY-3550": ["高型育苗块 5.3 cm", "适用于需要较深基质空间的幼苗和扦插。"],
  "ZY-5050": ["大型育苗块 5.0 cm", "适用于较大幼苗、换盆和特色作物。"],
  "ZY-7050": ["高型育苗块 6.8 cm", "适用于较深穴盘和移栽阶段测试。"]
};

const categoryCn = {
  "Hydroponic Plug": "水培育苗块",
  "Succulent Plug": "多肉育苗块",
  "Orchid Plug": "兰花基质块",
  "Orchid Planting Cup": "兰花种植杯",
  "Tissue Culture Plug": "组培基质块",
  "Seedling Plug": "育苗基质块",
  "High-Density Plug": "高密度育苗块",
  "Square Plug": "方形育苗块",
  "Staghorn Fern Mounting Ball": "鹿角蕨上板球",
  "Cylindrical Plug": "圆柱形基质块",
  "Succulent Growing Cup": "多肉种植杯",
  "Growing Cup": "种植杯"
};

const applicationCn = {
  "Seedling": "育苗",
  "Orchid": "兰花",
  "Tissue Culture": "组培",
  "Hydroponic": "水培",
  "Succulent": "多肉",
  "Staghorn Fern": "鹿角蕨",
  "Epiphyte": "附生植物"
};

async function loadChineseProducts() {
  const grid = document.getElementById("productMatrix");
  const compareBody = document.getElementById("productCompareBody");
  if (!grid) return;

  const products = await fetch("/data/products.json", { cache: "no-store" }).then((response) => response.json());
  const search = document.getElementById("productFilter");
  const category = document.getElementById("categoryFilter");
  const buttons = [...document.querySelectorAll(".app-filter")];
  let application = "";

  [...new Set(products.map((product) => product.category).filter(Boolean))].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = categoryCn[value] || value;
    category.appendChild(option);
  });

  function card(product) {
    const localized = productCn[product.model] || [product.name_en, product.description];
    const tags = (product.applicationTags || []).map((tag) => `<span>${applicationCn[tag] || tag}</span>`).join("");
    const status = product.status ? `<em class="product-status">${product.status === "New" ? "新增" : product.status}</em>` : "";
    return `<article id="${product.slug}" class="matrix-card cf-product-card"><div class="product-image-panel">${status}<img src="/${product.image}" alt="${product.model} ${localized[0]} 实物图" loading="lazy"></div><div class="matrix-body"><span>${product.model}</span><h2>${localized[0]}</h2><p>${localized[1]}</p><div class="tag-row">${tags}</div><dl><dt>类别</dt><dd>${categoryCn[product.category] || product.category}</dd><dt>尺寸</dt><dd>${product.size}</dd><dt>穴盘 / 容器匹配</dt><dd>${product.trayFit}</dd><dt>适用场景</dt><dd>${product.bestFor}</dd><dt>装箱数量</dt><dd>${product.cartonQty}</dd><dt>起订量</dt><dd>${product.moq}</dd></dl><a class="btn btn-primary" href="/cn/contact/">申请样品</a></div></article>`;
  }

  function render() {
    const query = (search.value || "").toLowerCase();
    const selectedCategory = category.value;
    const items = products.filter((product) => {
      const localized = productCn[product.model] || [];
      const text = `${JSON.stringify(product)} ${localized.join(" ")}`.toLowerCase();
      return (!application || (product.applicationTags || []).includes(application)) && (!selectedCategory || product.category === selectedCategory) && (!query || text.includes(query));
    });
    grid.innerHTML = items.map(card).join("") || "<p>没有找到匹配产品。</p>";
    compareBody.innerHTML = items.map((product) => {
      const localized = productCn[product.model] || [product.name_en];
      const applications = (product.applicationTags || []).map((tag) => applicationCn[tag] || tag).join(" / ");
      return `<tr><td><strong>${product.model}</strong></td><td>${localized[0]}</td><td>${product.size}</td><td>${product.trayFit}</td><td>${applications}</td></tr>`;
    }).join("");
  }

  buttons.forEach((button) => button.addEventListener("click", () => {
    application = button.dataset.app || "";
    buttons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    render();
  }));
  search.addEventListener("input", render);
  category.addEventListener("change", render);
  render();
}

loadChineseProducts().catch(() => {
  const grid = document.getElementById("productMatrix");
  if (grid) grid.innerHTML = "<p>产品数据暂时无法加载，请稍后重试。</p>";
});
