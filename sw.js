const CACHE_PREFIX = "citronex-siechnice-training-";
const CACHE_NAME = CACHE_PREFIX + "2026-07-01-06";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./stage-location.css",
  "./stage-location.js",
  "./terminology-fix.js",
  "./assets/logo-citronex.svg"
];

// Images are cached only when opened by the user.
// This prevents slow phones from freezing during first page load.
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
const TERMINOLOGY_SCRIPT_TAG = '<script src="./terminology-fix.js?v=2026-07-01-06" defer></script>';

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

async function addTerminologyFix(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let text = await response.text();
  if (!text.includes("terminology-fix.js")) {
    text = text.replace("</body>", TERMINOLOGY_SCRIPT_TAG + "</body>");
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const finalResponse = await addTerminologyFix(response);
    await putInCache(request, finalResponse);
    return finalResponse.clone();
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
  return response.clone();
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
