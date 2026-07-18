const CACHE_PREFIX = "citronex-siechnice-modular-";
const CACHE_NAME = CACHE_PREFIX + "20260718-siechnice-helper1";

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
  "./mowa.html",
  "./slownik.html",
  "./zakazy.html",
  "./test.html",
  "./manifest.webmanifest",
  "./assets/css/training.css?v=20260718-siechnice-helper1",
  "./assets/js/training-data.js?v=20260718-siechnice-helper1",
  "./assets/js/training-app.js?v=20260718-siechnice-helper1",
  "./assets/logo-citronex.svg",
  "./assets/brand/digital-presenter.png",
  "./assets/audio/intro-pl.mp3?v=20260718-siechnice-helper1",
  "./assets/audio/intro-en.mp3?v=20260718-siechnice-helper1",
  "./assets/audio/intro-ua.mp3?v=20260718-siechnice-helper1",
  "./assets/audio/intro-ru.mp3?v=20260718-siechnice-helper1",
  "./assets/audio/intro-az.mp3?v=20260718-siechnice-helper1",
  "./assets/audio/intro-es.mp3?v=20260718-siechnice-helper1",
  "./assets/audio/intro-fil.mp3?v=20260718-siechnice-helper1",
  "./assets/audio/intro-id.mp3?v=20260718-siechnice-helper1",
  "./assets/audio/intro-ne.mp3?v=20260718-siechnice-helper1"
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

function networkTimeout(ms = 1400) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms);
  });
}

async function matchCached(request, fallback = null) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true }) || await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  if (!fallback) return null;
  return cache.match(fallback, { ignoreSearch: true }) || caches.match(fallback, { ignoreSearch: true });
}

async function networkFirst(request, fallback = null) {
  const cached = await matchCached(request, null);
  try {
    const response = await Promise.race([fetch(request), networkTimeout()]);
    if (!response) return cached || await matchCached(request, fallback) || Response.error();
    await putInCache(request, response);
    return response;
  } catch (error) {
    return cached || await matchCached(request, fallback) || Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await matchCached(request, null);
  if (cached) {
    fetch(request).then((response) => putInCache(request, response)).catch(() => {});
    return cached;
  }
  try {
    const response = await Promise.race([fetch(request), networkTimeout()]);
    if (!response) return await matchCached(request, null) || Response.error();
    await putInCache(request, response);
    return response;
  } catch (error) {
    return await matchCached(request, null) || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const accept = request.headers.get("accept") || "";
  if (request.mode === "navigate" || accept.includes("text/html")) {
    event.respondWith(networkFirst(request, "./index.html"));
    return;
  }

  if (["script", "style", "worker"].includes(request.destination)) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
