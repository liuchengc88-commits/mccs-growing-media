import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skippedFiles = new Set(['admin.html', 'privacy.html', 'terms.html']);
const legalName = 'Guangzhou Chengfeng Trading Co., Ltd.';
const organizationId = 'https://www.mccsgrowingmedia.com/#organization';
const description = 'MCCS Growing Media is an export-facing B2B brand operated by Guangzhou Chengfeng Trading Co., Ltd. for projects supplied through an authorized manufacturing partner in Guangzhou, China.';
const organizationEnhancements = {
  logo: 'https://www.mccsgrowingmedia.com/assets/favicon.svg',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'B2B sales and sample coordination',
    email: 'sales@mccsgrowingmedia.com',
    telephone: '+86 189 2229 0417',
    availableLanguage: ['English', 'Chinese']
  },
  areaServed: [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'Saudi Arabia' },
    { '@type': 'Country', name: 'United Arab Emirates' }
  ],
  knowsAbout: [
    'Molded coconut coir and peat substrate plugs',
    'Commercial greenhouse propagation',
    'Hydroponic grow plugs',
    'Tray-fit and sample evaluation',
    'Private-label growing media packaging',
    'B2B export coordination'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    '@id': 'https://www.mccsgrowingmedia.com/products/#model-list',
    name: 'MCCS ZY Series molded substrate model catalog',
    url: 'https://www.mccsgrowingmedia.com/products/'
  }
};

function listHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git') return [];
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(entryPath);
    return entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

let changed = 0;
for (const filePath of listHtmlFiles(root)) {
  if (skippedFiles.has(path.basename(filePath))) continue;
  const source = fs.readFileSync(filePath, 'utf8');
  const updated = source.replace(
    /(<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (block, open, rawJson, close) => {
      let data;
      try {
        data = JSON.parse(rawJson.trim());
      } catch {
        return block;
      }

      let blockChanged = false;
      function visit(value) {
        if (Array.isArray(value)) {
          value.forEach(visit);
          return;
        }
        if (!value || typeof value !== 'object') return;
        const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
        if (types.includes('Organization') && value.name === 'MCCS Growing Media') {
          const isFullOrganization = Boolean(value.email || value.telephone || value.address);
          if (value.legalName !== legalName) {
            value.legalName = legalName;
            blockChanged = true;
          }
          if (value.description !== description) {
            value.description = description;
            blockChanged = true;
          }
          if (value.address?.streetAddress === 'Huadu District') {
            delete value.address.streetAddress;
            delete value.address.postalCode;
            blockChanged = true;
          }
          if (isFullOrganization && value['@id'] !== organizationId) {
            value['@id'] = organizationId;
            blockChanged = true;
          }
          if (isFullOrganization) {
            for (const [key, enhancement] of Object.entries(organizationEnhancements)) {
              if (JSON.stringify(value[key]) !== JSON.stringify(enhancement)) {
                value[key] = enhancement;
                blockChanged = true;
              }
            }
          }
        }
        Object.values(value).forEach(visit);
      }
      visit(data);
      return blockChanged ? `${open}${JSON.stringify(data)}${close}` : block;
    }
  );
  if (updated === source) continue;
  fs.writeFileSync(filePath, updated, 'utf8');
  changed += 1;
}

console.log(`Synchronized public Organization identity in ${changed} HTML files.`);
