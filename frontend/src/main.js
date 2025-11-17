import { fetchJson, API } from './api.js';
import { showAlert } from './utils.js';
import { renderTabla } from './table.js';

const tabla = document.getElementById('tablaProductos');
const form = document.getElementById('formProducto');
const idProductoInput = document.getElementById('idProducto');
const nombreInput = document.getElementById('nombre');
const cantidadInput = document.getElementById('cantidad');
const categoriaInput = document.getElementById('categoria');
const descripcionInput = document.getElementById('descripcion');

const buscarId = document.getElementById('buscarId');
const buscarNombre = document.getElementById('buscarNombre');
const buscarCategoria = document.getElementById('buscarCategoria');

let productos = [];

async function cargar() {
  try {
    const datos = await fetchJson(API);
    productos = Array.isArray(datos) ? datos : [];
    renderTabla(productos, tabla, cargar);
  } catch (err) {
    showAlert('Error cargando datos.', 'danger');
    console.error(err);
  }
}

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
    cargar();
  } catch (err) {
    showAlert('Error al agregar producto.', 'danger');
  }
});

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

buscarId.addEventListener('input', filtrar);
buscarNombre.addEventListener('input', filtrar);
buscarCategoria.addEventListener('change', filtrar);

cargar();
