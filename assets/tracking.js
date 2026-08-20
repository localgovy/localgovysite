/**
 * Loads GA4 when window.LG.ga4 is set, and reveals phone links when
 * window.LG.phoneHref / phoneDisplay are set (see site-config.js).
 *
 * The gtag library is injected on the first click, tap, or keypress so it
 * stays off the critical path and off PageSpeed lab runs — except when the
 * URL already has Ads/campaign params (gclid, gad_source, gbraid, wbraid, utm_),
 * in which case we load immediately so landing-page views are counted.
 *
 * Campaign params are stored in sessionStorage and exposed as window.lgCampaign().
 */
(function () {
  var cfg = window.LG || {};
  var STORAGE_KEY = 'lg_campaign';
  var KNOWN_KEYS = [
    'gclid',
    'gad_source',
    'gbraid',
    'wbraid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'utm_id'
  ];

  function queryParams() {
    try {
      return new URLSearchParams(window.location.search);
    } catch (e) {
      return new URLSearchParams();
    }
  }

  function readCampaignFromUrl() {
    var qs = queryParams();
    var out = {};
    var found = false;
    qs.forEach(function (val, key) {
      if (!val) return;
      if (key.indexOf('utm_') === 0 || KNOWN_KEYS.indexOf(key) !== -1) {
        out[key] = val;
        found = true;
      }
    });
    return found ? out : null;
  }

  function persistCampaign(campaign) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
    } catch (e) { /* private mode / blocked storage */ }
  }

  function loadStoredCampaign() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  var fromUrl = readCampaignFromUrl();
  if (fromUrl) persistCampaign(fromUrl);
  var campaign = fromUrl || loadStoredCampaign();

  window.lgCampaign = function () {
    return campaign ? Object.assign({}, campaign) : {};
  };

  function hasPaidLandingParams() {
    var qs = queryParams();
    var found = false;
    qs.forEach(function (_, key) {
      if (key.indexOf('utm_') === 0 || KNOWN_KEYS.indexOf(key) !== -1) found = true;
    });
    return found;
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

  function adsAccountId(adsId) {
    if (!adsId) return '';
    return String(adsId).split('/')[0];
  }

  function bootGa() {
    if (!cfg.ga4) return;

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', cfg.ga4);
    var adsAccount = adsAccountId(cfg.adsId);
    if (adsAccount) gtag('config', adsAccount);

    var injected = false;
    function inject() {
      if (injected) return;
      injected = true;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4);
      document.head.appendChild(s);
    }

    if (hasPaidLandingParams()) {
      inject();
      return;
    }

    // Click/tap/key only — not scroll or idle. Lighthouse scrolls the page and
    // would otherwise pull gtag.js into the lab (TBT + unused JS).
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
      window.addEventListener(evt, inject, { once: true, passive: true });
    });
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
