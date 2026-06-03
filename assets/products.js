
async function loadProducts() {
  const grid = document.getElementById('productMatrix');
  const categoryFilter = document.getElementById('categoryFilter');
  const productFilter = document.getElementById('productFilter');
  if (!grid) return;
  let products = [];
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

  function render() {
    const q = (productFilter.value || '').toLowerCase();
    const cat = categoryFilter.value;
    const filtered = products.filter(p => {
      const text = JSON.stringify(p).toLowerCase();
      return (!cat || p.category === cat) && (!q || text.includes(q));
    });
    grid.innerHTML = filtered.map(p => `
      <article class="matrix-card cf-product-card">
        <img src="/${p.image}" alt="${p.model || ''} ${p.name_en || p.name}" loading="lazy" onerror="this.style.display='none'">
        <div class="matrix-body">
          <span>${p.model || p.category || 'Product'}</span>
          <h2>${p.name_en || p.name}</h2>
          ${p.name_cn ? `<p class="cn-name">${p.name_cn}</p>` : ''}
          <p>${p.description || ''}</p>
          <dl>
            <dt>Category</dt><dd>${p.category || '-'}</dd>
            <dt>Wet Size</dt><dd>${p.hydratedSize || '-'}</dd>
            <dt>Dry Size</dt><dd>${p.drySize || '-'}</dd>
            <dt>Tray Fit</dt><dd>${p.trayFit || p.trayFitCn || '-'}</dd>
            <dt>Best For</dt><dd>${p.bestFor || '-'}</dd>
          </dl>
          <ul>${(p.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
          <a class="btn btn-primary" href="/#contact">Request Quote & Sample</a>
        </div>
      </article>
    `).join('');
  }

  productFilter.addEventListener('input', render);
  categoryFilter.addEventListener('change', render);
  render();
}
loadProducts();
