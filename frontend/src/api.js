export const API = 'https://inventario-ws0v.onrender.com/api/productos';

export async function fetchJson(url, opts = {}) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`HTTP ${res.status} — ${text}`);
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}
