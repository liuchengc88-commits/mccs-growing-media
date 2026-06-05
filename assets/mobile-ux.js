
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
          close.textContent = '×';
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
      if(!a.closest('.menu') && !a.closest('.footer-grid') && !a.classList.contains('brand')){
        a.href = a.getAttribute('href') + '#quoteForm';
      }
    });
  });
})();
