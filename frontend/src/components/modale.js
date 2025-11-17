export function crearModalVer(prod) {
  const prev = document.getElementById('modalVerDynamic');
  if (prev) prev.remove();

  const modalHTML = document.createElement('div');
  modalHTML.id = 'modalVerDynamic';
  modalHTML.className = 'modal fade';
  modalHTML.tabIndex = -1;

  modalHTML.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <div class="modal-header">
          <h5 class="modal-title">Ver Producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <p><b>ID:</b> ${prod.idProducto}</p>
          <p><b>Nombre:</b> ${prod.nombre}</p>
          <p><b>Cantidad:</b> ${prod.cantidad}</p>
          <p><b>Categoría:</b> ${prod.categoria}</p>
          <p><b>Descripción:</b> ${prod.descripcion || 'Sin descripción'}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalHTML);
  new bootstrap.Modal(modalHTML).show();
  modalHTML.addEventListener('hidden.bs.modal', () => modalHTML.remove());
}
