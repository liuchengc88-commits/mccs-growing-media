import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = "https://www.mccsgrowingmedia.com";
const assetVersion = "20260824-cn";

function writePage(target, content) {
  const versioned = content
    .replace('/assets/mobile-ux.js"', `/assets/mobile-ux.js?v=${assetVersion}"`)
    .replace('/assets/form-protection.js"', `/assets/form-protection.js?v=${assetVersion}"`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, versioned);
}

const routes = [
  ["", "", "MCCS 塑形椰糠泥炭基质块｜工厂直供", "面向水培温室、育苗场、兰花、组培和贴牌采购商的塑形椰糠泥炭基质块。支持选型、样品测试和出口协同。", "工厂直供塑形基质", "MCCS 椰糠 × 泥炭塑形基质块", "不是普通椰砖。MCCS 是按穴盘、定植杯和商业化种植流程成型的专业基质产品，适用于海外 B2B 采购、样品验证和定制包装。", "/assets/cf-series-hero.webp"],
  ["sample-shipping", "sample-shipping", "MCCS 样品与出口运输｜基质块采购", "了解 MCCS 基质块样品确认、快递测试、装箱讨论、海运与出口文件协同流程。", "样品与运输", "先测试，再决定批量采购", "先确认作物、穴盘和目标市场，再选择样品型号并记录吸水、湿态稳定性、移栽操作和运输后的包装状态。", "/assets/sample-shipping-hero.webp"],
  ["private-label", "private-label", "MCCS 基质块贴牌与 OEM 包装", "MCCS 为合格 B2B 项目提供基质块选型、零售盒、补充袋、标签和贴牌包装协同。", "贴牌与 OEM", "从产品样品到包装批准", "先批准产品型号和使用方法，再确认包装尺寸、装箱方式、标签文字和项目可使用的技术声明。", "/assets/private-label-hero.webp"],
  ["middle-east", "middle-east", "沙特与中东温室基质样品｜MCCS", "面向沙特和海湾温室、植物工厂及水培项目的 MCCS 基质块样品测试、文件和出口协同。", "沙特与中东", "为当地温室项目制定样品测试方案", "沙特当地可协调样品获取。采购方应结合自己的作物、穴盘、灌溉和环境条件验证尺寸、吸水、湿态操作和移栽表现。", "/assets/cf-series-hero.webp"],
  ["about", "about", "关于 MCCS Growing Media｜塑形基质工厂", "了解 MCCS 塑形椰糠泥炭基质块的生产定位、参考产能、项目测试和出口协同能力。", "关于 MCCS", "专注塑形椰糠与泥炭基质", "MCCS Growing Media 面向商业育苗、水培、兰花、组培和贴牌项目提供工厂直供产品、样品验证与出口协同。", "/assets/factory-exterior.webp"]
];

const nav = `<nav class="menu"><a href="/cn/">首页</a><a href="/cn/products/">产品</a><a href="/cn/sample-shipping/">样品与运输</a><a href="/cn/private-label/">贴牌定制</a><a href="/cn/insights/">技术资料</a><a href="/cn/middle-east/">中东市场</a><a href="/cn/about/">关于我们</a><a href="/cn/contact/">联系我们</a></nav>`;

