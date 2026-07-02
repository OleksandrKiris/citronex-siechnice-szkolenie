const CACHE_PREFIX = "citronex-siechnice-training-";
const CACHE_NAME = CACHE_PREFIX + "2026-07-01-04";

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

const VIEW_STABILIZER_STYLE = `
<style id="citronex-view-stabilizer-style">
  html { scroll-behavior: auto !important; }
  body,
  .app,
  .section,
  .card,
  .appModeHero,
  .firstDayHelper,
  .firstDayPanel,
  .guideCard,
  .placeCard,
  #stagePhotos,
  #warehousePhotos {
    overflow-anchor: none !important;
  }
  .stage,
  .company,
  .modebtn,
  .readerBtn,
  .liteBtn,
  .placeBtn,
  [data-stage],
  [data-company],
  [data-mode],
  [data-reader],
  [data-place] {
    scroll-margin-top: 128px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  .guidePill,
  .firstDayOpen,
  .fullToggle,
  .guideActions button,
  .miniQuiz button {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  .visual img,
  .training-image,
  .warehousePhotoGrid img,
  .orientationCard img {
    aspect-ratio: 4 / 3;
    height: auto;
    contain-intrinsic-size: 520px 390px;
  }
</style>`;

const VIEW_STABILIZER_SCRIPT = `
<script id="citronex-view-stabilizer-script">
(function () {
  if (window.__citronexViewStabilizerInstalled) return;
  window.__citronexViewStabilizerInstalled = true;

  // Main big tiles only. Do not stabilize top guide tabs such as Start/Map/Reader,
  // because those tabs can replace content height and over-correct the scroll.
  var STABLE_TILE_SELECTOR = [
    '.stage',
    '.company',
    '.modebtn',
    '.readerBtn',
    '.liteBtn',
    '.placeBtn',
    '[data-stage]',
    '[data-company]',
    '[data-mode]',
    '[data-reader]',
    '[data-place]'
  ].join(',');

  var TOP_TAB_SELECTOR = [
    '.guidePill',
    '.firstDayOpen',
    '.fullToggle',
    '.guideActions button',
    '.miniQuiz button',
    'a[href="#"]'
  ].join(',');

  function maxScrollTop() {
    var doc = document.documentElement;
    return Math.max(0, doc.scrollHeight - window.innerHeight);
  }

  function keepTileStable(tile) {
    if (!tile || !tile.getBoundingClientRect) return;

    var beforeTop = tile.getBoundingClientRect().top;
    var beforeScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    var beforeMax = maxScrollTop();

    setTimeout(function () {
      if (tile.blur) tile.blur();
    }, 0);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!tile.isConnected) return;

        var afterTop = tile.getBoundingClientRect().top;
        var delta = afterTop - beforeTop;
        var afterMax = maxScrollTop();

        // Guard: if a view changed a lot, do not jump to the bottom/blank page.
        if (Math.abs(delta) < 3 || Math.abs(delta) > 280) return;
        if (afterMax < beforeMax - 280) return;

        var nextTop = Math.max(0, Math.min(afterMax, beforeScroll + delta));
        window.scrollTo({ top: nextTop, behavior: 'auto' });
      });
    });
  }

  document.addEventListener('click', function (event) {
    var topTab = event.target && event.target.closest ? event.target.closest(TOP_TAB_SELECTOR) : null;
    if (topTab) {
      if (topTab.matches && topTab.matches('a[href="#"]')) {
        event.preventDefault();
      }
      setTimeout(function () {
        if (topTab.blur) topTab.blur();
      }, 0);
      return;
    }

    var target = event.target && event.target.closest ? event.target.closest(STABLE_TILE_SELECTOR) : null;
    if (!target) return;
    keepTileStable(target);
  }, true);
})();
</script>`;

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

async function patchHtmlResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let text = await response.text();
  if (!text.includes("citronex-view-stabilizer-script")) {
    text = text.replace("</head>", VIEW_STABILIZER_STYLE + "</head>");
    text = text.replace("</body>", VIEW_STABILIZER_SCRIPT + "</body>");
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
    const finalResponse = await patchHtmlResponse(response);
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
