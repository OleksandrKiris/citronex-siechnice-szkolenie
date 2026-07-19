const CACHE_PREFIX = "citronex-siechnice-modular-";
const CACHE_NAME = CACHE_PREFIX + "20260719-siechnice-master33";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./pomocnik.html",
  "./redaktor.html",
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
  "./assets/css/training.css?v=20260719-siechnice-master33",
  "./assets/css/presenter-rig.css?v=20260719-siechnice-master33",
  "./assets/css/presenter-clean.css?v=20260719-siechnice-master33",
  "./assets/css/editor.css?v=20260719-siechnice-master33",
  "./assets/js/training-data.js?v=20260719-siechnice-master33",
  "./assets/js/training-app.js?v=20260719-siechnice-master33",
  "./assets/js/editor.js?v=20260719-siechnice-master33",
  "./assets/logo-citronex.svg",
  "./assets/content/presenter-guide.json?v=20260719-siechnice-master33",
  "./assets/avatar/cartoon/head-v1.png?v=20260719-siechnice-master33",
  "./assets/avatar/cartoon/torso-v1.png?v=20260719-siechnice-master33",
  "./assets/avatar/cartoon/arm-left-v2.png?v=20260719-siechnice-master33",
  "./assets/avatar/cartoon/arm-right-v3.png?v=20260719-siechnice-master33",
  "./assets/avatar/presenter-cartoon-professional-closed-v1.png?v=20260719-siechnice-master33",
  "./assets/avatar/presenter-cartoon-professional-open-v1.png?v=20260719-siechnice-master33",
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
  "./assets/audio/guide/pl/01-welcome.mp3?v=20260719-siechnice-master33",
  "./assets/audio/guide/en/01-welcome.mp3?v=20260719-siechnice-master33",
  "./assets/audio/guide/ua/01-welcome.mp3?v=20260719-siechnice-master33",
  "./assets/audio/guide/ru/01-welcome.mp3?v=20260719-siechnice-master33",
  "./assets/audio/guide/az/01-welcome.mp3?v=20260719-siechnice-master33",
  "./assets/audio/guide/es/01-welcome.mp3?v=20260719-siechnice-master33",
  "./assets/audio/guide/fil/01-welcome.mp3?v=20260719-siechnice-master33",
  "./assets/audio/guide/id/01-welcome.mp3?v=20260719-siechnice-master33",
  "./assets/audio/guide/ne/01-welcome.mp3?v=20260719-siechnice-master33",
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

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
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

async function networkFirst(request, fallback = null, timeoutMs = 5000) {
  const cached = await matchCached(request, null);
  try {
    const response = await Promise.race([fetch(request, { cache: "no-store" }), networkTimeout(timeoutMs)]);
    if (!response) return cached || await matchCached(request, fallback) || Response.error();
    await putInCache(request, response);
    return response;
  } catch (error) {
    return cached || await matchCached(request, fallback) || Response.error();
  }
}

async function networkFirstVersioned(request) {
  const cache = await caches.open(CACHE_NAME);
  const exact = await cache.match(request);
  try {
    const response = await Promise.race([fetch(request, { cache: "reload" }), networkTimeout(3500)]);
    if (!response) return exact || await matchCached(request, null) || Response.error();
    await putInCache(request, response);
    return response;
  } catch (error) {
    return exact || await matchCached(request, null) || Response.error();
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
    event.respondWith(networkFirst(request, "./index.html", 6000));
    return;
  }

  if (["script", "style", "worker"].includes(request.destination)) {
    event.respondWith(networkFirstVersioned(request));
    return;
  }

  // Instruction data can change independently from the shell. Prefer the
  // current network copy so a returning worker never sees an outdated guide.
  if (url.pathname.endsWith(".json")) {
    event.respondWith(networkFirst(request, null, 4000));
    return;
  }

  event.respondWith(cacheFirst(request));
});
