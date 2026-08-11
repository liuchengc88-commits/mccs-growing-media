const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('assets/form-protection.js', 'utf8');

function field(value = '') {
  return {
    value,
    attrs: {},
    setAttribute(name, nextValue) {
      this.attrs[name] = nextValue;
    },
    removeAttribute(name) {
      delete this.attrs[name];
    },
    focus() {},
    scrollIntoView() {},
    addEventListener() {}
  };
}

function createHarness({
  lang = 'en',
  responseStatus = 200,
  company = 'Acme Greenhouse',
  whatsapp = '+1 555 123 4567',
  message = 'We need propagation plugs for a commercial greenhouse trial.'
} = {}) {
  const fields = {
    honeypot: field(''),
    whatsapp: field(whatsapp),
    company: field(company),
    message: field(message)
  };
  const button = {
    textContent: 'Request Sample',
    disabled: false,
    attrs: {},
    setAttribute(name, value) {
      this.attrs[name] = value;
    }
  };
  const harness = {
    fields,
    button,
    fetchCalls: [],
    gtagCalls: [],
    status: null,
    submitHandler: null
  };
  const heading = {
    insertAdjacentElement(_position, element) {
      harness.status = element;
    }
  };
  const form = {
    action: 'https://formspree.io/f/protected',
    method: 'POST',
    resetCount: 0,
    elements: {
      namedItem(name) {
        return fields[name] || null;
      }
    },
    querySelector(selector) {
      const selectors = {
        'input[name="_gotcha"]': fields.honeypot,
        'input[name="whatsapp"]': fields.whatsapp,
        'input[name="company"]': fields.company,
        'textarea[name="message"]': fields.message,
        'button[type="submit"]': button,
        h2: heading
      };
      return selectors[selector] || null;
    },
    addEventListener(type, handler) {
      if (type === 'submit') harness.submitHandler = handler;
    },
    reset() {
      this.resetCount += 1;
    }
  };
  harness.form = form;

  const context = {
    document: {
      documentElement: { lang },
      getElementById(id) {
        return id === 'quoteForm' ? form : null;
      },
      createElement() {
        return {
          className: '',
          textContent: '',
          hidden: true,
          attrs: {},
          setAttribute(name, value) {
            this.attrs[name] = value;
          },
          focus() {},
          scrollIntoView() {}
        };
      }
    },
    window: {
      gtag(...args) {
        harness.gtagCalls.push(args);
      }
    },
    FormData: class {
      constructor(target) {
        this.form = target;
      }
    },
    fetch: async (...args) => {
      harness.fetchCalls.push(args);
      return {
        ok: responseStatus >= 200 && responseStatus < 300,
        status: responseStatus
      };
    },
    console
  };

  vm.runInNewContext(source, context, { filename: 'form-protection.js' });
  harness.submit = () => harness.submitHandler({
    preventDefault() {}
  });
  return harness;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const success = createHarness();
  await success.submit();
  assert(success.fetchCalls.length === 1, 'Valid submissions should post once.');
  assert(
    success.gtagCalls.length === 1 && success.gtagCalls[0][1] === 'generate_lead',
    'generate_lead should fire after a successful response.'
  );
  const eventParameters = success.gtagCalls[0][2];
  assert(
    !('email' in eventParameters) &&
      !('whatsapp' in eventParameters) &&
      !('company' in eventParameters),
    'Analytics parameters should not contain contact details.'
  );
  assert(
    success.form.resetCount === 1 && success.status.className.includes('form-success'),
    'Successful submissions should reset the form and show confirmation.'
  );
  assert(
    success.button.disabled === false && success.button.textContent === 'Request Sample',
    'The submit button should be restored after success.'
  );

  const rateLimited = createHarness({ lang: 'es', responseStatus: 429 });
  await rateLimited.submit();
  assert(
    rateLimited.gtagCalls.length === 0 && rateLimited.form.resetCount === 0,
    'Failed submissions should not be tracked or reset.'
  );
  assert(
    rateLimited.status.textContent.includes('demasiadas'),
    'Rate-limit feedback should be localized.'
  );
  assert(rateLimited.button.disabled === false, 'The submit button should recover after failure.');

  const blockedCompany = createHarness({ company: 'google' });
  await blockedCompany.submit();
  assert(
    blockedCompany.fetchCalls.length === 0 && blockedCompany.gtagCalls.length === 0,
    'Blocked company names should not submit or create a lead event.'
  );

  const invalidPhone = createHarness({ whatsapp: 'Costa Rica' });
  await invalidPhone.submit();
  assert(invalidPhone.fetchCalls.length === 0, 'Invalid WhatsApp values should not submit.');

  console.log('PASS: form protection and verified lead conversion tracking');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
