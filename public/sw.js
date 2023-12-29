const cacheName = "luizbills.floppy-editor-v1";
const version = "1.0.1";

const precacheResources = [
  "/",
  "/index.html",
  "/app.css",
  "/app.js",
  "/floppy.js",
  "/icons/favicon.ico",
  "/icons/icon.png",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  // console.log("Installing...");
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources))
  );
});

self.addEventListener("fetch", (event) => {
  // console.log("Fetch intercepted for:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
