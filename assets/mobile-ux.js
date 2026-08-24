
(function(){
  function ready(fn){
    if(document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function(){
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.mobile-menu-toggle');
    if(header && toggle){
      toggle.addEventListener('click', function(){
        var open = header.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('nav-open-body', open);
      });
      header.querySelectorAll('.menu a').forEach(function(a){
        a.addEventListener('click', function(){
          header.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded','false');
          document.body.classList.remove('nav-open-body');
        });
      });
    }

    var cookie = document.getElementById('cookieBanner');
    var accept = document.getElementById('cookieAccept');
    function hideCookie(){
      if(!cookie) return;
      cookie.classList.add('is-hidden');
      document.body.classList.remove('cookie-visible');
      try{localStorage.setItem('mccs_cookie_ok','1');}catch(e){}
      setTimeout(function(){ cookie.style.display='none'; }, 260);
    }
    if(cookie){
      if(cookie.style.display === 'none' || (function(){try{return localStorage.getItem('mccs_cookie_ok')==='1'}catch(e){return false}})()){
        document.body.classList.remove('cookie-visible');
        cookie.style.display='none';
      }else{
        document.body.classList.add('cookie-visible');
        if(!cookie.querySelector('.cookie-close')){
          var close = document.createElement('button');
          close.type = 'button';
          close.className = 'cookie-close';
          close.setAttribute('aria-label', 'Close cookie notice');
          close.textContent = '\u00d7';
          cookie.appendChild(close);
          close.addEventListener('click', hideCookie);
        }
        accept && accept.addEventListener('click', hideCookie);
        var collapsed = false;
        window.addEventListener('scroll', function(){
          if(!collapsed && window.scrollY > 120){
            cookie.classList.add('is-compact');
            collapsed = true;
          }
        }, {passive:true});
      }
    }

    // Make contact CTAs land on the form directly.
    document.querySelectorAll('a[href$="/contact/"], a[href$="/es/contact/"], a[href$="/ar/contact/"]').forEach(function(a){
      if(!a.closest('.menu') && !a.closest('.footer-grid') && !a.closest('.language-switcher') && !a.classList.contains('brand')){
        a.href = a.getAttribute('href') + '#quoteForm';
      }
    });

    var quoteForm = document.getElementById('quoteForm');
    if(quoteForm && window.fetch && window.FormData && !document.querySelector('script[src^="/assets/form-protection.js"]')){
      var lang = (document.documentElement.lang || 'en').split('-')[0];
      var messages = {
        en: {
          sending: 'Sending your request...',
          success: 'Thank you. Your request was sent successfully. MCCS sales will review it and reply by email.',
          error: 'Your request could not be sent. Please try again or email sales@mccsgrowingmedia.com.'
        },
        es: {
          sending: 'Enviando su solicitud...',
          success: 'Gracias. Su solicitud se envio correctamente. El equipo de ventas de MCCS respondera por correo electronico.',
          error: 'No se pudo enviar la solicitud. Intente de nuevo o escriba a sales@mccsgrowingmedia.com.'
        },
        ar: {
          sending: '\u062c\u0627\u0631\u064a \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628\u0643...',
          success: '\u0634\u0643\u0631\u0627\u064b. \u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628\u0643 \u0628\u0646\u062c\u0627\u062d. \u0633\u064a\u0631\u0627\u062c\u0639\u0647 \u0641\u0631\u064a\u0642 \u0645\u0628\u064a\u0639\u0627\u062a MCCS \u0648\u064a\u0631\u062f \u0639\u0628\u0631 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a.',
          error: '\u062a\u0639\u0630\u0631 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0623\u0648 \u0631\u0627\u0633\u0644 sales@mccsgrowingmedia.com.'
        },
        zh: {
          sending: '\u6b63\u5728\u63d0\u4ea4\u60a8\u7684\u7533\u8bf7...',
          success: '\u611f\u8c22\u60a8\u7684\u8be2\u76d8\u3002\u7533\u8bf7\u5df2\u6210\u529f\u63d0\u4ea4\uff0cMCCS \u9500\u552e\u56e2\u961f\u5c06\u901a\u8fc7\u90ae\u4ef6\u56de\u590d\u3002',
          error: '\u7533\u8bf7\u6682\u65f6\u65e0\u6cd5\u63d0\u4ea4\u3002\u8bf7\u91cd\u8bd5\uff0c\u6216\u53d1\u9001\u90ae\u4ef6\u81f3 sales@mccsgrowingmedia.com\u3002'
        }
      };
      var copy = messages[lang] || messages.en;
      var status = document.createElement('div');
      status.className = 'form-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      var heading = quoteForm.querySelector('h2');
      if(heading) heading.insertAdjacentElement('afterend', status);
      else quoteForm.insertBefore(status, quoteForm.firstChild);

      var requestedDocument = new URLSearchParams(window.location.search).get('document');
      var messageField = quoteForm.querySelector('textarea[name="message"]');
      if(requestedDocument === 'sgs-report' && messageField && !messageField.value){
        messageField.value = 'Please confirm which SGS report applies to the proposed product model and project.';
      }

      quoteForm.addEventListener('submit', function(event){
        event.preventDefault();
        var submit = quoteForm.querySelector('button[type="submit"]');
        var originalText = submit ? submit.textContent : '';
        if(submit){ submit.disabled = true; submit.textContent = copy.sending; }
        status.className = 'form-status';
        status.textContent = copy.sending;

        fetch(quoteForm.action, {
          method: 'POST',
          body: new FormData(quoteForm),
          headers: {Accept: 'application/json'}
        }).then(function(response){
          if(!response.ok) throw new Error('Form submission failed');
          status.className = 'form-status form-success';
          status.textContent = copy.success;
          quoteForm.reset();
          if(typeof window.gtag === 'function'){
            window.gtag('event', 'generate_lead', {
              form_id: 'quoteForm',
              form_name: 'MCCS Sample Request',
              language: lang
            });
          }
        }).catch(function(){
          status.className = 'form-status form-error';
          status.textContent = copy.error;
        }).finally(function(){
          if(submit){ submit.disabled = false; submit.textContent = originalText; }
        });
      });
    }

    document.addEventListener('click', function(event){
      var link = event.target.closest && event.target.closest('a[href]');
      if(!link) return;
      var href = link.getAttribute('href') || '';
      if(!/\.(pdf|xlsx)(?:$|[?#])/i.test(href)) return;
      if(typeof window.gtag === 'function'){
        var cleanHref = href.split(/[?#]/)[0];
        var fileName = cleanHref.split('/').pop() || cleanHref;
        window.gtag('event', 'resource_download', {
          file_name: fileName,
          file_extension: (fileName.split('.').pop() || '').toLowerCase(),
          link_url: link.href
        });
      }
    });
  });
})();
