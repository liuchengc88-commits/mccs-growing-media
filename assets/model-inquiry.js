(() => {
  const form = document.getElementById('quoteForm');
  const message = form?.querySelector('textarea[name="message"]');
  if (!message) return;
  const lang = document.documentElement.lang.split('-')[0];
  const label = ({en:'Product model (optional)',es:'Modelo de producto (opcional)',ar:'طراز المنتج (اختياري)',zh:'产品型号（选填）'})[lang] || 'Product model (optional)';
  const select = document.createElement('select');
  select.name = 'product_model';
  select.setAttribute('aria-label', label);
  select.add(new Option(label, ''));
  message.before(select);
  fetch('/data/products.json').then(response => {
    if (!response.ok) throw new Error('Models unavailable');
    return response.json();
  }).then(products => {
    products.forEach(product => select.add(new Option(product.model, product.model)));
    const requested = new URLSearchParams(location.search).get('model');
    if (products.some(product => product.model === requested)) select.value = requested;
  }).catch(() => select.remove());
})();
