import { crearModalEditar } from './modal.js';
import { fetchJson, eliminarProducto } from '../api.js';
import { showAlert, formatCell } from '../utils.js';

export function renderTabla(tablaEl, productos, alertContainer) {
  tablaEl.innerHTML = '';
  productos.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.dataset.idx = idx;
    tr.dataset.backendId = p._id || '';
    tr.innerHTML = `
      <td>${formatCell(p.idProducto)}</td>
      <td>${formatCell(p.nombre)}</td>
      <td>${formatCell(p.cantidad)}</td>
      <td>${formatCell(p.categoria)}</td>
      <td>
        <button class="btn btn-info btn-sm me-1" data-action="ver">Ver</button>
        <button class="btn btn-warning btn-sm me-1" data-action="editar">Editar</button>
        <button class="btn btn-danger btn-sm" data-action="eliminar">Eliminar</button>
      </td>
    `;
    tablaEl.appendChild(tr);
  });
}

export function initTabla(tablaEl, productos, alertContainer, verProductoCallback) {
  tablaEl.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;

    const action = btn.dataset.action;
    const tr = btn.closest('tr');
    const idx = Number(tr.dataset.idx);
    const producto = productos[idx];
    const backendId = tr.dataset.backendId;

    if (action === 'ver') {
      verProductoCallback(producto);
      return;
    }

    if (action === 'editar') {
      crearModalEditar(producto, backendId, alertContainer);
      return;
    }

    if (action === 'eliminar') {
      if (!confirm("¿Seguro que deseas eliminarlo?")) return;
      try {
        await eliminarProducto(backendId);
        showAlert(alertContainer, "Producto eliminado.", "danger");
      } catch (err) {
        showAlert(alertContainer, "Error al eliminar.", "danger");
      }
    }
  });
}
