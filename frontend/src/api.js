const API = 'https://inventario-ws0v.onrender.com/api/productos';

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

export async function getProductos() { return fetchJson(API); }
export async function crearProducto(payload) { return fetchJson(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) }); }
export async function actualizarProducto(id, payload) { return fetchJson(`${API}/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) }); }
export async function eliminarProducto(id) { return fetchJson(`${API}/${id}`, { method: 'DELETE' }); }
