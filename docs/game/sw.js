const CACHE_NAME = 'xiaoxiao-party-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/game.js',
    '/font.ttf',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/background-music.mp3',
    '/match.mp3',
    '/error.mp3',
    '/ding.mp3',
    '/gameover.mp3'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}); 