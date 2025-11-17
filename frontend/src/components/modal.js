import { actualizarProducto } from '../api.js';
import { showAlert } from '../utils.js';

export function crearModalEditar(prod, backendId, alertContainer) {
  // Eliminar modal previo si existe
  const prev = document.getElementById('modalEditarDynamic');
  if (prev) prev.remove();

  // Crear modal nuevo
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
          <div class="mb-2"><label>ID</label><input id="e_id" class="form-control" value="${prod.idProducto}"></div>
          <div class="mb-2"><label>Nombre</label><input id="e_nombre" class="form-control" value="${prod.nombre}"></div>
          <div class="mb-2"><label>Cantidad</label><input id="e_cantidad" type="number" class="form-control" value="${prod.cantidad}"></div>
          <div class="mb-2"><label>Categoría</label><input id="e_categoria" class="form-control" value="${prod.categoria}"></div>
          <div class="mb-2"><label>Descripción</label><textarea id="e_descripcion" class="form-control">${prod.descripcion || ''}</textarea></div>
        </div>

        <div class="modal-footer">
          <button id="guardarModal" class="btn btn-success">Guardar</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalHTML);
  const modal = new bootstrap.Modal(modalHTML);
  modal.show();

  // Guardar cambios
  modalHTML.querySelector('#guardarModal').addEventListener('click', async () => {
    const payload = {
      idProducto: document.getElementById('e_id').value.trim(),
      nombre: document.getElementById('e_nombre').value.trim(),
      cantidad: Number(document.getElementById('e_cantidad').value),
      categoria: document.getElementById('e_categoria').value.trim(),
      descripcion: document.getElementById('e_descripcion').value.trim()
    };

    try {
      await actualizarProducto(backendId, payload);
      showAlert(alertContainer, "Producto actualizado correctamente.", "info");
      modal.hide();
      location.reload(); // o llamar a cargar() si lo manejas desde main.js
    } catch (err) {
      showAlert(alertContainer, "Error al actualizar.", "danger");
      console.error(err);
    }
  });

  modalHTML.addEventListener('hidden.bs.modal', () => modalHTML.remove());
}
