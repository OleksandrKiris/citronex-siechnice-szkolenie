const CACHE_PREFIX = "citronex-siechnice-modular-";
const CACHE_NAME = CACHE_PREFIX + "2026-07-03-12";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./mapa.html",
  "./magazyn.html",
  "./tablet.html",
  "./szklarnia.html",
  "./reader.html",
  "./lekarz.html",
  "./kontakty.html",
  "./grupy.html",
  "./miasto.html",
  "./zakazy.html",
  "./test.html",
  "./manifest.webmanifest",
  "./assets/css/training.css",
  "./assets/js/training-data-v20260703.js",
  "./assets/js/training-app-v20260703.js",
  "./assets/logo-citronex.svg",
  "./assets/orientation/sklarnia-etap-excel.png",
  "./assets/inline/cart_pl.jpg",
  "./assets/inline/cart_ua.jpg",
  "./assets/inline/reader_start.jpg",
  "./assets/inline/restart_1.jpg",
  "./assets/inline/restart_2.jpg",
  "./assets/inline/hotel_1.jpg",
  "./assets/inline/hotel_2.jpg",
  "./assets/inline/hotel_3.jpg",
  "./assets/inline/hotel_4.jpg",
  "./assets/inline/hotel_5.jpg",
  "./assets/inline/stage12_1.jpg",
  "./assets/inline/stage12_2.jpg",
  "./assets/inline/stage34_1.jpg",
  "./assets/inline/stage34_2.jpg",
  "./assets/inline/stage34_3.jpg",
  "./assets/inline/stage5_1.jpg",
  "./assets/inline/stage5_2.jpg",
  "./assets/inline/stage5_3.jpg",
  "./assets/inline/stage5_4.jpg",
  "./assets/inline/stage6_1.jpg",
  "./assets/inline/stage6_2.jpg",
  "./assets/inline/stage6_3.jpg",
  "./assets/inline/stage6_4.jpg",
  "./assets/inline/stage6_5.jpg",
  "./assets/warehouse/magazyn-wejscie-1.jpg",
  "./assets/warehouse/magazyn-wejscie-2.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(CORE_ASSETS.map(async (asset) => {
      try {
        await cache.add(new Request(asset, { cache: "reload" }));
      } catch (error) {
        // Offline cache stays resilient if a non-critical asset fails.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map((name) => {
      if ((name.startsWith(CACHE_PREFIX) || name.startsWith("citronex-siechnice-training-")) && name !== CACHE_NAME) {
        return caches.delete(name);
      }
      return Promise.resolve();
    }));
    await self.clients.claim();
  })());
});

async function putInCache(request, response) {
  if (!response || !response.ok) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    await putInCache(request, response);
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || caches.match("./index.html");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  await putInCache(request, response);
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const accept = request.headers.get("accept") || "";
  if (request.mode === "navigate" || accept.includes("text/html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
