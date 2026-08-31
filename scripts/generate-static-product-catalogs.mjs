import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const products = JSON.parse(fs.readFileSync(path.join(root, 'data/products.json'), 'utf8'));
const chineseSource = fs.readFileSync(path.join(root, 'assets/products-cn.js'), 'utf8');
const chineseMatch = chineseSource.match(/const productCn = (\{[\s\S]*?\n\});/);
const chineseNames = chineseMatch ? JSON.parse(chineseMatch[1]) : {};

const pages = [
  { file: 'products/index.html', language: 'en', originPath: '/products/' },
  { file: 'cn/products/index.html', language: 'zh-CN', originPath: '/cn/products/' },
  { file: 'es/products/index.html', language: 'es', originPath: '/es/products/' },
  { file: 'ar/products/index.html', language: 'ar', originPath: '/ar/products/' }
];

const translations = {
  en: { unavailable: 'Confirm by sample and current project documents' },
  'zh-CN': { unavailable: '以样品和当前项目资料为准' },
  es: { unavailable: 'Confirmar con muestra y documentos actuales del proyecto' },
  ar: { unavailable: 'يُؤكد بالعينة ووثائق المشروع الحالية' }
};

const evidenceAnchors = [
  {
    '@type': 'ScholarlyArticle',
    name: 'From Coconut Waste to Circular Plant Factories with Artificial Light',
    identifier: 'https://doi.org/10.3390/agronomy15081929',
    url: 'https://doi.org/10.3390/agronomy15081929',
    description: 'MCCS material-system research under the stated lettuce and pak choi PFAL test conditions; not a model-by-model performance guarantee.'
  },
  {
    '@type': 'ScholarlyArticle',
    name: 'Physico-chemical and chemical properties of coconut coir dusts for use as a peat substitute',
    identifier: 'https://doi.org/10.1016/S0960-8524(01)00189-4',
    url: 'https://doi.org/10.1016/S0960-8524(01)00189-4',
    description: 'External research documenting variability in coir physical and chemical properties and the need for source- and batch-specific verification.'
  },
  {
    '@type': 'ScholarlyArticle',
    name: 'Achieving environmentally sustainable growing media for soilless plant cultivation systems',
    identifier: 'https://doi.org/10.1016/j.scienta.2016.09.030',
    url: 'https://doi.org/10.1016/j.scienta.2016.09.030',
    description: 'External review covering growing-media selection, characterization and practical validation for soilless cultivation.'
  }
];

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
}

function productName(product, language) {
  if (language === 'zh-CN') return chineseNames[product.model]?.[0] || product.name_en;
  return product.name_en;
}

function applications(product, language) {
  const labels = {
    'zh-CN': {
      Seedling: '育苗', Orchid: '兰花', 'Tissue Culture': '组培', Hydroponic: '水培',
      Succulent: '多肉', 'Staghorn Fern': '鹿角蕨', Epiphyte: '附生植物', Cuttings: '扦插'
    },
    es: {
      Seedling: 'Plántulas', Orchid: 'Orquídeas', 'Tissue Culture': 'Cultivo de tejidos',
      Hydroponic: 'Hidroponía', Succulent: 'Suculentas', 'Staghorn Fern': 'Helecho cuerno de alce',
      Epiphyte: 'Epífitas', Cuttings: 'Esquejes'
    },
    ar: {
      Seedling: 'الشتلات', Orchid: 'الأوركيد', 'Tissue Culture': 'زراعة الأنسجة',
      Hydroponic: 'الزراعة المائية', Succulent: 'العصاريات', 'Staghorn Fern': 'سرخس قرن الأيل',
      Epiphyte: 'النباتات الهوائية', Cuttings: 'العُقل'
    }
  };
  return (product.applicationTags || [])
    .map((tag) => labels[language]?.[tag] || tag)
    .join(' / ');
}

