import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_PREFIX = 'cm-cache:';

interface CacheEntry {
  storedAt: number;
  body: unknown;
}

// Requests carrying this header bypass the cache, so a manual refresh can force fresh data.
export const SKIP_CACHE_HEADER = 'X-Skip-Cache';

export const httpCacheInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.method !== 'GET') {
    return next(request);
  }

  if (request.headers.has(SKIP_CACHE_HEADER)) {
    return next(request.clone({ headers: request.headers.delete(SKIP_CACHE_HEADER) }));
  }

  const key = CACHE_PREFIX + request.urlWithParams;
  const cached = readCache(key);

  if (cached) {
    return of(new HttpResponse({ body: cached, status: 200 }) as HttpEvent<unknown>);
  }

  return next(request).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        writeCache(key, event.body);
      }
    }),
  );
};

function readCache(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    const entry = JSON.parse(raw) as CacheEntry;

    if (Date.now() - entry.storedAt > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.body;
  } catch {
    return null;
  }
}

function writeCache(key: string, body: unknown): void {
  const entry: CacheEntry = { storedAt: Date.now(), body };

  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Storage full or unavailable (private browsing): serving uncached data is fine.
  }
}
