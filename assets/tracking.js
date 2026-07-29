/**
 * Loads GA4 when window.LG.ga4 is set, and reveals phone links when
 * window.LG.phoneHref / phoneDisplay are set (see site-config.js).
 */
(function () {
  var cfg = window.LG || {};

  if (cfg.ga4) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', cfg.ga4);
  }

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fillPhone);
  } else {
    fillPhone();
  }
})();
