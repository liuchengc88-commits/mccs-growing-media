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
      gibberish: 'Please enter a clear project message without random or repeated text.',
      sending: 'Sending request...',
      success: 'Thank you. Your request was received and our sales team will review it.',
      submitError: 'Your request could not be sent. Please wait a moment and try again.',
      rateLimit: 'Too many requests were sent. Please wait a few minutes and try again.'
    },
    es: {
      honeypot: 'No se pudo enviar la solicitud. Actualice la página e inténtelo de nuevo.',
      whatsapp: 'Introduzca un número válido de WhatsApp o teléfono de 7 a 15 dígitos.',
      company: 'Introduzca el nombre completo de su empresa u organización.',
      message: 'Describa los requisitos, la aplicación y el mercado objetivo en al menos 20 caracteres.',
      gibberish: 'Escriba un mensaje claro sobre el proyecto, sin texto aleatorio o repetido.',
      sending: 'Enviando solicitud...',
      success: 'Gracias. Recibimos su solicitud y nuestro equipo comercial la revisará.',
      submitError: 'No se pudo enviar la solicitud. Espere un momento e inténtelo de nuevo.',
      rateLimit: 'Se enviaron demasiadas solicitudes. Espere unos minutos e inténtelo de nuevo.'
    },
    ar: {
      honeypot: 'تعذر إرسال الطلب. يرجى تحديث الصفحة والمحاولة مرة أخرى.',
      whatsapp: 'أدخل رقم واتساب أو هاتف صالحاً يتكون من 7 إلى 15 رقماً.',
      company: 'أدخل الاسم الكامل للشركة أو المؤسسة.',
      message: 'يرجى وصف متطلبات المنتج والاستخدام والسوق المستهدف في 20 حرفاً على الأقل.',
      gibberish: 'يرجى كتابة رسالة واضحة عن المشروع دون نص عشوائي أو متكرر.',
      sending: 'جارٍ إرسال الطلب...',
      success: 'شكراً لك. تم استلام طلبك وسيقوم فريق المبيعات بمراجعته.',
      submitError: 'تعذر إرسال الطلب. يرجى الانتظار قليلاً والمحاولة مرة أخرى.',
      rateLimit: 'تم إرسال عدد كبير من الطلبات. يرجى الانتظار بضع دقائق والمحاولة مرة أخرى.'
    },
    zh: {
      honeypot: '申请无法提交，请刷新页面后重试。',
      whatsapp: '请输入包含 7 至 15 位数字的有效 WhatsApp 或电话号码。',
      company: '请输入完整的公司或机构名称。',
      message: '请用至少 20 个字符说明产品要求、应用和目标市场。',
      gibberish: '请填写清晰的项目信息，不要输入随机或重复文字。',
      sending: '正在提交申请...',
      success: '感谢您的询盘。申请已收到，销售团队将进行审核。',
      submitError: '申请暂时无法提交，请稍后重试。',
      rateLimit: '提交次数过多，请等待几分钟后再试。'
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
  const submitButton = form.querySelector('button[type="submit"]');
  const submitButtonLabel = submitButton?.textContent || '';
  let submitting = false;

  status.className = 'form-status form-error';
  status.setAttribute('role', 'alert');
  status.setAttribute('aria-live', 'polite');
  status.tabIndex = -1;
  status.hidden = true;
  form.querySelector('h2')?.insertAdjacentElement('afterend', status);

  const showError = (field, message) => {
    status.className = 'form-status form-error';
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

  const setSubmitting = (active) => {
    submitting = active;
    if (!submitButton) return;
    submitButton.disabled = active;
    submitButton.setAttribute('aria-busy', String(active));
    submitButton.textContent = active ? copy.sending : submitButtonLabel;
  };

  const showSuccess = () => {
    status.className = 'form-status form-success';
    status.textContent = copy.success;
    status.hidden = false;
    status.focus({ preventScroll: true });
    status.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const trackSuccessfulLead = () => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'generate_lead', {
      form_id: 'quoteForm',
      form_language: language,
      lead_type: 'sample_request',
      transport_type: 'beacon'
    });
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

  form.addEventListener('submit', async (event) => {
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
      return;
    }

    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        showError(null, response.status === 429 ? copy.rateLimit : copy.submitError);
        return;
      }

      trackSuccessfulLead();
      form.reset();
      showSuccess();
    } catch {
      showError(null, copy.submitError);
    } finally {
      setSubmitting(false);
    }
  });
})();
