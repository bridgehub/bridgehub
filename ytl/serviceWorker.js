const staticytcheck = "dev-ytcheck-v01";

const assets = [
  "./",
  "./ytlist.html",
  "./img/icons/ytcheck.png"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticytcheck).then(cache => {
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
