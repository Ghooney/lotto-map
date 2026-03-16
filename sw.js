// 🍀 로또명당지도 Service Worker
const CACHE_NAME = 'lotto-map-v2';

// 캐시할 핵심 파일들
const PRECACHE = [
  '/',
  '/index.html',
];

// ── 설치: 핵심 파일 선캐시 ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── 활성화: 구버전 캐시 삭제 ──
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── 네트워크 요청 처리 ──
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // 카카오맵 API / 외부 리소스는 항상 네트워크 우선
  if (
    url.hostname.includes('kakao') ||
    url.hostname.includes('dapi') ||
    url.hostname.includes('fonts.googleapis') ||
    url.hostname.includes('fonts.gstatic')
  ) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  // 그 외: 네트워크 우선 → 실패 시 캐시
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // 정상 응답이면 캐시에도 저장
        if (res && res.status === 200 && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
