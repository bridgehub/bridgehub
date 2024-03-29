const staticNewscheck = "dev-newscheck-v01";

const assets = [
  "./",
  "./news.html",
  "./newsmsm.html",
  "./js/news.js",
  "./js/jquery-3.6.3.min.js",
  "./img/spinner.gif",
  "./img/icons/newscheck.png"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticNewscheck).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
