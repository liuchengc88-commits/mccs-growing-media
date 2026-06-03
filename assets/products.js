async function loadProducts() {
  const grid = document.getElementById('productMatrix');
  const categoryFilter = document.getElementById('categoryFilter');
  const productFilter = document.getElementById('productFilter');
  const appButtons = [...document.querySelectorAll('.app-filter')];
  const compareBody = document.getElementById('productCompareBody');
  if (!grid) return;

  let products = [];
  let currentApp = '';
  try {
    const res = await fetch('/data/products.json', { cache: 'no-store' });
    products = await res.json();
  } catch (e) {
    grid.innerHTML = '<p>Unable to load products.json. Please check /data/products.json.</p>';
    return;
  }

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  function productCard(p) {
    const tags = (p.applicationTags || []).map(t => `<span>${t}</span>`).join('');
    const status = p.status ? `<em class="product-status">${p.status}</em>` : '';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${p.model || ''} ${p.name_en || p.name || ''}`.trim(),
      image: `https://www.mccsgrowingmedia.com/${p.image}`,
      description: p.description || '',
      brand: { '@type': 'Brand', name: 'MCCS Growing Media' },
      sku: p.model || p.slug || '',
      category: p.category || '',
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Size', value: p.size || '' },
        { '@type': 'PropertyValue', name: 'Tray Fit', value: p.trayFit || p.trayFitCn || '' },
        { '@type': 'PropertyValue', name: 'Material', value: p.material || '' },
        { '@type': 'PropertyValue', name: 'Reference Carton Qty', value: p.cartonQty || '' },
        { '@type': 'PropertyValue', name: 'MOQ', value: p.moq || '' }
      ]
    };
    return `
      <article class="matrix-card cf-product-card" itemscope itemtype="https://schema.org/Product">
        <div class="product-image-panel">
          ${status}
          <img src="/${p.image}" alt="${p.model || ''} ${p.name_en || p.name} molded substrate plug for ${p.bestFor || p.category || 'propagation'}" loading="lazy" itemprop="image" onerror="this.style.display='none'">
        </div>
        <div class="matrix-body">
          <span>${p.model || p.category || 'Product'}</span>
          <h2 itemprop="name">${p.name_en || p.name}</h2>
          ${p.name_cn ? `<p class="cn-name">${p.name_cn}</p>` : ''}
          <p itemprop="description">${p.description || ''}</p>
          <div class="tag-row">${tags}</div>
          <dl>
            <dt>Category</dt><dd>${p.category || '-'}</dd>
            <dt>Size</dt><dd>${p.size || '-'}</dd>
            <dt>Tray Fit</dt><dd>${p.trayFit || p.trayFitCn || '-'}</dd>
            <dt>Best For</dt><dd>${p.bestFor || '-'}</dd>
            <dt>Carton Qty</dt><dd>${p.cartonQty || '-'}</dd>
            <dt>MOQ</dt><dd>${p.moq || '-'}</dd>
          </dl>
          <button class="quick-view" type="button" aria-expanded="false">Quick View</button>
          <div class="quick-view-panel" hidden>
            <b>More details</b>
            <ul class="quick-list">
              <li><strong>Material:</strong> ${p.material || 'Coco coir / peat moss / plant-fiber molded blend'}</li>
              <li><strong>Packaging:</strong> ${p.packaging || 'Bulk carton / retail box / private-label pack'}</li>
              <li><strong>Reference carton quantity:</strong> ${p.cartonQty || 'To be confirmed'}</li>
              <li><strong>MOQ:</strong> ${p.moq || 'Sample order available; bulk MOQ by project'}</li>
              <li><strong>Document support:</strong> ${(p.certifications || []).join(' / ')}</li>
            </ul>
            <div class="mini-gallery">
              ${(p.gallery || [p.image]).slice(0,3).map((img,i)=>`<img src="/${img}" alt="${p.model || ''} ${p.name_en || p.name} ${i===0?'product image':i===1?'application or package reference':'packaging reference'}" loading="lazy">`).join('')}
            </div>
          </div>
          <a class="btn btn-primary" href="/contact/">Request Quote & Sample</a>
          <script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\u003c')}</script>
        </div>
      </article>
    `;
  }

  function renderCompare(items) {
    if (!compareBody) return;
    compareBody.innerHTML = items.map(p => `
      <tr>
        <td><strong>${p.model || '-'}</strong></td>
        <td>${p.name_en || p.name || '-'}<br><small>${p.name_cn || ''}</small></td>
        <td>${p.size || '-'}</td>
        <td>${p.trayFit || p.trayFitCn || '-'}</td>
        <td>${(p.applicationTags || []).join(' / ') || p.bestFor || '-'}</td>
      </tr>
    `).join('');
  }

  function filteredProducts() {
    const q = (productFilter.value || '').toLowerCase();
    const cat = categoryFilter.value;
    return products.filter(p => {
      const text = JSON.stringify(p).toLowerCase();
      const appOk = !currentApp || (p.applicationTags || []).includes(currentApp);
      return appOk && (!cat || p.category === cat) && (!q || text.includes(q));
    });
  }

  function bindQuickView() {
    grid.querySelectorAll('.quick-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        const opened = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!opened));
        btn.textContent = opened ? 'Quick View' : 'Hide Details';
        panel.hidden = opened;
      });
    });
  }

  function render() {
    const filtered = filteredProducts();
    grid.innerHTML = filtered.map(productCard).join('') || '<p>No matching products found.</p>';
    renderCompare(filtered);
    bindQuickView();
  }

  appButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentApp = btn.dataset.app || '';
      appButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  productFilter?.addEventListener('input', render);
  categoryFilter?.addEventListener('change', render);
  render();
}
loadProducts();