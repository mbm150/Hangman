const cacheName = 'hangman-v8';
const assets = [
    '/',
    '/index.html',
    '/views/add_word.html',
    '/views/categories.html',
    '/views/controls.html',
    '/views/game.html',
    '/views/options.html',
    '/styles/main.css',
    '/styles/fonts/roboto_regular.ttf',
    '/libs/angular-animate.min.js',
    '/libs/angular-resource.min.js',
    '/libs/angular-route.min.js',
    '/libs/angular.min.js',
    '/libs/jquery.min.js',
    '/javascripts/main.js',
    '/data/en/categories.json',
    '/data/en/letters.json',
    '/data/en/texts.json',
    '/data/en/words.json',
    '/data/es/categories.json',
    '/data/es/letters.json',
    '/data/es/texts.json',
    '/data/es/words.json',
    '/images/96x96.png',
    '/images/add-white-18dp.svg',
    '/images/arrow_back-white-18dp.svg',
    '/images/delete-white-18dp.svg',
    '/images/keyboard-white-18dp.svg',
    '/images/refresh-white-18dp.svg',
    '/images/save-white-18dp.svg',
    '/images/settings-white-18dp.svg',
    '/images/categories/badge-white-48dp.svg',
    '/images/categories/catching_pokemon-white-48dp.svg',
    '/images/categories/flag-white-48dp.svg',
    '/images/categories/local_florist-white-48dp.svg',
    '/images/categories/location_city-white-48dp.svg',
    '/images/categories/mic-white-48dp.svg',
    '/images/categories/movie-white-48dp.svg',
    '/images/categories/park-white-48dp.svg',
    '/images/categories/person-white-48dp.svg',
    '/images/categories/pets-white-48dp.svg',
    '/images/categories/shuffle-white-48dp.svg',
    '/images/categories/spellcheck-white-48dp.svg',
    '/images/game/g_f1.png',
    '/images/game/g_f2.png',
    '/images/game/g_f3.png',
    '/images/game/g_f4.png',
    '/images/game/g_f5.png',
    '/images/game/g_f6.png',
    '/images/game/g_f7.png',
    '/images/game/g_f8.png',
    '/images/game/g_f9.png',
    '/images/game/g_f10.png',
    '/images/game/g_f11.png',
    '/images/game/g_f12.png'
];
//install
self.addEventListener('install', evt => {
    //console.log('Instalado');
    evt.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(assets);
        })
    );
});
//activate
self.addEventListener('activate', evt => {
    //console.log('Activado');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== cacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});
//fetch
self.addEventListener('fetch', evt => {
    //console.log('Cazado', evt);
    evt.respondWith(
         caches.match(evt.request).then(cacheRes => {
             return cacheRes || fetch(evt.request);
         })
    );
});