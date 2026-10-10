const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('assets/form-protection.js', 'utf8');
const keyDeclaration = /const turnstileSiteKey = '([^']*)';/;
const configuredKey = source.match(keyDeclaration)?.[1];
assert.notEqual(configuredKey, undefined, 'Keep one shared public Turnstile site key.');
if (process.argv.includes('--require-turnstile')) {
  assert.ok(configuredKey.length >= 20 && !/^[123]x0+/.test(configuredKey),
    'Production rollout requires a real public Turnstile site key, not a blank or testing key.');
}

function element(tag = 'div', value = '') {
  return {
    tag, value, attrs: {}, children: [], listeners: {}, clientWidth: 400,
    hidden: false, textContent: '',
    setAttribute(name, nextValue) { this.attrs[name] = nextValue; },
    getAttribute(name) { return this.attrs[name] ?? null; },
    removeAttribute(name) { delete this.attrs[name]; },
    addEventListener(type, handler) { this.listeners[type] = handler; },
    append(...children) { this.children.push(...children); },
    focus() {}, scrollIntoView() {}, remove() { this.removed = true; }
  };
}

function createHarness({
  lang = 'en', responseStatus = 200, responseBody = {}, siteKey = '',
  company = 'Acme Greenhouse', whatsapp = '+1 555 123 4567',
  message = 'We need propagation plugs for a commercial greenhouse trial.',
  fetchImpl, widgetWidth = 400, renderThrows = false, resetThrows = false
} = {}) {
  const fields = {
    honeypot: element('input', ''), whatsapp: element('input', whatsapp),
    company: element('input', company), message: element('textarea', message)
  };
  const button = element('button');
  button.textContent = 'Request Sample';
  button.disabled = false;
  const harness = {
    fields, button, fetchCalls: [], gtagCalls: [], status: null,
    scripts: [], panels: [], renderCalls: [], resetCalls: [], removedWidgets: [],
    windowHandlers: {}, time: 1000, timers: new Map()
  };
  let timerId = 0;
  const heading = {
    insertAdjacentElement(_position, nextElement) { harness.status = nextElement; }
  };
  const form = {
    action: 'https://example.invalid/form', method: 'POST', resetCount: 0,
    elements: {
      namedItem(name) { return name === '_gotcha' ? fields.honeypot : fields[name] || null; }
    },
    querySelector(selector) {
      return { 'button[type="submit"]': button, h2: heading }[selector] || null;
    },
    insertBefore(panel) { harness.panels.push(panel); },
    addEventListener(type, handler) {
      if (type === 'submit') harness.submitHandler = handler;
    },
    reset() { this.resetCount += 1; }
  };
  harness.form = form;
  const window = {
    addEventListener(type, handler) { harness.windowHandlers[type] = handler; },
    gtag(...args) { harness.gtagCalls.push(args); },
    setTimeout(callback) { harness.timers.set(++timerId, callback); return timerId; },
    clearTimeout(id) { harness.timers.delete(id); }
  };
  const context = {
    document: {
      documentElement: { lang },
      head: { appendChild(script) { harness.scripts.push(script); } },
      getElementById(id) { return id === 'quoteForm' ? form : null; },
      createElement(tag) {
        const node = element(tag);
        node.clientWidth = widgetWidth;
        return node;
      }
    },
    window,
    Date: { now: () => harness.time },
    FormData: class {
      constructor(target) { this.form = target; this.values = new Map(); }
      set(name, value) { this.values.set(name, value); }
      get(name) { return this.values.get(name); }
    },
    fetch: async (...args) => {
      harness.fetchCalls.push(args);
      if (fetchImpl) return fetchImpl(...args);
      return {
        ok: responseStatus >= 200 && responseStatus < 300, status: responseStatus,
        json: async () => responseBody
      };
    },
    console
  };
  vm.runInNewContext(source.replace(keyDeclaration, `const turnstileSiteKey = '${siteKey}';`), context);
  harness.submit = () => harness.submitHandler({ preventDefault() {} });
  harness.finishLoading = () => {
    window.turnstile = {
      render(container, options) {
        if (renderThrows) throw new Error('render failed');
        harness.renderCalls.push({ container, options });
        harness.widgetOptions = options;
        return 'widget-1';
      },
      reset(id) {
        if (resetThrows) throw new Error('reset failed');
        harness.resetCalls.push(id);
      },
      remove(id) { harness.removedWidgets.push(id); }
    };
    window.mccsTurnstileReady();
  };
  harness.verify = (token = 'mock-token') => harness.widgetOptions.callback(token);
  harness.retry = () => harness.panels[0].children[2].listeners.click();
  return harness;
}