function header(enPath = "/", cnPath = "") {
  const route = cnPath || enPath.replace(/^\/+|\/+$/g, "");
  const currentCnPath = `/cn/${route ? `${route}/` : ""}`;
  return `<header class="site-header"><div class="container nav"><a class="brand" href="/cn/"><span class="brand-mark"><svg class="brand-seedling" viewBox="0 0 64 64" aria-hidden="true"><path d="M31.8 45.6c-1.9 0-3.4-1.5-3.4-3.4V31.7c-6.9-.8-13.1-5.9-15.2-12.9-.4-1.3.5-2.6 1.9-2.7 8.3-.7 15.1 3.9 17.1 10.8 2.2-6.7 8.9-11.1 17-10.5 1.4.1 2.3 1.5 1.9 2.8-2.3 6.9-8.4 11.9-15.2 12.6v10.4c0 1.9-1.5 3.4-3.4 3.4h-.7z"/></svg></span><span><strong>MCCS Plug</strong><small>塑形种植基质</small></span></a><button class="mobile-menu-toggle" type="button" aria-label="打开导航" aria-expanded="false"><span></span><span></span><span></span></button>${nav}<div class="language-switcher" aria-label="语言切换"><a href="${enPath}" lang="en">EN</a><a href="${currentCnPath}" lang="zh-CN" aria-current="page">中文</a></div><a class="btn btn-primary" href="/cn/contact/">申请样品</a></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container footer-grid"><div><strong>MCCS Growing Media</strong><p>面向商业育苗、水培、兰花、组培和贴牌项目的塑形椰糠泥炭基质块。</p><img src="/assets/sgs-badge.svg" alt="MCCS 合格项目可申请 SGS 报告资料" class="footer-badge"></div><div><b>采购路径</b><a href="/cn/products/">产品目录</a><a href="/cn/sample-shipping/">样品与运输</a><a href="/cn/private-label/">贴牌定制</a></div><div><b>技术资料</b><a href="/cn/insights/">采购与测试指南</a><a href="/cn/products/conical-plugs/">锥形基质块技术资料</a><a href="/cn/use-guide/">消费者使用说明</a></div><div><b>联系</b><a href="mailto:sales@mccsgrowingmedia.com">sales@mccsgrowingmedia.com</a><a href="https://wa.me/8618922290417">+86 189 2229 0417</a><span>中国广东省广州市花都区</span></div></div><div class="container footer-bottom">© 2026 Guangzhou Chengfeng Trading Co., Ltd.</div></footer><a class="whatsapp-float" href="https://wa.me/8618922290417" target="_blank" rel="noopener">WhatsApp</a><script src="/assets/mobile-ux.js" defer></script>`;
}

function head(title, description, cnPath, enPath, schemaType = "WebPage") {
  const canonical = `${site}/cn/${cnPath ? `${cnPath}/` : ""}`;
  const schema = { "@context": "https://schema.org", "@type": schemaType, name: title, description, url: canonical, inLanguage: "zh-CN", isPartOf: { "@id": `${site}/#organization` } };
  return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="zh-CN" href="${canonical}"><link rel="alternate" hreflang="en" href="${site}${enPath}"><link rel="alternate" hreflang="x-default" href="${site}${enPath}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/cn/cn.css"><script async src="https://www.googletagmanager.com/gtag/js?id=G-JGR2SQBQHW"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-JGR2SQBQHW');</script><script type="application/ld+json">${JSON.stringify(schema)}</script></head>`;
}

