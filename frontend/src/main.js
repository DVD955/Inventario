
import { getProductos } from './api.js';
import { renderTabla, initTabla } from './components/table.js';
import { showAlert } from './utils.js';
import { crearModalVer } from './components/modale.js';

const tabla = document.getElementById('tablaProductos');
const alertContainer = document.getElementById('alertContainer');

let productos = [];

async function cargar() {
  try {
    productos = await getProductos();
    renderTabla(tabla, productos);
  } catch {
    showAlert(alertContainer, 'Error cargando datos.', 'danger');
  }
}

initTabla(tabla, productos, alertContainer, crearModalVer);

cargar();
