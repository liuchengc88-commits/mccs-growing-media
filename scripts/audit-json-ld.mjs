import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const productEntities = [];
const parseErrors = [];
const schemaTypeCounts = new Map();

function listHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git') return [];
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(entryPath);
    return entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

function walkJson(value, location = '$') {
  if (Array.isArray(value)) {
    return value.flatMap((child, index) => walkJson(child, `${location}[${index}]`));
  }
  if (!value || typeof value !== 'object') return [];

  const nodes = [{ value, location }];
  for (const [key, child] of Object.entries(value)) {
    nodes.push(...walkJson(child, `${location}.${key}`));
  }
  return nodes;
}

for (const filePath of listHtmlFiles(root)) {
  const relativePath = path.relative(root, filePath).replaceAll('\\', '/');
  const html = fs.readFileSync(filePath, 'utf8');
  const blocks = html.matchAll(
    /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );

  for (const [blockIndex, match] of [...blocks].entries()) {
    let data;
    try {
      data = JSON.parse(match[1].trim());
    } catch (error) {
      parseErrors.push({
        file: relativePath,
        block: blockIndex + 1,
        message: error.message
      });
      continue;
    }

    if (process.argv.includes('--graphs') && JSON.stringify(data).includes('"Product"')) {
      console.log(`GRAPH: ${relativePath} block ${blockIndex + 1}`);
      console.log(JSON.stringify(data, null, 2));
    }

    for (const node of walkJson(data)) {
      const rawTypes = node.value['@type'];
      const types = Array.isArray(rawTypes) ? rawTypes : [rawTypes];
      for (const type of types.filter(Boolean)) {
        schemaTypeCounts.set(type, (schemaTypeCounts.get(type) || 0) + 1);
      }
      if (!types.includes('Product')) continue;

      productEntities.push({
        file: relativePath,
        block: blockIndex + 1,
        location: node.location,
        name: node.value.name || '',
        node: node.value,
        offers: Object.hasOwn(node.value, 'offers'),
        review: Object.hasOwn(node.value, 'review'),
        aggregateRating: Object.hasOwn(node.value, 'aggregateRating')
      });
    }
  }
}

const invalidProducts = productEntities.filter(
  (product) => !product.offers && !product.review && !product.aggregateRating
);
const productFiles = new Set(productEntities.map((product) => product.file));

console.log(`Product entities: ${productEntities.length}`);
console.log(`Files containing Product: ${productFiles.size}`);
console.log(`Invalid Product entities: ${invalidProducts.length}`);
console.log(`JSON-LD parse errors: ${parseErrors.length}`);
console.log(
  `Schema types: ${[...schemaTypeCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([type, count]) => `${type}=${count}`)
    .join(', ')}`
);

for (const product of productEntities) {
  const supportedProperties = ['offers', 'review', 'aggregateRating'].filter(
    (property) => product[property]
  );
  console.log([
    product.file,
    `block ${product.block}`,
    product.location,
    product.name,
    supportedProperties.join(', ') || 'missing offers/review/rating'
  ].join(' | '));
  if (process.argv.includes('--pretty')) {
    console.log(JSON.stringify(product.node, null, 2));
  }
}

for (const error of parseErrors) {
  console.error(`${error.file} | block ${error.block} | ${error.message}`);
}

if (parseErrors.length || (process.argv.includes('--strict') && invalidProducts.length)) {
  process.exitCode = 1;
}
