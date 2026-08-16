(() => {
  'use strict';
  const config = window.WASLA_ADSENSE || {};
  const validClient = /^ca-pub-\d{10,}$/.test(config.client || '');
  if (!config.enabled || !validClient) return;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.client)}`;
  document.head.appendChild(script);

  document.querySelectorAll('.ad-zone[data-position]').forEach(zone => {
    const position = zone.dataset.position;
    const slot = config.slots && config.slots[position];
    if (!slot) return;
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.dataset.adClient = config.client;
    ad.dataset.adSlot = slot;
    ad.dataset.adFormat = 'auto';
    ad.dataset.fullWidthResponsive = 'true';
    zone.innerHTML = '';
    zone.appendChild(ad);
    zone.dataset.ready = 'true';
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (_) {}
  });
})();
