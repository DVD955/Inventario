export function crearModalVer(producto) {
  const prev = document.getElementById('modalVerDynamic');
  if (prev) prev.remove();

  const modalHTML = document.createElement('div');
  modalHTML.id = 'modalVerDynamic';
  modalHTML.className = 'modal fade';
  modalHTML.tabIndex = -1;

  modalHTML.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <h5 class="text-center mb-3">Detalles del Producto</h5>
        <p><strong>ID:</strong> ${producto.idProducto}</p>
        <p><strong>Nombre:</strong> ${producto.nombre}</p>
        <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
        <p><strong>Categoría:</strong> ${producto.categoria}</p>
        <p><strong>Descripción:</strong> ${producto.descripcion || 'Sin descripción'}</p>
        <div class="text-center mt-3">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalHTML);
  const modal = new bootstrap.Modal(modalHTML);
  modal.show();

  modalHTML.addEventListener('hidden.bs.modal', () => modalHTML.remove());
}
