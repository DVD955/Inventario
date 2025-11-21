import { fetchJson, API } from './api.js';
import { showAlert } from './utils.js';

export function crearModalEditar(prod, backendId, cargar) {
  const prev = document.getElementById('modalEditarDynamic');
  if (prev) prev.remove();

  const modalHTML = document.createElement('div');
  modalHTML.id = 'modalEditarDynamic';
  modalHTML.className = 'modal fade';
  modalHTML.tabIndex = -1;

  modalHTML.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <div class="modal-header">
          <h5 class="modal-title">Editar Producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div class="mb-2">
            <label>ID (No editable)</label>
            <input 
              id="e_id" 
              class="form-control" 
              value="${prod.idProducto}" 
              disabled 
              readonly
              style="background-color: #e9ecef; cursor: not-allowed;"
            >
          </div>

          <div class="mb-2"><label>Nombre</label><input id="e_nombre" class="form-control" value="${prod.nombre}"></div>
          <div class="mb-2"><label>Cantidad</label><input id="e_cantidad" type="number" class="form-control" value="${prod.cantidad}"></div>
          <div class="mb-2"><label>Categoría</label><input id="e_categoria" class="form-control" value="${prod.categoria}"></div>
          <div class="mb-2"><label>Descripción</label><textarea id="e_descripcion" class="form-control">${prod.descripcion || ''}</textarea></div>
        </div>

        <div class="modal-footer">
          <button id="guardarModal" class="btn btn-success">Actualizar</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalHTML);
  const modal = new bootstrap.Modal(modalHTML);
  modal.show();

  modalHTML.querySelector('#guardarModal').addEventListener('click', async () => {
    const payload = {
      // Aunque enviemos el ID, el backend lo ignorará gracias a la protección que pusimos antes
      idProducto: document.getElementById('e_id').value.trim(),
      nombre: document.getElementById('e_nombre').value.trim(),
      cantidad: Number(document.getElementById('e_cantidad').value),
      categoria: document.getElementById('e_categoria').value.trim(),
      descripcion: document.getElementById('e_descripcion').value.trim()
    };

    try {
      await fetchJson(`${API}/${backendId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      showAlert("Producto actualizado correctamente.", "info");
      modal.hide();
      // Esperamos un poco a que se cierre el modal para recargar
      setTimeout(() => cargar(), 300); 
    } catch (err) {
      showAlert("Error al actualizar.", "danger");
    }
  });

  modalHTML.addEventListener('hidden.bs.modal', () => modalHTML.remove());
}