import { showAlert } from '../utils.js';
import { fetchJson, API } from '../api.js';

export function initForm(form, recargar) {
  const idProductoInput = form.querySelector('#idProducto');
  const nombreInput = form.querySelector('#nombre');
  const cantidadInput = form.querySelector('#cantidad');
  const categoriaInput = form.querySelector('#categoria');
  const descripcionInput = form.querySelector('#descripcion');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      idProducto: idProductoInput.value.trim(),
      nombre: nombreInput.value.trim(),
      cantidad: Number(cantidadInput.value.trim()),
      categoria: categoriaInput.value.trim(),
      descripcion: descripcionInput.value.trim()
    };

    try {
      await fetchJson(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showAlert('Producto agregado correctamente.', 'success');
      form.reset();
      recargar();
    } catch (err) {
      showAlert('Error al agregar producto.', 'danger');
      console.error(err);
    }
  });
}
