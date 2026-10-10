(() => {
  const form = document.getElementById('quoteForm');

  if (!form) return;

  // Public widget key only. Coordinate Formspree server enforcement as documented in docs/form-verification.md.
  const turnstileSiteKey = '';
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
      rateLimit: 'Too many requests were sent. Please wait a few minutes and try again.',
      verification: 'Human verification',
      verifying: 'Verifying your browser...',
      verified: 'Verification complete.',
      verificationRequired: 'Please complete human verification before sending your request.',
      verificationExpired: 'Verification expired. Please verify again before sending.',
      verificationError: 'Verification could not load. Retry, or contact sales by email or WhatsApp.',
      verificationRejected: 'Human verification was not accepted. Please verify again and retry.',
      retryVerification: 'Retry verification'
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
      rateLimit: 'Se enviaron demasiadas solicitudes. Espere unos minutos e inténtelo de nuevo.',
      verification: 'Verificación humana',
      verifying: 'Verificando su navegador...',
      verified: 'Verificación completada.',
      verificationRequired: 'Complete la verificación humana antes de enviar la solicitud.',
      verificationExpired: 'La verificación caducó. Verifique de nuevo antes de enviar.',
      verificationError: 'No se pudo cargar la verificación. Reinténtelo o contacte por email o WhatsApp.',
      verificationRejected: 'La verificación no fue aceptada. Verifique de nuevo y reintente.',
      retryVerification: 'Reintentar verificación'
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
      rateLimit: 'تم إرسال عدد كبير من الطلبات. يرجى الانتظار بضع دقائق والمحاولة مرة أخرى.',
      verification: 'التحقق البشري',
      verifying: 'جارٍ التحقق من المتصفح...',
      verified: 'اكتمل التحقق.',
      verificationRequired: 'يرجى إكمال التحقق البشري قبل إرسال الطلب.',
      verificationExpired: 'انتهت صلاحية التحقق. يرجى التحقق مرة أخرى قبل الإرسال.',
      verificationError: 'تعذر تحميل التحقق. أعد المحاولة أو تواصل عبر البريد الإلكتروني أو واتساب.',
      verificationRejected: 'لم يتم قبول التحقق. يرجى التحقق مرة أخرى وإعادة المحاولة.',
      retryVerification: 'إعادة محاولة التحقق'
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
      rateLimit: '提交次数过多，请等待几分钟后再试。',
      verification: '人机验证',
      verifying: '正在验证浏览器...',
      verified: '验证已完成。',
      verificationRequired: '请完成人机验证后再提交申请。',
      verificationExpired: '验证已过期，请重新验证后再提交。',
      verificationError: '验证暂时无法加载，请重试，或通过邮箱、WhatsApp 联系销售。',
      verificationRejected: '人机验证未通过，请重新验证后再试。',
      retryVerification: '重新验证'
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
  let verificationToken = '';
  let verifiedAt = 0;
  let widgetId = null;
  let apiScript = null;
  let loadTimer = null;
  let verificationPanel = null;
  let verificationWidget = null;
  let verificationStatus = null;
  let verificationRetry = null;

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
    submitButton.disabled = active || Boolean(turnstileSiteKey && !verificationToken);
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

  const updateVerification = (message, canRetry = false) => {
    verificationStatus.textContent = message;
    verificationRetry.hidden = !canRetry;
    setSubmitting(submitting);
  };

  const invalidateVerification = (message) => {
    verificationToken = '';
    verifiedAt = 0;
    updateVerification(message, true);
  };

  const renderVerification = () => {
    window.clearTimeout(loadTimer);
    try {
      const widgetSize = verificationWidget.clientWidth < 300 ? 'compact' : 'flexible';
      if (widgetId !== null) {
        if (verificationWidget.getAttribute('data-size') === widgetSize) return;
        window.turnstile.remove(widgetId);
        widgetId = null;
        verificationToken = '';
        verifiedAt = 0;
        updateVerification(copy.verifying);
      }
      verificationWidget.setAttribute('data-size', widgetSize);
      widgetId = window.turnstile.render(verificationWidget, {
        sitekey: turnstileSiteKey,
        language: language === 'zh' ? 'zh-CN' : (messages[language] ? language : 'en'),
        size: widgetSize,
        theme: 'light',
        action: 'sample_request',
        'response-field': false,
        callback(token) {
          if (!token) {
            invalidateVerification(copy.verificationError);
            return;
          }
          verificationToken = token;
          verifiedAt = Date.now();
          verificationPanel.removeAttribute('aria-invalid');
          updateVerification(copy.verified);
        },
        'expired-callback'() {
          invalidateVerification(copy.verificationExpired);
        },
        'timeout-callback'() {
          invalidateVerification(copy.verificationExpired);
        },
        'error-callback'() {
          invalidateVerification(copy.verificationError);
        }
      });
    } catch {
      invalidateVerification(copy.verificationError);
    }
  };

  const resetVerification = () => {
    if (!turnstileSiteKey) return;
    verificationToken = '';
    verifiedAt = 0;
    updateVerification(copy.verifying);
    if (widgetId === null || !window.turnstile) {
      invalidateVerification(copy.verificationError);
      return;
    }
    try {
      const widgetSize = verificationWidget.clientWidth < 300 ? 'compact' : 'flexible';
      if (verificationWidget.getAttribute('data-size') !== widgetSize) renderVerification();
      else window.turnstile.reset(widgetId);
    } catch {
      invalidateVerification(copy.verificationError);
    }
  };

  const loadVerification = () => {
    verificationToken = '';
    verifiedAt = 0;
    updateVerification(copy.verifying);
    if (window.turnstile) {
      if (widgetId === null) renderVerification();
      else resetVerification();
      return;
    }
    window.clearTimeout(loadTimer);
    apiScript?.remove();
    const script = document.createElement('script');
    apiScript = script;
    window.mccsTurnstileReady = renderVerification;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=mccsTurnstileReady';
    script.async = true;
    script.onerror = () => {
      if (apiScript !== script) return;
      window.clearTimeout(loadTimer);
      invalidateVerification(copy.verificationError);
    };
    loadTimer = window.setTimeout(() => {
      invalidateVerification(copy.verificationError);
    }, 15000);
    document.head.appendChild(script);
  };

  if (turnstileSiteKey) {
    verificationPanel = document.createElement('div');
    verificationPanel.className = 'form-verification';
    verificationPanel.tabIndex = -1;
    verificationPanel.setAttribute('role', 'group');
    verificationPanel.setAttribute('aria-label', copy.verification);
    verificationWidget = document.createElement('div');
    verificationWidget.className = 'form-verification-widget';
    verificationStatus = document.createElement('p');
    verificationStatus.setAttribute('role', 'status');
    verificationStatus.setAttribute('aria-live', 'polite');
    verificationRetry = document.createElement('button');
    verificationRetry.type = 'button';
    verificationRetry.className = 'form-verification-retry';
    verificationRetry.textContent = copy.retryVerification;
    verificationRetry.addEventListener('click', loadVerification);
    verificationPanel.append(verificationWidget, verificationStatus, verificationRetry);
    form.insertBefore(verificationPanel, submitButton);
    window.addEventListener('resize', () => {
      if (!submitting && window.turnstile && widgetId !== null) renderVerification();
    });
    loadVerification();
  }

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
    // Word-length checks apply to Latin tokens, not legitimate unspaced Chinese text.
    const words = compact.match(/[a-zA-Z0-9]+/g) || [];
    const uniqueRatio = new Set(alphaNumeric.map((char) => char.toLowerCase())).size / Math.max(alphaNumeric.length, 1);
    const wordCharacters = words.join('').length;
    const averageWordLength = wordCharacters / Math.max(words.length, 1);

    return /(.)\1{5,}/u.test(compact)
      || words.some((word) => word.length > 35)
      || (alphaNumeric.length >= 20 && uniqueRatio < 0.12)
      || (wordCharacters >= 45 && words.length <= 5 && averageWordLength > 12);
  };

  Object.values(fields).forEach((field) => field?.addEventListener('input', clearErrors));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;
    clearErrors();

    if (fields.honeypot?.value.trim()) {
      showError(null, copy.honeypot);
      return;
    }

    if (fields.whatsapp?.value.trim() && !validPhone(fields.whatsapp.value)) {
      showError(fields.whatsapp, copy.whatsapp);
      return;
    }

    if (blockedCompanyNames.has(normalizedCompany(fields.company?.value || ''))) {
      showError(fields.company, copy.company);
      return;
    }

    const message = fields.message?.value.trim() || '';
    const meaningfulCharacters = (message.match(/[\p{L}\p{N}]/gu) || []).length;

    if (message.length < 20 || meaningfulCharacters < 12) {
      showError(fields.message, copy.message);
      return;
    }

    if (looksLikeGibberish(message)) {
      showError(fields.message, copy.gibberish);
      return;
    }

    if (turnstileSiteKey && (!verificationToken || Date.now() - verifiedAt >= 300000)) {
      invalidateVerification(copy.verificationRequired);
      showError(verificationPanel, copy.verificationRequired);
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData(form);
      if (turnstileSiteKey) data.set('cf-turnstile-response', verificationToken);
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        let errorMessage = response.status === 429 ? copy.rateLimit : copy.submitError;
        if (turnstileSiteKey && response.status !== 429) {
          const result = await response.json().catch(() => ({}));
          if (Array.isArray(result.errors) && result.errors.some((error) =>
            /captcha|turnstile/i.test(`${error.field || ''} ${error.code || ''} ${error.message || ''}`)
          )) errorMessage = copy.verificationRejected;
        }
        showError(null, errorMessage);
        return;
      }

      trackSuccessfulLead();
      form.reset();
      showSuccess();
    } catch {
      showError(null, copy.submitError);
    } finally {
      // Tokens are single-use, including attempts that fail or have an uncertain network outcome.
      resetVerification();
      setSubmitting(false);
    }
  });
})();