function standardPage(route, enRoute, title, description, label, h1, lead, image) {
  const enPath = enRoute ? `/${enRoute}/` : "/";
  const sections = route === "sample-shipping" ? [
    ["1. 提交项目信息", "提供作物、穴盘尺寸、目标国家、预计用量和当前基质。"], ["2. 选择样品", "根据尺寸和应用筛选候选型号，不在样品确认前承诺批量表现。"], ["3. 记录测试", "记录吸水方法、时间、湿态尺寸、操作、根系和包装状态。"], ["4. 确认运输", "样品通过后再讨论装箱、标签、快递、空运或海运方案。"]
  ] : route === "private-label" ? [
    ["产品先行", "先完成基质块样品和用途确认。"], ["包装打样", "再确定零售盒、补充袋、说明卡和装箱结构。"], ["声明审核", "证书、性能和使用声明必须有对应文件或项目记录支持。"], ["批量确认", "产品、包装和运输条件全部批准后再形成最终报价。"]
  ] : route === "middle-east" ? [
    ["沙特当地样品", "合格项目可协调沙特当地样品，具体型号和数量由销售确认。"], ["干热环境测试", "在项目自己的温度、湿度、灌溉和通风条件下记录结果。"], ["温室与 PFAL", "重点验证穴盘匹配、移栽操作、根区状态和灌溉响应。"], ["出口与文件", "样品通过后再确认包装、箱唛、文件和批量运输路线。"]
  ] : route === "about" ? [
    ["产品定位", "塑形椰糠与泥炭复合基质，不是普通压缩椰砖。"], ["参考产能", "网站批准的参考产能为每日 20,000 个，具体排产按项目确认。"], ["质量沟通", "合格项目可讨论 SGS 报告、批次检测和样品记录。"], ["出口协同", "支持样品、装箱、标签和出口文件沟通。"]
  ] : [
    ["商业育苗", "按穴盘、作物、灌溉和移栽方式选择型号。"], ["水培与植物工厂", "重点验证定植孔匹配、吸水和移栽操作。"], ["兰花与组培", "按苗期和容器选择不同体积及形状。"], ["贴牌项目", "产品样品通过后再开展包装和标签。"]
  ];
  return `${head(title, description, route, enPath)}<body class="cn-site">${header(enPath)}<main><section class="page-hero"><div class="container product-hero-layout"><div><span class="section-label">${label}</span><h1>${h1}</h1><p class="lead">${lead}</p><div class="hero-actions"><a class="btn btn-primary btn-large" href="/cn/contact/">申请样品</a><a class="btn btn-outline btn-large" href="/cn/products/">比较型号</a></div></div><div class="media-frame"><img src="${image}" alt="${h1}" loading="eager"></div></div></section><section class="section"><div class="container"><div class="section-head"><span>采购重点</span><h2>从项目条件开始，而不是只看产品外观</h2></div><div class="card-grid-4">${sections.map(([name, text]) => `<article><h2>${name}</h2><p>${text}</p></article>`).join("")}</div></div></section><section class="section section-soft"><div class="container split-section"><div><span class="section-label">MCCS 工厂直供</span><h2>样品验证与项目确认</h2><p>每个项目都应记录型号、样品批次、穴盘或容器、吸水方法、种植条件和验收标准。批次或项目参数不能由产品家族文案直接推定。</p><p class="cn-note">密度、AFP、WHC、EC、pH、离子水平和机械操作表现，以当前批次文件或双方确认的测试结果为准。</p></div><div class="b2b-info-card"><h2>询盘建议提供</h2><ul class="simple-list"><li>作物与育苗阶段</li><li>穴盘开口、深度或容器尺寸</li><li>当前基质和希望改善的问题</li><li>目标国家与预计月用量</li><li>样品或贴牌包装需求</li></ul></div></div></section><section class="section contact-section"><div class="container callout-card"><div><span class="section-label">下一步</span><h2>把项目条件发给 MCCS</h2><p>销售团队会根据用途和尺寸讨论合适的样品路径。</p></div><a class="btn btn-primary btn-large" href="/cn/contact/">联系销售</a></div></section></main>${footer()}</body></html>`;
}

function productsPage() {
  return `${head("MCCS 塑形基质块产品目录｜比较 30 个型号", "比较 30 个 MCCS 塑形椰糠泥炭基质块型号、尺寸、穴盘匹配、应用、装箱状态和起订量。", "products", "/products/", "CollectionPage")}<body class="cn-site page-products">${header("/products/")}<main><section class="page-hero products-hero"><div class="container product-hero-layout"><div><span class="section-label">产品目录</span><h1>塑形椰糠泥炭基质块型号</h1><p class="lead">比较 30 个型号的尺寸、穴盘或容器匹配和应用方向。新增型号的装箱数和 MOQ 需在样品及包装方案确认后确定。</p><div class="hero-actions"><a class="btn btn-primary btn-large" href="/cn/contact/">申请样品</a><a class="btn btn-outline btn-large" href="#comparison-table">比较型号</a><a class="btn btn-outline btn-large" href="/cn/products/conical-plugs/">查看技术资料</a></div></div><div class="b2b-info-card"><h2>选型提醒</h2><p><b>材料：</b>塑形椰糠与泥炭复合基质，植物纤维粘结比例可按项目讨论。</p><p><b>测试：</b>用实际穴盘和灌溉方法验证干态、湿态和移栽操作。</p><p><b>技术数据：</b>批次或项目参数需结合当前报告和测试方法确认。</p></div></div></section><section class="section product-catalog-section"><div class="container"><div class="portal-toolbar enhanced-toolbar"><input id="productFilter" type="search" aria-label="搜索型号、产品或应用" placeholder="搜索型号、产品或应用"><select id="categoryFilter"><option value="">全部类别</option></select></div><div class="app-filter-bar" aria-label="应用筛选"><button type="button" class="app-filter active" data-app="">全部产品</button><button type="button" class="app-filter" data-app="Seedling">育苗</button><button type="button" class="app-filter" data-app="Orchid">兰花</button><button type="button" class="app-filter" data-app="Tissue Culture">组培</button><button type="button" class="app-filter" data-app="Hydroponic">水培</button><button type="button" class="app-filter" data-app="Succulent">多肉</button></div><div id="productMatrix" class="matrix-grid cf-matrix enhanced-product-grid"></div></div></section><section class="section section-soft" id="comparison-table"><div class="container"><div class="section-head"><span>型号矩阵</span><h2>按尺寸、容器和应用比较</h2></div><div class="compare-table-wrap"><table class="spec-table compare-table product-compare-table"><thead><tr><th>型号</th><th>产品</th><th>尺寸</th><th>穴盘 / 容器</th><th>应用</th></tr></thead><tbody id="productCompareBody"></tbody></table></div></div></section><script src="/assets/products-cn.js"></script></main>${footer()}</body></html>`;
}