const protectedForm = (options = {}) => createHarness({ siteKey: 'public-unit-test-key', ...options });

(async () => {
  const success = createHarness();
  await success.submit();
  assert.equal(success.fetchCalls.length, 1);
  assert.equal(success.gtagCalls[0][1], 'generate_lead');
  const eventParameters = success.gtagCalls[0][2];
  for (const pii of ['email', 'whatsapp', 'company', 'cf-turnstile-response']) {
    assert.ok(!(pii in eventParameters), 'Do not include contact details or verification tokens in analytics.');
  }
  assert.equal(success.form.resetCount, 1);
  assert.ok(success.status.className.includes('form-success'));
  assert.equal(success.button.disabled, false);
  assert.equal(success.scripts.length, 0, 'No third-party script before a real key is configured.');

  const rateLimited = createHarness({ lang: 'es', responseStatus: 429 });
  await rateLimited.submit();
  assert.equal(rateLimited.gtagCalls.length, 0);
  assert.equal(rateLimited.form.resetCount, 0);
  assert.ok(rateLimited.status.textContent.includes('demasiadas'));
  assert.equal(rateLimited.button.disabled, false);

  for (const options of [{ company: 'google' }, { whatsapp: 'Costa Rica' }, { message: 'short' },
    { message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }]) {
    const invalid = createHarness(options);
    await invalid.submit();
    assert.equal(invalid.fetchCalls.length, 0, 'Invalid fields must not submit.');
  }
  const optionalFields = createHarness({ whatsapp: '', company: '' });
  await optionalFields.submit();
  assert.equal(optionalFields.fetchCalls.length, 1);
  const spam = createHarness();
  spam.fields.honeypot.value = 'spam';
  await spam.submit();
  assert.equal(spam.fetchCalls.length, 0);
  const chinese = createHarness({ lang: 'zh-CN',
    message: '我们需要为温室苗圃采购用于扦插育苗的基质块希望先安排样品测试并确认穴盘尺寸以及运往中国广东的运输费用' });
  await chinese.submit();
  assert.equal(chinese.fetchCalls.length, 1, 'Do not flag an unspaced Chinese inquiry as gibberish.');

  const waiting = protectedForm();
  assert.equal(waiting.button.disabled, true);
  assert.equal(waiting.scripts.length, 1);
  assert.ok(waiting.scripts[0].src.startsWith('https://challenges.cloudflare.com/turnstile/v0/api.js?'));
  await waiting.submit();
  assert.equal(waiting.fetchCalls.length, 0, 'No request while verification is missing.');
  waiting.finishLoading();
  assert.equal(waiting.timers.size, 0);
  assert.equal(waiting.widgetOptions['response-field'], false);
  waiting.verify();
  assert.equal(waiting.button.disabled, false);
  await waiting.submit();
  assert.equal(waiting.fetchCalls[0][1].body.get('cf-turnstile-response'), 'mock-token');
  assert.equal(waiting.gtagCalls.length, 1);
  assert.equal(waiting.resetCalls.length, 1);
  assert.equal(waiting.button.disabled, true, 'Require a new token after every POST.');
  await waiting.submit();
  assert.equal(waiting.fetchCalls.length, 1, 'Do not reuse a consumed token.');

  for (const lang of ['en', 'es', 'ar', 'zh-CN']) {
    const localized = protectedForm({ lang });
    localized.finishLoading();
    assert.equal(localized.widgetOptions.language, lang);
    for (const callback of ['expired-callback', 'timeout-callback', 'error-callback']) {
      localized.verify();
      localized.widgetOptions[callback]();
      assert.equal(localized.button.disabled, true);
      await localized.submit();
      assert.equal(localized.fetchCalls.length, 0);
      assert.equal(localized.fields.message.value.includes('propagation'), true);
    }
  }

  const expired = protectedForm();
  expired.finishLoading();
  expired.verify();
  expired.time += 300000;
  await expired.submit();
  assert.equal(expired.fetchCalls.length, 0, 'Reject stale tokens even if an expiry callback was missed.');

  const brokenScript = protectedForm();
  brokenScript.scripts[0].onerror();
  assert.ok(brokenScript.panels[0].children[1].textContent.includes('could not load'));
  assert.equal(brokenScript.panels[0].children[2].hidden, false);
  brokenScript.retry();
  assert.equal(brokenScript.scripts.length, 2);
  brokenScript.scripts[0].onerror();
  assert.ok(brokenScript.panels[0].children[1].textContent.includes('Verifying'), 'Ignore stale script errors.');
  brokenScript.finishLoading();
  brokenScript.verify();
  assert.equal(brokenScript.button.disabled, false);

  const timedOut = protectedForm();
  [...timedOut.timers.values()][0]();
  assert.equal(timedOut.panels[0].children[2].hidden, false);
  assert.equal(timedOut.button.disabled, true);
  const renderFailure = protectedForm({ renderThrows: true });
  renderFailure.finishLoading();
  assert.equal(renderFailure.button.disabled, true);
  assert.equal(renderFailure.panels[0].children[2].hidden, false);

  for (const responseStatus of [400, 429, 500]) {
    const rejected = protectedForm({ lang: 'zh-CN', responseStatus,
      responseBody: { errors: [{ field: 'cf-turnstile-response', code: 'CAPTCHA_FAILED' }] } });
    rejected.finishLoading();
    rejected.verify();
    await rejected.submit();
    assert.equal(rejected.form.resetCount, 0);
    assert.equal(rejected.gtagCalls.length, 0);
    assert.equal(rejected.resetCalls.length, 1);
    assert.equal(rejected.button.disabled, true);
    assert.ok(rejected.status.textContent.includes(responseStatus === 429 ? '次数过多' : '验证未通过'));
    rejected.verify('fresh-token');
    assert.equal(rejected.button.disabled, false);
  }

  const networkFailure = protectedForm({ fetchImpl: async () => { throw new Error('offline'); } });
  networkFailure.finishLoading();
  networkFailure.verify();
  await networkFailure.submit();
  assert.equal(networkFailure.resetCalls.length, 1);
  assert.equal(networkFailure.form.resetCount, 0);
  assert.equal(networkFailure.gtagCalls.length, 0);
  const resetFailure = protectedForm({ resetThrows: true });
  resetFailure.finishLoading();
  resetFailure.verify();
  await resetFailure.submit();
  assert.equal(resetFailure.button.disabled, true);
  assert.equal(resetFailure.panels[0].children[2].hidden, false);

  let resolvePost;
  const inFlight = protectedForm({ fetchImpl: () => new Promise((resolve) => { resolvePost = resolve; }) });
  inFlight.finishLoading();
  inFlight.verify();
  const post = inFlight.submit();
  inFlight.verify('another-token');
  await inFlight.submit();
  assert.equal(inFlight.button.disabled, true);
  assert.equal(inFlight.fetchCalls.length, 1, 'Do not double-submit during verification callbacks.');
  resolvePost({ ok: true, status: 200 });
  await post;

  const compact = protectedForm({ widgetWidth: 270 });
  compact.finishLoading();
  assert.equal(compact.widgetOptions.size, 'compact');
  compact.verify();
  compact.panels[0].children[0].clientWidth = 400;
  compact.windowHandlers.resize();
  assert.equal(compact.widgetOptions.size, 'flexible');
  assert.equal(compact.removedWidgets.length, 1);
  assert.equal(compact.button.disabled, true, 'Require fresh verification when changing widget size.');
  compact.verify();
  compact.windowHandlers.resize();
  assert.equal(compact.button.disabled, false, 'Do not reset a token on a resize within the same size class.');
  for (const file of ['contact/index.html', 'cn/contact/index.html', 'es/contact/index.html', 'ar/contact/index.html']) {
    const html = fs.readFileSync(file, 'utf8');
    assert.equal((html.match(/id="quoteForm"/g) || []).length, 1);
    assert.match(html, /action="https:\/\/formspree\.io\/f\/mredrnea"/);
    assert.match(html, /script src="\/assets\/form-protection\.js(?:\?[^" ]*)?" defer/);
  }
  console.log('PASS: form validation, four-language Turnstile lifecycle, token retry, lead tracking and protected endpoints');
  console.log(configuredKey ? 'Turnstile public key configured; verify Formspree server settings separately.' :
    'Turnstile inactive: real public key and Formspree server configuration still required before rollout.');
})().catch((error) => { console.error(error); process.exit(1); });
