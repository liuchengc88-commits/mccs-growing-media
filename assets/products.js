(() => {
  const grid = document.getElementById('productMatrix');
  if (!grid) return;
  const lang = grid.dataset.lang || (document.documentElement.lang.startsWith('zh') ? 'cn' : document.documentElement.lang);
  const prefix = lang === 'en' ? '/' : '/' + lang + '/';
  const search = document.getElementById('productFilter');
  const category = document.getElementById('categoryFilter');
  const filters = [...document.querySelectorAll('.app-filter')];
  const size = 6;
  let page = 0;
  let application = '';
  let products = [];
  let locale;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const nav = document.createElement('nav');
  nav.className = 'catalog-pagination';
  grid.insertAdjacentElement('afterend', nav);

  function card(product) {
    const t = locale.labels;
    const text = locale.models[product.model] || {};
    const name = text.name || product.name_en;
    const tray = text.tray || product.trayFit;
    const dimensions = text.size || product.size;
    const carton = lang === 'en' ? product.cartonQty :
      (/^\d/.test(product.cartonQty) ? product.cartonQty.split(' (')[0]
        .replaceAll('pcs / carton', lang === 'es' ? 'uds. / caja' : lang === 'ar' ? 'قطعة / كرتون' : '个 / 箱')
        .replaceAll('plugs / tray', lang === 'es' ? 'plugs / bandeja' : lang === 'ar' ? 'قالب / صينية' : '块 / 盘')
        .replaceAll('trays / carton', lang === 'es' ? 'bandejas / caja' : lang === 'ar' ? 'صينية / كرتون' : '盘 / 箱')
        .replaceAll('plugs / sheet', lang === 'es' ? 'plugs / placa' : lang === 'ar' ? 'قالب / لوح' : '块 / 片')
        .replaceAll('sheets / carton', lang === 'es' ? 'placas / caja' : lang === 'ar' ? 'لوح / كرتون' : '片 / 箱') : t.terms);
    const href = prefix + 'contact/?model=' + encodeURIComponent(product.model) + '#quoteForm';
    return '<article class="matrix-card cf-product-card" id="' + escape(product.slug) + '">' +
      '<div class="product-image-panel"><img src="/' + escape(product.image) + '" alt="' + escape(product.model + ' ' + name) + '" width="240" height="240" loading="lazy" decoding="async"></div>' +
      '<div class="matrix-body"><span>' + escape(product.model) + '</span><h2>' + escape(name) + '</h2>' +
      '<dl><dt>' + escape(t.size) + '</dt><dd>' + escape(dimensions) + '</dd><dt>' + escape(t.tray) + '</dt><dd>' + escape(tray) + '</dd></dl>' +
      '<details class="catalog-details"><summary>' + escape(t.quick) + '</summary><p>' + escape(text.description || product.description) + '</p>' +
      '<dl><dt>' + escape(t.category) + '</dt><dd>' + escape(locale.categories[product.category] || product.category) + '</dd><dt>' + escape(t.carton) + '</dt><dd>' + escape(carton) + '</dd><dt>' + escape(t.moq) + '</dt><dd>' + escape(lang === 'en' ? product.moq : t.terms) + '</dd></dl>' +
      '<p>' + escape(t.reference) + '</p><p><strong>' + escape(t.material) + ':</strong> ' + escape(t.materialText) + '</p>' +
      '<a href="' + href + '">' + escape(t.docs) + '</a><div class="mini-gallery">' +
      (product.gallery || [product.image]).slice(0,3).map(image => '<img src="/' + escape(image) + '" alt="' + escape(product.model + ' ' + name) + '" width="240" height="240" loading="lazy" decoding="async">').join('') +
      '</div></details><a class="btn btn-primary" href="' + href + '">' + escape(t.quote) + '</a></div></article>';
  }
  function matching() {
    const query = (search?.value || '').trim().toLowerCase();
    return products.filter(product => (!application || product.applicationTags.includes(application)) &&
      (!category?.value || product.category === category.value) &&
      (!query || (JSON.stringify(product) + JSON.stringify(locale.models[product.model])).toLowerCase().includes(query)));
  }
  function render(scroll = false) {
    const t = locale.labels;
    const items = matching();
    page = Math.max(0, Math.min(page, Math.ceil(items.length / size) - 1));
    grid.innerHTML = items.slice(page * size, (page + 1) * size).map(card).join('') || '<p role="status">' + escape(t.empty) + '</p>';
    nav.setAttribute('aria-label', t.page);
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.textContent = lang === 'ar' ? '\u2192' : '\u2190';
    previous.title = t.previous;
    previous.setAttribute('aria-label', t.previous);
    previous.disabled = page === 0;
    previous.addEventListener('click', () => { page--; render(true); });
    const count = document.createElement('span');
    count.setAttribute('role', 'status');
    count.textContent = t.page + ' ' + (page + 1) + ' / ' + Math.max(1, Math.ceil(items.length / size)) + ' · ' + items.length + ' ' + t.results;
    const next = document.createElement('button');
    next.type = 'button';
    next.textContent = lang === 'ar' ? '\u2190' : '\u2192';
    next.title = t.next;
    next.setAttribute('aria-label', t.next);
    next.disabled = (page + 1) * size >= items.length;
    next.addEventListener('click', () => { page++; render(true); });
    nav.replaceChildren(previous, count, next);
    if (scroll) grid.scrollIntoView({block:'start'});
  }
  async function start() {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error('Catalog unavailable');
    products = await response.json();
    const copyResponse = await fetch('/data/catalog-locales.json');
    if (!copyResponse.ok) throw new Error('Translations unavailable');
    const allCopy = await copyResponse.json();
    locale = allCopy[lang] || allCopy.en;
    if (category) {
      category.replaceChildren(new Option(locale.labels.all, ''));
      [...new Set(products.map(product => product.category))].forEach(value => category.add(new Option(locale.categories[value] || value, value)));
    }
    const compare = document.querySelector('.compare-table-wrap');
    if (compare) {
      const details = document.createElement('details');
      details.className = 'catalog-comparison';
      const summary = document.createElement('summary');
      summary.textContent = locale.labels.comparison + ' (' + products.length + ')';
      compare.before(details);
      details.append(summary, compare);
      if (location.hash === '#comparison-table') details.open = true;
      document.addEventListener('click', event => {
        if (event.target.closest('a[href$="#comparison-table"]')) details.open = true;
      });
    }
    filters.forEach(button => button.addEventListener('click', () => {
      application = button.dataset.app || '';
      filters.forEach(other => other.classList.toggle('active', other === button));
      page = 0; render();
    }));
    search?.addEventListener('input', () => { page = 0; render(); });
    category?.addEventListener('change', () => { page = 0; render(); });
    function revealHash() {
      const index = products.findIndex(product => '#' + product.slug === location.hash);
      if (index < 0) return;
      application = '';
      filters.forEach(button => button.classList.toggle('active', !button.dataset.app));
      if (search) search.value = '';
      if (category) category.value = '';
      page = Math.floor(index / size);
      render();
      document.getElementById(products[index].slug)?.scrollIntoView({block:'start'});
    }
    render();
    revealHash();
    if (location.hash === '#comparison-table') document.getElementById('comparison-table')?.scrollIntoView({block:'start'});
    window.addEventListener('hashchange', revealHash);
  }
  start().catch(() => {
    nav.hidden = true;
    grid.textContent = ({en:'Catalog could not load. Use the complete specification table below or contact sales.',es:'No se pudo cargar el catálogo. Consulte la tabla completa o contacte con ventas.',ar:'تعذر تحميل الكتالوج. راجع جدول المواصفات أدناه أو تواصل مع المبيعات.',cn:'目录暂时无法加载，请查看下方规格表或联系销售。'})[lang] || 'Catalog unavailable.';
  });
})();
