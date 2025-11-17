import { crearProducto } from '../api.js';
import { showAlert } from '../utils.js';

// Inicialización del formulario
export function initForm(formEl, alertContainer, callbackCargar) {
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener datos del formulario
    const payload = {
      idProducto: formEl.querySelector('#idProducto').value.trim(),
      nombre: formEl.querySelector('#nombre').value.trim(),
      cantidad: Number(formEl.querySelector('#cantidad').value.trim()),
      categoria: formEl.querySelector('#categoria').value.trim(),
      descripcion: formEl.querySelector('#descripcion').value.trim()
    };

    try {
      await crearProducto(payload);
      showAlert(alertContainer, 'Producto agregado correctamente.', 'success');
      formEl.reset();
      if (callbackCargar) callbackCargar(); // recarga la tabla
    } catch (err) {
      showAlert(alertContainer, 'Error al agregar producto.', 'danger');
      console.error(err);
    }
  });
}
