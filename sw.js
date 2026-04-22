const CACHE_NAME = 'sapu-temuan-v4';

// Daftar file yang akan disimpan di memori HP agar loading cepat & bisa offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

// 1. Saat pertama kali diinstal, simpan semua file penting di atas ke dalam Cache (Memori)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Saat aplikasi mencari data/file, cek dulu di Cache. Jika ada, pakai yang di Cache biar cepat.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ditemukan di cache, kembalikan file tersebut
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, ambil dari internet (Server GitHub/Google)
        return fetch(event.request);
      })
  );
});

// 3. Membersihkan Cache lama jika ada versi baru (Update Aplikasi)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