const insightCards = [
  ["水培育苗块采购指南", "从穴盘匹配、吸水、湿态操作和移栽流程比较候选基质。", "/cn/insights/hydroponic-grow-plug-guide/"],
  ["EC 与 pH 测试协议", "统一样品、提取比例、用水、仪器和记录格式后再比较结果。", "/cn/insights/substrate-plug-ec-ph-testing-protocol/"],
  ["自动移栽线测试", "把含水率、夹爪设置、掉块和放置失败分类记录。", "/cn/applications/automated-transplanter-grow-plugs/"],
  ["水培生菜与 PFAL 试验", "根据公开研究设计本地对照试验，不把论文结果当作普遍承诺。", "/cn/applications/hydroponic-lettuce-grow-plugs/"],
  ["消费者使用说明", "兰花、天南星科和蕨类植物的中文上盆与浇水说明。", "/cn/use-guide/"]
];

function insightsPage() {
  return `${head("MCCS 基质块技术与采购资料", "面向水培温室、育苗、自动移栽、兰花和贴牌采购的 MCCS 中文技术资料。", "insights", "/insights/", "CollectionPage")}<body class="cn-site">${header("/insights/")}<main><section class="page-hero"><div class="container"><span class="section-label">技术资料</span><h1>把样品测试转化为采购证据</h1><p class="lead">围绕穴盘匹配、吸水、EC/pH、移栽操作、作物试验和包装运输建立可重复的记录。</p></div></section><section class="section"><div class="container"><div class="post-grid">${insightCards.map(([title, text, href]) => `<a class="post-card" href="${href}"><b>${title}</b><p>${text}</p><span>阅读指南 →</span></a>`).join("")}</div></div></section></main>${footer()}</body></html>`;
}

