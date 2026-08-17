/**
 * Loads GA4 when window.LG.ga4 is set, and reveals phone links when
 * window.LG.phoneHref / phoneDisplay are set (see site-config.js).
 *
 * The gtag library is injected after idle/interaction so it stays off the
 * critical path. Events pushed to dataLayer before the script arrives are
 * processed when it loads.
 */
(function () {
  var cfg = window.LG || {};

  function fillPhone() {
    if (!cfg.phoneHref || !cfg.phoneDisplay) return;
    document.querySelectorAll('[data-lg-phone]').forEach(function (el) {
      el.hidden = false;
      el.removeAttribute('hidden');
      var link = el.tagName === 'A' ? el : el.querySelector('a');
      if (link) {
        link.setAttribute('href', cfg.phoneHref);
        if (!link.getAttribute('data-lg-phone-keep-label')) {
          link.textContent = cfg.phoneDisplay;
        }
      }
    });
  }

  function bootGa() {
    if (!cfg.ga4) return;

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', cfg.ga4);

    var injected = false;
    function inject() {
      if (injected) return;
      injected = true;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4);
      document.head.appendChild(s);
    }

    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (evt) {
      window.addEventListener(evt, inject, { once: true, passive: true });
    });
    if ('requestIdleCallback' in window) {
      requestIdleCallback(inject, { timeout: 4000 });
    } else {
      setTimeout(inject, 4000);
    }
  }

  function start() {
    fillPhone();
    bootGa();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
