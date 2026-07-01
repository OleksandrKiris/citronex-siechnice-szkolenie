const CACHE_PREFIX = "citronex-siechnice-training-";
const CACHE_NAME = CACHE_PREFIX + "2026-07-01-02";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./stage-location.css",
  "./stage-location.js",
  "./assets/logo-citronex.svg"
];

// Images are cached on demand during normal browsing.
// Do not preload all photos on install, because weaker phones can freeze
// or show a long blank screen while many large JPG files are being cached.
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(CORE_ASSETS.map(async (asset) => {
      try {
        await cache.add(new Request(asset, { cache: "reload" }));
      } catch (error) {
        console.warn("[SW] Core asset was not cached:", asset, error);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map((name) => {
      if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) {
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

function isImageRequest(url, request) {
  if (request.destination === "image") return true;
  return IMAGE_EXTENSIONS.some((ext) => url.pathname.toLowerCase().endsWith(ext));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const acceptsHtml = request.headers.get("accept") || "";
  if (request.mode === "navigate" || acceptsHtml.includes("text/html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isImageRequest(url, request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
