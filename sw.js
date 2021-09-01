const staticCacheName = 'site-static-v2';
const assets = [
	'/',
	'/index.html',
	'/js/cellular-display.js',
	'/js/main.js',
	'/js/modal.js',
	'/js/pattern.js',
	'/js/rule-classifications.js',
	'/js/rule-display.js',
	'/css/dark.css',
	'/css/loader.css',
	'/css/modal.css',
	'/css/styles.css',
	'/img/rule39.png',
	'/img/check.svg',
	'/img/check-white.svg',
	'https://code.jquery.com/jquery-3.5.1.slim.min.js',
];

// install event
self.addEventListener('install', (evt) => {
	console.log('service worker installed');
	evt.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			console.log('caching shell assets');
			cache.addAll(assets);
		})
	);
});

// activate event
self.addEventListener('activate', (evt) => {
	console.log('service worker activated');
	evt.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys
					.filter((key) => key !== staticCacheName)
					.map((key) => caches.delete(key))
			);
		})
	);
});

// fetch event
self.addEventListener('fetch', (evt) => {
	// console.log('fetch event', evt);
	evt.respondWith(
		caches.match(evt.request).then((cacheRes) => {
			return cacheRes || fetch(evt.request);
		})
	);
});
