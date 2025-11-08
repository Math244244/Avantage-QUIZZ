// ✅ CORRECTION SECTION 8 : Gestion Offline Complète - Version mise à jour
const CACHE_VERSION = '2025-11-08-v2.0.5-offline';
const STATIC_CACHE = `avantage-quizz-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `avantage-quizz-dynamic-${CACHE_VERSION}`;
const API_CACHE = `avantage-quizz-api-${CACHE_VERSION}`;
const QUESTIONS_CACHE = `avantage-quizz-questions-${CACHE_VERSION}`;

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/results.html',
  '/resources.html',
  '/service-worker.js'
];

const ASSET_PATH_PREFIXES = ['/assets/', '/css/', '/icons/'];

const IMMUTABLE_REQUESTS = [
  new Request('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', { mode: 'no-cors' })
];

const CORE_ASSET_SET = new Set(CORE_ASSETS);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(CORE_ASSETS);

    for (const request of IMMUTABLE_REQUESTS) {
      try {
        await cache.add(request);
      } catch (error) {
        // Ignore immutable asset failures (e.g., offline during install)
      }
    }

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    const deletions = cacheNames
      .filter((name) => ![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, QUESTIONS_CACHE].includes(name))
      .map((name) => caches.delete(name));

    await Promise.all(deletions);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Ignore chrome-extension and other non-http schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  if (url.origin === self.location.origin) {
    if (CORE_ASSET_SET.has(url.pathname)) {
      event.respondWith(cacheFirst(request));
      return;
    }

    if (ASSET_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
      event.respondWith(staleWhileRevalidate(request));
      return;
    }

    if (request.destination === 'document') {
      event.respondWith(networkFirst(request));
      return;
    }
  }

  // ✅ CORRECTION SECTION 8 : Cache des questions pour mode offline
  if (url.hostname.includes('firestore.googleapis.com') && url.pathname.includes('/documents')) {
    // Vérifier si c'est une requête de questions
    if (url.searchParams.get('collectionId') === 'questions' || url.pathname.includes('questions')) {
      event.respondWith(cacheQuestions(request));
      return;
    }
  }
  
  if (url.hostname.includes('firebaseio.com') || url.hostname.includes('firestore.googleapis.com')) {
    event.respondWith(networkFirstApi(request));
    return;
  }

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);
  const cache = await caches.open(STATIC_CACHE);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function networkFirstApi(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(API_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      // Only cache successful responses with valid URL schemes
      if (response.ok && response.url.startsWith('http')) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkPromise;
}

// ✅ CORRECTION SECTION 8 : Cache des questions pour mode offline
async function cacheQuestions(request) {
  const cache = await caches.open(QUESTIONS_CACHE);
  
  try {
    // Essayer d'abord le réseau
    const response = await fetch(request);
    
    if (response.ok) {
      // Mettre en cache pour usage offline
      cache.put(request, response.clone());
      return response;
    }
    
    // Si erreur réseau, essayer le cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw new Error('Network error and no cache');
  } catch (error) {
    // En cas d'erreur, retourner le cache si disponible
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}
