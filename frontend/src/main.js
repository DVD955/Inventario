import { fetchJson, API } from './api.js';
import { showAlert } from './utils.js';
import { renderTabla } from './table.js';
import { setupFormProducto } from './form.js'; // <--- Importamos tu nuevo componente

// Referencias principales del DOM
const tabla = document.getElementById('tablaProductos');
const form = document.getElementById('formProducto');

// Referencias para los filtros
const buscarId = document.getElementById('buscarId');
const buscarNombre = document.getElementById('buscarNombre');
const buscarCategoria = document.getElementById('buscarCategoria');

// Estado local de la lista de productos
let productos = [];

/**
 * Función principal para cargar los datos desde el Backend
 */
async function cargar() {
  try {
    const datos = await fetchJson(API);
    // Aseguramos que sea un array antes de guardarlo
    productos = Array.isArray(datos) ? datos : [];
    
    // Renderizamos la tabla
    renderTabla(productos, tabla, cargar);
  } catch (err) {
    showAlert('Error cargando datos.', 'danger');
    console.error(err);
  }
}

/**
 * INICIALIZACIÓN DE COMPONENTES
 * Aquí conectamos el formulario con la lógica de recarga.
 * Cuando el formulario termine de guardar, ejecutará 'cargar()'.
 */
setupFormProducto(form, cargar);

/**
 * Lógica de filtrado en el cliente (Frontend)
 */
function filtrar() {
  const idF = buscarId.value.toLowerCase();
  const nomF = buscarNombre.value.toLowerCase();
  const catF = buscarCategoria.value;

  const filtrados = productos.filter(p =>
    p.idProducto.toLowerCase().includes(idF) &&
    p.nombre.toLowerCase().includes(nomF) &&
    (catF === '' || p.categoria === catF)
  );

  renderTabla(filtrados, tabla, cargar);
}

// Eventos para los filtros (búsqueda en tiempo real)
buscarId.addEventListener('input', filtrar);
buscarNombre.addEventListener('input', filtrar);
buscarCategoria.addEventListener('change', filtrar);

// Carga inicial al abrir la página
cargar();