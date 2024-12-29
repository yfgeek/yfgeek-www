const CACHE_NAME = 'xiaoxiao-party-v1';
const urlsToCache = [
    '/game/',
    '/game/index.html',
    '/game/css/style.css',
    '/game/css/all.min.css',
    '/game/js/game.js',
    '/game/webfonts/font.ttf',
    '/game/favicon.png',
    '/game/webfonts/fa-solid-900.woff2',
    '/game/webfonts/fa-solid-900.woff',
    '/game/webfonts/fa-solid-900.ttf',
    '/game/audio/background-music.mp3',
    '/game/audio/match.mp3',
    '/game/audio/error.mp3',
    '/game/audio/ding.mp3',
    '/game/audio/gameover.mp3'
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