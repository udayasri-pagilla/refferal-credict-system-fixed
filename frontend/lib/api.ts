const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/';

export async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(API_BASE + path, opts);
  const json = await res.json().catch(() => null);
  if (!res.ok) throw json || { message: 'Request failed' };
  return json;
}

export function authHeaders(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
