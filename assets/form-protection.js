(() => {
  const form = document.getElementById('quoteForm');

  if (!form) return;

  const language = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
  const messages = {
    en: {
      honeypot: 'Your request could not be submitted. Please refresh the page and try again.',
      whatsapp: 'Enter a valid WhatsApp or phone number with 7 to 15 digits.',
      company: 'Enter your full company or organization name.',
      message: 'Please describe your product requirements, application and target market in at least 20 characters.',
      gibberish: 'Please enter a clear project message without random or repeated text.'
    },
    es: {
      honeypot: 'No se pudo enviar la solicitud. Actualice la página e inténtelo de nuevo.',
      whatsapp: 'Introduzca un número válido de WhatsApp o teléfono de 7 a 15 dígitos.',
      company: 'Introduzca el nombre completo de su empresa u organización.',
      message: 'Describa los requisitos, la aplicación y el mercado objetivo en al menos 20 caracteres.',
      gibberish: 'Escriba un mensaje claro sobre el proyecto, sin texto aleatorio o repetido.'
    },
    ar: {
      honeypot: 'تعذر إرسال الطلب. يرجى تحديث الصفحة والمحاولة مرة أخرى.',
      whatsapp: 'أدخل رقم واتساب أو هاتف صالحاً يتكون من 7 إلى 15 رقماً.',
      company: 'أدخل الاسم الكامل للشركة أو المؤسسة.',
      message: 'يرجى وصف متطلبات المنتج والاستخدام والسوق المستهدف في 20 حرفاً على الأقل.',
      gibberish: 'يرجى كتابة رسالة واضحة عن المشروع دون نص عشوائي أو متكرر.'
    }
  };
  const copy = messages[language] || messages.en;
  const fields = {
    honeypot: form.elements.namedItem('_gotcha'),
    whatsapp: form.elements.namedItem('whatsapp'),
    company: form.elements.namedItem('company'),
    message: form.elements.namedItem('message')
  };
  const blockedCompanyNames = new Set([
    'abc', 'asdf', 'company', 'google', 'na', 'none', 'qwerty', 'test', 'testing'
  ]);
  const status = document.createElement('div');

  status.className = 'form-error';
  status.setAttribute('role', 'alert');
  status.setAttribute('aria-live', 'polite');
  status.hidden = true;
  form.querySelector('h2')?.insertAdjacentElement('afterend', status);

  const showError = (field, message) => {
    status.textContent = message;
    status.hidden = false;
    field?.setAttribute('aria-invalid', 'true');
    field?.focus({ preventScroll: true });
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const clearErrors = () => {
    status.textContent = '';
    status.hidden = true;
    Object.values(fields).forEach((field) => field?.removeAttribute('aria-invalid'));
  };

  const normalizedCompany = (value) => value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');

  const validPhone = (value) => {
    const trimmed = value.trim();
    const digits = trimmed.replace(/\D/g, '');
    return /^\+?[\d\s().-]+$/.test(trimmed) && digits.length >= 7 && digits.length <= 15;
  };

  const looksLikeGibberish = (value) => {
    const compact = value.trim().replace(/\s+/g, ' ');
    const alphaNumeric = compact.match(/[\p{L}\p{N}]/gu) || [];
    const words = compact.match(/[\p{L}\p{N}]+/gu) || [];
    const uniqueRatio = new Set(alphaNumeric.map((char) => char.toLowerCase())).size / Math.max(alphaNumeric.length, 1);
    const averageWordLength = alphaNumeric.length / Math.max(words.length, 1);

    return /(.)\1{5,}/u.test(compact)
      || words.some((word) => word.length > 35)
      || (alphaNumeric.length >= 20 && uniqueRatio < 0.12)
      || (alphaNumeric.length >= 45 && words.length <= 5 && averageWordLength > 12);
  };

  Object.values(fields).forEach((field) => field?.addEventListener('input', clearErrors));

  form.addEventListener('submit', (event) => {
    clearErrors();

    if (fields.honeypot?.value.trim()) {
      event.preventDefault();
      showError(null, copy.honeypot);
      return;
    }

    if (!fields.whatsapp?.value || !validPhone(fields.whatsapp.value)) {
      event.preventDefault();
      showError(fields.whatsapp, copy.whatsapp);
      return;
    }

    if (blockedCompanyNames.has(normalizedCompany(fields.company?.value || ''))) {
      event.preventDefault();
      showError(fields.company, copy.company);
      return;
    }

    const message = fields.message?.value.trim() || '';
    const meaningfulCharacters = (message.match(/[\p{L}\p{N}]/gu) || []).length;

    if (message.length < 20 || meaningfulCharacters < 12) {
      event.preventDefault();
      showError(fields.message, copy.message);
      return;
    }

    if (looksLikeGibberish(message)) {
      event.preventDefault();
      showError(fields.message, copy.gibberish);
    }
  });
})();
