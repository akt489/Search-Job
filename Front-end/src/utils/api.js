const configuredApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export const API_BASE = configuredApiUrl
  ? configuredApiUrl.endsWith('/api')
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : '/api';

export async function safeJson(response, fallback = {}) {
  const body = await response.text();

  if (!body) return fallback;

  try {
    return JSON.parse(body);
  } catch {
    return fallback;
  }
}

export async function requestJson(url, options = {}, fallback = {}) {
  const response = await fetch(url, options);
  const data = await safeJson(response, fallback);
  return { response, data };
}
