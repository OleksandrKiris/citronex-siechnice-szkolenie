const CACHE_PREFIX = "citronex-siechnice-modular-";
const CACHE_NAME = CACHE_PREFIX + "20260719-siechnice-master15";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./pomocnik.html",
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
  "./assets/css/training.css?v=20260719-siechnice-master15",
  "./assets/js/training-data.js?v=20260719-siechnice-master15",
  "./assets/js/training-app.js?v=20260719-siechnice-master15",
  "./assets/logo-citronex.svg",
  "./assets/content/presenter-guide.json?v=20260719-siechnice-master15",
  "./assets/avatar/cartoon/pose-neutral-v4.png?v=20260719-siechnice-master15",
  "./assets/avatar/cartoon/pose-right-v5.png?v=20260719-siechnice-master15",
  "./assets/avatar/cartoon/pose-left-v4.png?v=20260719-siechnice-master15",
  "./assets/avatar/cartoon/pose-warning-v5.png?v=20260719-siechnice-master15",
  "./assets/avatar/cartoon/pose-reader-v5.png?v=20260719-siechnice-master15",
  "./assets/avatar/cartoon/pose-tablet-v5.png?v=20260719-siechnice-master15",
  "./assets/guide/arrival-route-v1.svg",
  "./assets/warehouse/magazyn-wejscie-1.jpg",
  "./assets/warehouse/magazyn-wejscie-2.jpg",
  "./assets/greenhouse-orientation/orientacja-ogolna.svg",
  "./assets/greenhouse-orientation/lewa-prawa-strona.svg",
  "./assets/greenhouse-orientation/nawa.svg",
  "./assets/greenhouse-orientation/przejscie.svg",
  "./assets/greenhouse-orientation/przeslo.svg",
  "./assets/inline/reader_start.jpg",
  "./assets/inline/stage12_1.jpg",
  "./assets/inline/stage12_2.jpg",
  "./assets/inline/cart_pl.jpg",
  "./assets/inline/stage34_1.jpg",
  "./assets/inline/restart_1.jpg",
  "./assets/inline/restart_2.jpg",
  "./assets/tablet/tablet-login-pin.jpg",
  "./assets/tablet/tablet-start-work.jpg",
  "./assets/tablet/tablet-activity.jpg",
  "./assets/tablet/tablet-change-activity.jpg",
  "./assets/tablet/tablet-break-start.jpg",
  "./assets/tablet/tablet-after-break-activity.jpg",
  "./assets/tablet/tablet-work-end.jpg",
  "./assets/tablet/tablet-logout.jpg",
  "./assets/audio/guide/pl/01-welcome.mp3?v=20260719-siechnice-master15",
  "./assets/audio/guide/en/01-welcome.mp3?v=20260719-siechnice-master15",
  "./assets/audio/guide/ua/01-welcome.mp3?v=20260719-siechnice-master15",
  "./assets/audio/guide/ru/01-welcome.mp3?v=20260719-siechnice-master15",
  "./assets/audio/guide/az/01-welcome.mp3?v=20260719-siechnice-master15",
  "./assets/audio/guide/es/01-welcome.mp3?v=20260719-siechnice-master15",
  "./assets/audio/guide/fil/01-welcome.mp3?v=20260719-siechnice-master15",
  "./assets/audio/guide/id/01-welcome.mp3?v=20260719-siechnice-master15",
  "./assets/audio/guide/ne/01-welcome.mp3?v=20260719-siechnice-master15",
  "./assets/audio/male/intro-pl.mp3?v=20260718-siechnice-helper10",
  "./assets/audio/male/intro-en.mp3?v=20260718-siechnice-helper10",
  "./assets/audio/male/intro-ua.mp3?v=20260718-siechnice-helper10",
  "./assets/audio/male/intro-ru.mp3?v=20260718-siechnice-helper10",
  "./assets/audio/male/intro-az.mp3?v=20260718-siechnice-helper10",
  "./assets/audio/male/intro-es.mp3?v=20260718-siechnice-helper10",
  "./assets/audio/male/intro-fil.mp3?v=20260718-siechnice-helper10",
  "./assets/audio/male/intro-id.mp3?v=20260718-siechnice-helper10",
  "./assets/audio/male/intro-ne.mp3?v=20260718-siechnice-helper10"
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

  // Media elements use byte-range requests. Let the server return a real
  // 206 response instead of serving a cached 200 response for the whole MP3.
  if (request.headers.has("range")) {
    event.respondWith(fetch(request));
    return;
  }

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
