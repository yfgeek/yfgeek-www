const CACHE_NAME = 'xiaoxiao-party-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './css/all.min.css',
    './js/game.js',
    './webfonts/font.ttf',
    './favicon.png',
    './webfonts/fa-solid-900.woff2',
    './webfonts/fa-solid-900.woff',
    './webfonts/fa-solid-900.ttf',
    './audio/background-music.mp3',
    './audio/match.mp3',
    './audio/error.mp3',
    './audio/ding.mp3',
    './audio/gameover.mp3'
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