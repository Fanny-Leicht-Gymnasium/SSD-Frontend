const CACHE_PREFIX = 'ssd-api-cache:';
const LAST_UPDATE_KEY = 'ssd-api-last-update';
const MAX_CACHE_ENTRIES = 12;
const MAX_ENTRY_BYTES = 500_000;

function userKey(token) {
  const storedUser = localStorage.getItem('me');
  let identity = token;

  try {
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user?.userid !== undefined && user?.userid !== null) {
      identity = `user:${user.userid}`;
    }
  } catch (error) {
    console.warn('Failed to read cached user identity:', error);
  }

  let hash = 0;

  for (let index = 0; index < identity.length; index += 1) {
    hash = ((hash << 5) - hash) + identity.charCodeAt(index);
    hash |= 0;
  }

  return String(hash);
}

function cacheKey(logicalKey, token) {
  return `${CACHE_PREFIX}${userKey(token || 'anonymous')}:${logicalKey}`;
}

export function readCachedData(logicalKey, token = localStorage.getItem('jwt')) {
  const cached = localStorage.getItem(cacheKey(logicalKey, token));

  if (!cached) {
    return null;
  }

  try {
    const parsed = JSON.parse(cached);

    // Accept entries written by the previous cache format.
    return parsed?.data === undefined
      ? { data: parsed, updatedAt: getLastCachedUpdate() }
      : parsed;
  } catch (error) {
    console.error('Failed to read offline element cache:', error);
    localStorage.removeItem(cacheKey(logicalKey, token));
    return null;
  }
}

export function readLatestCachedData(logicalPrefix, token = localStorage.getItem('jwt')) {
  const prefix = `${CACHE_PREFIX}${userKey(token || 'anonymous')}:${logicalPrefix}`;
  const entries = Object.keys(localStorage)
    .filter(key => key.startsWith(prefix))
    .map(key => {
      try {
        const parsed = JSON.parse(localStorage.getItem(key));
        return {
          value: parsed?.data === undefined
            ? { data: parsed, updatedAt: getLastCachedUpdate() }
            : parsed,
          key
        };
      } catch {
        localStorage.removeItem(key);
        return null;
      }
    })
    .filter(Boolean)
    .sort((left, right) =>
      String(right.value.updatedAt || '').localeCompare(String(left.value.updatedAt || ''))
    );

  return entries[0]?.value || null;
}

export function writeCachedData(logicalKey, data, token = localStorage.getItem('jwt')) {
  const updatedAt = new Date().toISOString();
  const key = cacheKey(logicalKey, token);
  const value = JSON.stringify({ data, updatedAt });

  if (value.length > MAX_ENTRY_BYTES) {
    console.warn('Skipping offline cache entry larger than 500 KB:', logicalKey);
    return;
  }

  localStorage.setItem(key, value);
  localStorage.setItem(LAST_UPDATE_KEY, updatedAt);
  trimCache();
  window.dispatchEvent(new CustomEvent('offline-cache-updated', {
    detail: { updatedAt }
  }));
}

function trimCache() {
  const entries = Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .map(key => {
      try {
        return { key, updatedAt: JSON.parse(localStorage.getItem(key)).updatedAt };
      } catch {
        return { key, updatedAt: '' };
      }
    })
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  entries.slice(MAX_CACHE_ENTRIES).forEach(entry => localStorage.removeItem(entry.key));
}

export function getLastCachedUpdate() {
  return localStorage.getItem(LAST_UPDATE_KEY);
}

export function setOfflineMode(isOffline, updatedAt = getLastCachedUpdate()) {
  document.documentElement.toggleAttribute('data-offline-mode', isOffline);
  window.dispatchEvent(new CustomEvent('offline-mode-changed', {
    detail: { isOffline, updatedAt }
  }));
}
