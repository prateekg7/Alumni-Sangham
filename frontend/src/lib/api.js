const ACCESS_TOKEN_KEY = 'alumni-sangham-access-token';

export function getApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (raw === undefined || raw === '') {
    return '';
  }
  return String(raw).replace(/\/$/, '');
}

export function getAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token) {
  if (typeof window === 'undefined') {
    return;
  }
  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function clearSession() {
  setAccessToken(null);
}

async function parseJson(res) {
  const text = await res.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }
  refreshPromise = (async () => {
    const base = getApiBase();
    const res = await fetch(`${base}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await parseJson(res);
    if (!res.ok || !json?.data?.accessToken) {
      clearSession();
      return null;
    }
    setAccessToken(json.data.accessToken);
    return json.data.accessToken;
  })();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function apiRequest(path, options = {}, retry = true) {
  const base = getApiBase();
  const url = path.startsWith('http') ? path : `${base}${path}`;
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  const token = getAccessToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const skipRefresh =
    path === '/api/auth/refresh' ||
    path === '/api/auth/login' ||
    path.startsWith('/api/auth/register/');
  if (res.status === 401 && retry && !skipRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiRequest(path, options, false);
    }
  }

  const json = await parseJson(res);
  if (!res.ok) {
    const message = json?.message || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    if (json?.errors) {
      err.errors = json.errors;
    }
    throw err;
  }

  return json?.data;
}

export async function loginRequest({ email, password, expectedRole }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, expectedRole }),
  });
}

export async function registerRequest(role, body) {
  return apiRequest(`/api/auth/register/${role}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function fetchSession() {
  return apiRequest('/api/auth/me');
}

export async function logoutRequest() {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } finally {
    clearSession();
  }
}

export async function fetchDirectory() {
  return apiRequest('/api/directory');
}

export async function fetchPublicProfile(profileKey) {
  return apiRequest(`/api/profiles/public/${encodeURIComponent(profileKey)}`);
}

export async function fetchMyProfile() {
  return apiRequest('/api/profiles/me');
}

export async function patchMyProfile(payload) {
  return apiRequest('/api/profiles/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/** Absolute URL for uploaded assets (works with empty API base + Vite `/uploads` proxy). */
export function resolvePublicAssetUrl(path) {
  if (!path) {
    return '';
  }
  if (path.startsWith('http')) {
    return path;
  }
  const base = getApiBase();
  return base ? `${base}${path}` : path;
}

export async function patchUser(userId, payload) {
  return apiRequest(`/api/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function uploadResume(file) {
  const base = getApiBase();
  const url = `${base}/api/profiles/me/resume`;
  const form = new FormData();
  form.append('resume', file);
  const headers = new Headers();
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: form,
    credentials: 'include',
  });
  const text = await res.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      /* ignore */
    }
  }
  if (!res.ok) {
    const message = json?.message || res.statusText || 'Upload failed';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return json?.data;
}

export async function fetchDiscussionFeed() {
  return apiRequest('/api/posts/feed/discussions');
}

export async function createDiscussionPost(body) {
  return apiRequest('/api/posts/discussions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function fetchReferralBoard() {
  return apiRequest('/api/referrals/board');
}

export async function createReferralRequest(body) {
  return apiRequest('/api/referrals', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
