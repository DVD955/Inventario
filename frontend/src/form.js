import { fetchJson, API } from './api.js';
import { showAlert } from './utils.js';

/**
 * Inicializa la lógica del formulario de creación.
 * @param {HTMLFormElement} formElement - El elemento <form> del DOM.
 * @param {Function} onSuccess - Función que se ejecutará si el producto se guarda bien (ej: recargar la tabla).
 */
export function setupFormProducto(formElement, onSuccess) {
  
  // 1. Referencias a los campos (inputs) dentro del formulario
  const idProductoInput = formElement.querySelector('#idProducto');
  const nombreInput = formElement.querySelector('#nombre');
  const cantidadInput = formElement.querySelector('#cantidad');
  const categoriaInput = formElement.querySelector('#categoria');
  const descripcionInput = formElement.querySelector('#descripcion');

  // 2. Escuchamos el evento "submit" (cuando le dan al botón Guardar)
  formElement.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue sola

    // Preparamos los datos para enviar
    const payload = {
      idProducto: idProductoInput.value.trim(),
      nombre: nombreInput.value.trim(),
      cantidad: Number(cantidadInput.value.trim()),
      categoria: categoriaInput.value.trim(),
      descripcion: descripcionInput.value.trim()
    };

    try {
      // 3. Enviamos los datos al Backend (POST)
      await fetchJson(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 4. Si todo sale bien:
      showAlert('Producto agregado correctamente.', 'success');
      formElement.reset(); // Limpiamos los campos del formulario
      
      // Llamamos a la función que actualiza la tabla (si nos la pasaron)
      if (onSuccess) onSuccess(); 
      
    } catch (err) {
      // 5. Si algo falla:
      showAlert('Error al agregar producto.', 'danger');
      console.error(err);
    }
  });
}