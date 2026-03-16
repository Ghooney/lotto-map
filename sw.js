// 🍀 로또명당지도 Service Worker - v3
const CACHE_NAME = 'lotto-map-v3';

// 설치 즉시 활성화
self.addEventListener('install', () => self.skipWaiting());

// 활성화: 기존 캐시 전부 삭제 후 클라이언트 장악
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// fetch 가로채지 않음 - 브라우저 기본 동작 유지
// (다운로드 오작동 방지)
