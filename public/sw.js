const CACHE = 'wasla-v2-20260805';
const CORE = [
  './','./index.html','./whatsapp-link.html','./qr-generator.html','./phone-formatter.html','./profit-calculator.html',
  './about.html','./privacy.html','./terms.html','./faq.html','./contact.html','./offline.html',
  './assets/css/style.css','./assets/js/common.js','./assets/js/ads-config.js','./assets/js/adsense.js',
  './assets/js/whatsapp.js','./assets/js/qr.js','./assets/js/formatter.js','./assets/js/profit.js','./assets/js/contact.js',
'./assets/icons/logo.svg','./assets/icons/favicon.svg','./manifest.webmanifest'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(async () => (await caches.match(event.request)) || (event.request.mode === 'navigate' ? caches.match('./offline.html') : Response.error())));
});