function contactPage() {
  const description = "联系 MCCS 获取塑形椰糠泥炭基质块样品、选型建议、SGS 资料支持、贴牌包装和出口协同。";
  return `${head("联系 MCCS｜申请基质块样品", description, "contact", "/contact/")}<body class="cn-site page-contact">${header("/contact/")}<main><section class="page-hero"><div class="container"><span class="section-label">联系销售</span><h1>申请工厂直供报价与样品</h1><p class="lead">提供应用、穴盘、目标市场和采购计划，我们会据此讨论候选型号、样品步骤与出口协同。</p></div></section><section class="section contact-section"><div class="container contact-grid"><div><span class="section-label">MCCS</span><h2>销售信息</h2><div class="contact-info"><p><b>邮箱：</b><a href="mailto:sales@mccsgrowingmedia.com">sales@mccsgrowingmedia.com</a></p><p><b>WhatsApp / 电话：</b><a href="https://wa.me/8618922290417">+86 189 2229 0417</a></p><p><b>地址：</b>中国广东省广州市花都区</p></div><p class="cn-note">请附上作物、穴盘或容器尺寸、目标国家、预计月用量，以及需要样品或贴牌包装的信息。</p></div><form action="https://formspree.io/f/mredrnea" class="contact-form" id="quoteForm" method="POST"><h2>MCCS 样品与 OEM 询盘</h2><input aria-label="姓名" name="name" placeholder="姓名" required><input aria-label="工作邮箱" name="email" placeholder="工作邮箱" required type="email"><input aria-label="公司名称" name="company" placeholder="公司名称" required><input aria-label="WhatsApp 或电话" autocomplete="tel" inputmode="tel" name="whatsapp" placeholder="WhatsApp / 电话" required type="tel"><input aria-label="国家或市场" name="country" placeholder="国家 / 市场" required><select aria-label="业务类型" name="business_type" required><option value="">业务类型</option><option>商业温室</option><option>经销商</option><option>品牌方</option><option>农业项目</option><option>其他</option></select><select aria-label="预计月用量" name="estimated_monthly_volume" required><option value="">预计月用量</option><option>少于 5,000 个</option><option>5,000–20,000 个</option><option>超过 20,000 个</option></select><select aria-label="应用" name="application" required><option>育苗 / 苗圃</option><option>水培种植</option><option>兰花</option><option>组培</option><option>多肉 / 特色花器</option><option>贴牌零售包装</option></select><select aria-label="运输方式" name="preferred_shipping_method"><option value="">运输方式（可选）</option><option>快递样品</option><option>空运</option><option>海运</option><option>DDP / 门到门讨论</option></select><textarea aria-label="产品要求和目标市场" name="message" placeholder="请填写作物、穴盘尺寸、目标市场和其他要求" required></textarea><input name="_subject" type="hidden" value="MCCS Chinese Website Sample Request"><input autocomplete="off" class="honeypot" name="_gotcha" tabindex="-1" type="text"><button class="btn btn-primary btn-large" type="submit">提交样品申请</button></form></div></section></main>${footer()}<script src="/assets/form-protection.js" defer></script></body></html>`;
}

function articlePage(route, enPath, title, description, h1, intro, sections) {
  return `${head(title, description, route, enPath, "Article")}<body class="cn-site">${header(enPath)}<main><section class="page-hero article-hero"><div class="container"><span class="section-label">MCCS 技术指南</span><h1>${h1}</h1><p class="lead">${intro}</p></div></section><section class="section"><div class="container article-layout"><article class="article-body"><div class="article-cta"><b>使用原则</b><p>记录型号、样品批次、测试条件和方法。项目结果不能自动推广为所有批次或所有设施的性能承诺。</p></div>${sections.map(([heading, body]) => `<h2>${heading}</h2><p>${body}</p>`).join("")}<div class="article-cta"><b>下一步</b><p>提供作物、穴盘、当前流程、目标市场和预计用量，申请适合的样品。</p><a class="btn btn-primary" href="/cn/contact/">申请样品</a></div></article><aside class="article-side"><div class="instruction-card"><b>相关页面</b><a href="/cn/products/">产品目录</a><a href="/cn/sample-shipping/">样品与运输</a><a href="/cn/products/conical-plugs/">技术数据</a><a href="/cn/contact/">联系销售</a></div></aside></div></section></main>${footer()}</body></html>`;
}

