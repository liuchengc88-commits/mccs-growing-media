const productCn = {
  "CF-001": ["锥形水培育苗块 6.5 cm", "适用于紧凑型水培定植孔、家庭水培设备和小型育苗项目。"],
  "CF-017": ["兰花基质块 5.3 cm", "适用于兰花幼苗、组培苗过渡和早期换盆。"],
  "CF-025": ["兰花种植杯 6.5 cm", "适用于兰花中期生长和较大容器换盆。"],
  "CF-028": ["高型兰花种植杯 8.3 cm", "适用于较高兰花植株和专项换盆项目。"],
  "CF-035": ["大型兰花种植杯 10.5 cm", "适用于较成熟兰花和大规格容器。"],
  "CF-128": ["128 穴组培育苗块 3.8 cm", "适用于组培苗驯化、放苗包根和 128 穴盘育苗。"],
  "CF-072": ["72 穴组培育苗块 4.0 cm", "适用于组培苗从实验室环境向苗场或温室过渡。"],
  "CF-200": ["200 穴扦插育苗块 2.8 cm", "适用于高密度扦插繁殖和 200 穴盘育苗。"],
  "CF-005": ["扦插育苗块 5.0 cm", "适用于窄深穴孔与扦插繁殖流程。"],
  "CF-003": ["家庭育苗块 3.7 cm", "适用于家庭播种、补充装和入门育苗套装。"],
  "CF-006": ["扦插育苗块 4.1 cm", "适用于扦插繁殖和穴盘匹配测试。"],
  "CF-901": ["鹿角蕨上板球 20 cm", "适用于大型鹿角蕨上板测试和附生植物装饰展示。"],
  "CF-902": ["鹿角蕨上板球 16 cm", "适用于中型鹿角蕨上板测试和附生植物展示。"],
  "CF-903": ["鹿角蕨上板球 11 cm", "适用于小型鹿角蕨上板测试和紧凑型附生植物展示。"],
  "CF-129": ["圆柱形育苗块 3.1 cm", "适用于扦插、播种和圆柱形穴孔。"],
  "CF-067": ["多肉种植杯 6.7 cm", "适用于多肉种植、装饰花器和家庭园艺套装。"],
  "CF-015": ["兰花育苗块 4.5 cm", "适用于兰花育苗和分阶段换盆。"],
  "CF-060": ["60 穴蝴蝶兰育苗块 4.8 cm", "适用于蝴蝶兰育苗及 60 穴盘苗场操作。"],
  "CF-060B": ["60 穴蝴蝶兰育苗块 5.2 cm", "适用于需要更大基质体积的蝴蝶兰育苗项目。"],
  "CF-2735": ["紧凑型组培基质块 3.5 cm", "适用于组培苗过渡和紧凑型育苗盘。"],
  "CF-104": ["通用育苗块 4.0 cm", "适用于常规育苗、播种和移栽测试。"],
  "CF-128B": ["128 穴扦插育苗块 3.8 cm", "适用于高密度扦插繁殖和 128 穴盘。"],
  "CF-167": ["紧凑型扦插育苗块 3.0 cm", "适用于高密度扦插和紧凑型穴盘。"],
  "CF-3038": ["扦插育苗块 3.8 cm", "适用于商业扦插育苗和穴盘匹配测试。"],
  "CF-3038B": ["水培育苗块 3.8 cm B 型", "适用于水培播种、育苗和植物工厂系统。"],
  "CF-3240": ["扦插育苗块 4.0 cm", "工厂已确认尺寸，取样前需按穴盘图纸或实物确认匹配。"],
  "CF-3545": ["水培育苗块 4.5 cm", "适用于水培育苗和可控环境生产。"],
  "CF-3550": ["高型育苗块 5.3 cm", "适用于需要较深基质空间的幼苗和扦插。"],
  "CF-5050": ["50 穴扦插育苗块 5.0 cm", "适用于较大插穗和 50 穴商业育苗流程。"],
  "CF-7050": ["高型育苗块 6.8 cm", "适用于较深穴盘和移栽阶段测试。"]
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
  ,"Cuttings Propagation Plug": "扦插育苗块"
};

const applicationCn = {
  "Seedling": "育苗",
  "Orchid": "兰花",
  "Tissue Culture": "组培",
  "Hydroponic": "水培",
  "Succulent": "多肉",
  "Staghorn Fern": "鹿角蕨",
  "Epiphyte": "附生植物"
  ,"Cuttings": "扦插"
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
    const video = product.video ? `<div class="product-video"><b>${product.video.title}</b><video controls playsinline preload="none" poster="/${product.image}"><source src="/${product.video.src}" type="video/mp4"></video><small>${product.video.scope}</small></div>` : "";
    return `<article id="${product.slug}" class="matrix-card cf-product-card"><div class="product-image-panel">${status}<img src="/${product.image}" alt="${product.imageAlt || `${product.model} ${localized[0]}`}" loading="lazy"></div><div class="matrix-body"><span>${product.model}</span><h2>${localized[0]}</h2><p>${localized[1]}</p><div class="tag-row">${tags}</div><dl><dt>类别</dt><dd>${categoryCn[product.category] || product.category}</dd><dt>尺寸</dt><dd>${product.size}</dd><dt>穴盘 / 容器匹配</dt><dd>${product.trayFit}</dd><dt>适用场景</dt><dd>${product.bestFor}</dd><dt>装箱数量</dt><dd>${product.cartonQty}</dd><dt>起订量</dt><dd>${product.moq}</dd></dl>${video}<a class="btn btn-primary" href="/cn/contact/">申请样品</a></div></article>`;
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
