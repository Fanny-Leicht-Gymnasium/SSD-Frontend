const CACHE_NAME = 'ssd-frontend-v2';
const CACHE_MANIFEST = '/__cache-manifest';

let cacheManifest = new Set();

function toCacheKey(url) {
    return new URL(url, self.location.origin).href;
}

self.addEventListener('install', (event) => {
    event.waitUntil(installCache());
    self.skipWaiting();
});

async function installCache() {
    const cache = await caches.open(CACHE_NAME);

    const response = await fetch(CACHE_MANIFEST, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch cache manifest: ${response.status}`
        );
    }

    const files = await response.json();

    cacheManifest = new Set(
        files.map((url) => toCacheKey(url))
    );

    await Promise.allSettled(
        files.map(async (url) => {
            try {
                const absoluteUrl = toCacheKey(url);
                const response = await fetch(absoluteUrl, {
                    cache: 'no-cache'
                });

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status} ${response.statusText}`
                    );
                }

                await cache.put(absoluteUrl, response.clone());

                // console.log('[SW] Cached:', absoluteUrl);
            } catch (error) {
                console.error('[SW] Failed:', url, error);
                throw error;
            }
        })
    );
}

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();

            await Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );

            await self.clients.claim();
        })()
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    // Only handle requests belonging to the Service Worker's own origin.
    if (url.origin !== self.location.origin) {
        return;
    }

    const isStyleRequest =
        request.destination === 'style' ||
        url.pathname.startsWith('/assets/css/customElement/');

    /*
     * HTML pages
     */
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigation(request));
        return;
    }

    if (isStyleRequest) {
        event.respondWith(handleStyleRequest(request));
        return;
    }

    /*
     * CSS, JS, images, fonts, etc.
     */
    event.respondWith(handleAsset(request));
});


async function handleNavigation(request) {
    const url = new URL(request.url);

    let cachePath = url.pathname;

    if (cachePath.endsWith('/')) {
        cachePath += 'index.html';
    }

    const cacheKey = toCacheKey(cachePath);
    const cache = await caches.open(CACHE_NAME);

    try {
        const response = await fetch(request);

        if (response.ok) {
            if (response.ok && cacheManifest.has(cacheKey)) {
                await cache.put(cacheKey, response.clone());
            }
        }

        return response;
    } catch (error) {
        console.warn('[SW] Navigation network failed:', request.url);

        const cached = await cache.match(cacheKey);

        if (cached) {
            // console.log('[SW] Navigation CACHE HIT:', cacheKey);
            return cached;
        }

        console.warn('[SW] Navigation CACHE MISS:', cacheKey);

        return new Response('Offline - page not cached', {
            status: 503,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}

async function handleStyleRequest(request) {
    const cacheKey = toCacheKey(request.url);
    const cached = await caches.match(cacheKey);

    if (cached) {
        // console.log('[SW] STYLE HIT:', new URL(request.url).pathname);
        return cached;
    }

    try {
        const response = await fetch(request);

        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            if (response.ok && cacheManifest.has(cacheKey)) {
                await cache.put(cacheKey, response.clone());
            }
        }

        return response;
    } catch (error) {
        console.error('[SW] Style failed:', new URL(request.url).pathname, error);
        return new Response('/* empty stylesheet fallback */', {
            status: 200,
            headers: { 'Content-Type': 'text/css' }
        });
    }
}

async function handleAsset(request) {
    const cacheKey = toCacheKey(request.url);
    const cached = await caches.match(cacheKey);

    if (cached) {
        // console.log('[SW] CACHE HIT:', new URL(request.url).pathname);
        return cached;
    }

    // console.log('[SW] CACHE MISS:', new URL(request.url).pathname);

    try {
        const response = await fetch(request);

        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            if (response.ok && cacheManifest.has(cacheKey)) {
                await cache.put(cacheKey, response.clone());
            }
        }

        return response;
    } catch (error) {
        console.error('[SW] Asset failed:', new URL(request.url).pathname, error);

        return new Response('', {
            status: 503
        });
    }
}