const articlePages = [
  ["insights/hydroponic-grow-plug-guide", "/insights/hydroponic-grow-plug-guide/", "水培育苗块采购与测试指南｜MCCS", "从穴盘、吸水、根区操作和移栽流程评估塑形椰糠泥炭育苗块。", "水培育苗块采购与测试指南", "先定义种植系统，再比较基质块。", [["记录生产基线", "记录作物、穴盘、定植孔、营养液、灌溉、移栽时间和当前基质。"], ["检查干态与湿态匹配", "分别记录收到样品时和按约定方法吸水后的尺寸、稳定性与排水情况。"], ["进行对照试验", "保持作物、光照、营养、灌溉和记录时间一致，再比较候选基质与当前基质。"], ["连接采购决定", "把作物表现、操作、包装和文件一起纳入批量采购决定。"]]],
  ["insights/substrate-plug-ec-ph-testing-protocol", "/insights/substrate-plug-ec-ph-testing-protocol/", "基质块 EC 与 pH 测试协议｜MCCS", "统一样品、提取比例、用水、仪器和记录条件，获得可比较的基质 EC 与 pH 数据。", "基质块 EC 与 pH 测试协议", "检测方法不同，数字不能直接比较。", [["定义样品", "记录型号、批次、取样数量、干湿状态和取样位置。"], ["固定提取方法", "在记录中写明基质与水的比例、用水 EC、浸泡或振荡时间和温度。"], ["校准仪器", "按仪器要求校准 EC 与 pH 计，并记录校准液和日期。"], ["报告完整条件", "结果旁必须保留单位、方法、温度、重复次数和样品标识。"]]],
  ["applications/automated-transplanter-grow-plugs", "/applications/automated-transplanter-grow-plugs/", "自动移栽机基质块测试指南｜MCCS", "验证塑形基质块与自动移栽机、夹爪、穴盘和含水状态的兼容性。", "自动移栽机基质块测试", "机器兼容性必须通过实际产线测试确认。", [["确认几何尺寸", "记录穴盘开口、深度、锥度、排水结构和干湿态基质块尺寸。"], ["记录含水状态", "夹取表现与含水率有关，测试时必须记录吸水方法和等待时间。"], ["分阶段提高速度", "依次进行人工夹取、低速循环、目标速度和重复运行。"], ["分类记录失败", "分别记录漏抓、变形、掉块、错位和穴盘阻塞，不只记录一个总失败率。"]]],
  ["applications/hydroponic-lettuce-grow-plugs", "/applications/hydroponic-lettuce-grow-plugs/", "水培生菜与 PFAL 基质试验｜MCCS", "结合公开研究设计水培生菜和植物工厂基质块本地对照试验。", "水培生菜与 PFAL 基质试验", "公开研究用于设计测试，不替代设施自己的验证。", [["统一试验条件", "对照组和候选基质使用相同品种、播种日期、光照、营养液和记录周期。"], ["记录育苗过程", "记录出苗整齐度、吸水、表面状态、根区和移栽操作。"], ["连接灌溉数据", "把每次供水和营养液记录与作物观察放在同一时间轴。"], ["审慎使用论文", "阅读研究的具体处理和条件，不把单项结果写成所有作物和设施的保证。"]]],
  ["products/conical-plugs", "/products/conical-plugs/", "锥形塑形基质块技术资料｜MCCS", "MCCS 锥形椰糠泥炭基质块的尺寸、项目参数、穴盘匹配、文件和样品验证说明。", "锥形塑形基质块技术资料", "把已公开信息、项目规格和待验证指标明确分开。", [["物理参数", "干密度、湿密度、AFP、WHC 和水气比需按双方确认的方法和当前样品或批次测量。"], ["化学参数", "EC、pH、钠、氯和缓冲处理状态应注明提取方法、用水和样品编号。"], ["机械与操作", "吸水、夹爪、抗掉块和自动移栽表现需在买方穴盘与设备上验证。"], ["文件与追溯", "合格项目可讨论 TDS、适用 SGS 报告、批次测试和样品批准记录。"]]]
];

for (const [route, enRoute, title, description, label, h1, lead, image] of routes) {
  const target = path.join(root, "cn", route, "index.html");
  writePage(target, standardPage(route, enRoute, title, description, label, h1, lead, image));
}

const directPages = [
  ["cn/products/index.html", productsPage()],
  ["cn/insights/index.html", insightsPage()],
  ["cn/contact/index.html", contactPage()]
];

for (const [relative, content] of directPages) {
  const target = path.join(root, relative);
  writePage(target, content);
}

for (const [route, enPath, title, description, h1, intro, sections] of articlePages) {
  const target = path.join(root, "cn", route, "index.html");
  writePage(target, articlePage(route, enPath, title, description, h1, intro, sections));
}

console.log(`Generated ${routes.length + directPages.length + articlePages.length} Chinese pages.`);
