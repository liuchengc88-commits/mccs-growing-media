
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

    // Keep general factory videos separate from model cards. Only a video whose
    // factory title names a model may appear inside that product's quick view.
    var productMatrix = document.getElementById('productMatrix');
    if(productMatrix){
      fetch('/assets/factory-videos.json', {cache:'force-cache'}).then(function(response){
        if(!response.ok) throw new Error('Factory video manifest unavailable');
        return response.json();
      }).then(function(videos){
        var htmlLang = (document.documentElement.lang || 'en').toLowerCase();
        var locale = htmlLang.indexOf('zh') === 0 ? 'cn' : htmlLang.split('-')[0];
        if(!['en','es','ar','cn'].includes(locale)) locale = 'en';
        var copy = {
          en: ['Factory application videos', 'These are application or material references, not model-specific performance tests. Confirm the CF model and tray fit separately.'],
          es: ['Videos de aplicaciones de fábrica', 'Son referencias de aplicación o material, no pruebas de rendimiento de un modelo. Confirme por separado el modelo CF y la bandeja.'],
          ar: ['فيديوهات تطبيقات المصنع', 'هذه مراجع للتطبيق أو المادة وليست اختبارات أداء خاصة بطراز محدد. يرجى تأكيد طراز CF وملاءمة الصينية بشكل منفصل.'],
          cn: ['工厂应用视频', '以下为应用或材料参考，并非单一型号性能测试；CF 型号和穴盘匹配需单独确认。']
        }[locale];
        var section = document.createElement('section');
        section.className = 'section section-soft factory-video-library';
        var container = document.createElement('div');
        container.className = 'container';
        var heading = document.createElement('div');
        heading.className = 'section-head';
        var title = document.createElement('h2');
        title.textContent = copy[0];
        var note = document.createElement('p');
        note.textContent = copy[1];
        heading.append(title, note);
        var grid = document.createElement('div');
        grid.className = 'factory-video-grid';
        videos.forEach(function(item){
          var card = document.createElement('article');
          var video = document.createElement('video');
          video.controls = true;
          video.playsInline = true;
          video.preload = 'none';
          video.poster = '/' + item.poster;
          var source = document.createElement('source');
          source.src = '/' + item.src;
          source.type = 'video/mp4';
          video.appendChild(source);
          var label = document.createElement('h3');
          label.textContent = item.title[locale] || item.title.en;
          card.append(video, label);
          grid.appendChild(card);
        });
        container.append(heading, grid);
        section.appendChild(container);
        var matrixSection = productMatrix.closest('section');
        if(matrixSection) matrixSection.insertAdjacentElement('afterend', section);
      }).catch(function(){ /* Product catalog remains usable without the optional video library. */ });
    }

    // Suggest an available translation from the visitor's browser preference.
    // The site never redirects automatically, so shared URLs and crawler signals stay stable.
    fetch('/assets/language-routes.json', {cache:'force-cache'}).then(function(response){
      if(!response.ok) throw new Error('Language route manifest unavailable');
      return response.json();
    }).then(function(routes){
      var currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
      var options = routes[currentPath];
      if(!options || options.length < 2) return;
      var currentLang = (document.documentElement.lang || 'en').toLowerCase();
      var currentLocale = currentLang.indexOf('zh') === 0 ? 'cn' : currentLang.split('-')[0];
      var switcher = document.querySelector('.language-switcher');
      if(switcher){
        options.forEach(function(option){
          var link = switcher.querySelector('a[lang="'+(option.locale === 'cn' ? 'zh-CN' : option.locale)+'"]');
          if(!link){
            link = document.createElement('a');
            link.href = option.href;
            link.lang = option.locale === 'cn' ? 'zh-CN' : option.locale;
            link.textContent = option.label;
            switcher.appendChild(link);
          }
          if(option.locale === currentLocale) link.setAttribute('aria-current', 'page');
          link.addEventListener('click', function(){
            try{localStorage.setItem('mccs_language', option.locale);}catch(e){}
          });
        });
      }

      var preferred = '';
      try{preferred = localStorage.getItem('mccs_language') || '';}catch(e){}
      if(!preferred){
        var browserLanguages = navigator.languages || [navigator.language || 'en'];
        preferred = browserLanguages.map(function(value){
          value = value.toLowerCase();
          if(value.indexOf('zh') === 0) return 'cn';
          if(value.indexOf('es') === 0) return 'es';
          if(value.indexOf('ar') === 0) return 'ar';
          return 'en';
        }).find(function(locale){ return options.some(function(option){ return option.locale === locale; }); }) || '';
      }
      var target = options.find(function(option){ return option.locale === preferred; });
      var dismissed = false;
      try{dismissed = sessionStorage.getItem('mccs_language_prompt_dismissed') === '1';}catch(e){}
      if(!target || preferred === currentLocale || dismissed) return;

      var copy = {
        en: ['This page is also available in', 'View', 'Dismiss'],
        es: ['Esta página también está disponible en', 'Ver', 'Cerrar'],
        ar: ['هذه الصفحة متاحة أيضاً باللغة', 'عرض', 'إغلاق'],
        cn: ['此页面也提供', '查看', '关闭']
      }[currentLocale] || ['This page is also available in', 'View', 'Dismiss'];
      var prompt = document.createElement('aside');
      prompt.className = 'language-suggestion';
      prompt.setAttribute('aria-label', 'Language suggestion');
      prompt.innerHTML = '<span>'+copy[0]+' <b>'+target.label+'</b></span><a href="'+target.href+'">'+copy[1]+' '+target.label+'</a><button type="button" aria-label="'+copy[2]+'">&times;</button>';
      prompt.querySelector('a').addEventListener('click', function(){
        try{localStorage.setItem('mccs_language', preferred);}catch(e){}
      });
      prompt.querySelector('button').addEventListener('click', function(){
        try{sessionStorage.setItem('mccs_language_prompt_dismissed', '1');}catch(e){}
        prompt.remove();
      });
      document.body.appendChild(prompt);
    }).catch(function(){ /* Keep navigation usable if the optional manifest cannot load. */ });
  });
})();