function rows(language) {
  return products.map((product) => {
    const cells = [
      `<strong>${escapeHtml(product.model)}</strong>`,
      escapeHtml(productName(product, language)),
      escapeHtml(product.size || '-'),
      escapeHtml(product.trayFit || translations[language].unavailable),
      escapeHtml(applications(product, language) || '-')
    ];
    if (language === 'en') {
      cells.push('Batch/project specific; request current evidence.');
      cells.push(`${escapeHtml(product.cartonQty || '-')}<br><small>${escapeHtml(product.moq || '-')}</small>`);
    }
    return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join('')}</tr>`;
  }).join('');
}

function itemList(language, originPath) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `https://www.mccsgrowingmedia.com${originPath}#model-list`,
    name: language === 'zh-CN' ? 'MCCS CF 系列产品型号目录' : 'MCCS CF Series model catalog',
    numberOfItems: products.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: products.map((product, index) => {
      const url = `https://www.mccsgrowingmedia.com${originPath}#${product.slug}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: `${product.model} ${productName(product, language)}`,
        description: `${product.size}. ${applications(product, language)}.`,
        url,
        item: {
          '@type': 'Product',
          '@id': `${url}-product`,
          name: `${product.model} ${productName(product, language)}`,
          sku: product.model,
          mpn: product.model,
          url,
          image: `https://www.mccsgrowingmedia.com/${product.image}`,
          description: product.description || product.desc,
          category: product.category,
          material: product.material,
          brand: { '@id': 'https://www.mccsgrowingmedia.com/#brand' },
          audience: {
            '@type': 'BusinessAudience',
            audienceType: 'Commercial greenhouse, nursery, hydroponic, distributor and private-label buyers'
          },
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'Model', value: product.model },
            { '@type': 'PropertyValue', name: 'Dimensions', value: product.size },
            { '@type': 'PropertyValue', name: 'Tray or holder fit', value: product.trayFit },
            { '@type': 'PropertyValue', name: 'Recommended application', value: product.bestFor },
            { '@type': 'PropertyValue', name: 'Packaging options', value: product.packaging },
            { '@type': 'PropertyValue', name: 'Carton quantity status', value: product.cartonQty },
            { '@type': 'PropertyValue', name: 'MOQ status', value: product.moq },
            { '@type': 'PropertyValue', name: 'Evidence status', value: 'Current SGS/MSDS scope and batch or project evidence must be confirmed during qualified buyer review.' }
          ],
          subjectOf: evidenceAnchors
        }
      };
    })
  };
}

for (const page of pages) {
  const filePath = path.join(root, page.file);
  let html = fs.readFileSync(filePath, 'utf8');
  const schema = JSON.stringify(itemList(page.language, page.originPath));
  const schemaStart = '<!-- GENERATED PRODUCT ITEMLIST START -->';
  const schemaEnd = '<!-- GENERATED PRODUCT ITEMLIST END -->';
  const schemaBlock = `${schemaStart}<script type="application/ld+json">${schema}</script>${schemaEnd}`;
  const schemaPattern = new RegExp(`${schemaStart}[\\s\\S]*?${schemaEnd}`);
  html = schemaPattern.test(html)
    ? html.replace(schemaPattern, schemaBlock)
    : html.replace('</head>', `${schemaBlock}</head>`);

  const rowStart = '<!-- GENERATED PRODUCT ROWS START -->';
  const rowEnd = '<!-- GENERATED PRODUCT ROWS END -->';
  const rowBlock = `${rowStart}${rows(page.language)}${rowEnd}`;
  const rowPattern = new RegExp(`${rowStart}[\\s\\S]*?${rowEnd}`);
  html = rowPattern.test(html)
    ? html.replace(rowPattern, rowBlock)
    : html.replace(
      '<tbody id="productCompareBody"></tbody>',
      `<tbody id="productCompareBody">${rowBlock}</tbody>`
    );

  if (!html.includes(schemaBlock) || !html.includes(rowBlock)) {
    throw new Error(`Could not generate catalog markup in ${page.file}`);
  }
  fs.writeFileSync(filePath, html, 'utf8');
}

console.log(`Generated static catalog rows and ItemList schema for ${pages.length} pages (${products.length} models).`);
