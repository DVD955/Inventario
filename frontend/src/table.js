import { formatCell, showAlert } from './utils.js';
import { fetchJson, API } from './api.js';
import { crearModalEditar } from './modal.js';

export function renderTabla(list, tabla, cargar) {
  tabla.innerHTML = '';
  list.forEach((p, idx) => {
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
    tabla.appendChild(tr);
  });

  // Attaching events to the buttons after rendering
  tabla.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      const action = btn.dataset.action;
      const tr = btn.closest('tr');
      const idx = Number(tr.dataset.idx);
      const producto = list[idx];
      const backendId = tr.dataset.backendId;

      if (action === 'ver') {
        document.getElementById('verId').textContent = producto.idProducto;
        document.getElementById('verNombre').textContent = producto.nombre;
        document.getElementById('verCantidad').textContent = producto.cantidad;
        document.getElementById('verCategoria').textContent = producto.categoria;
        document.getElementById('verDescripcion').textContent = producto.descripcion || 'Sin descripción';
        new bootstrap.Modal(document.getElementById('modalVer')).show();
        return;
      }

      if (action === 'editar') {
        crearModalEditar(producto, backendId, cargar);
        return;
      }

      if (action === 'eliminar') {
        if (!confirm("¿Seguro que deseas eliminarlo?")) return;
        try {
          await fetchJson(`${API}/${backendId}`, { method: 'DELETE' });
          showAlert("Producto eliminado.", "danger");
          cargar();
        } catch (err) {
          showAlert("Error al eliminar.", "danger");
        }
      }
    });
  });
}
