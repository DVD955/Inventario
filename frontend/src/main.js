const API = 'https://inventario-ws0v.onrender.com/api/productos';

const tabla = document.getElementById('tablaProductos');
const form = document.getElementById('formProducto');
const idProductoInput = document.getElementById('idProducto');
const nombreInput = document.getElementById('nombre');
const cantidadInput = document.getElementById('cantidad');
const categoriaInput = document.getElementById('categoria');
const descripcionInput = document.getElementById('descripcion');

const alertContainer = document.getElementById('alertContainer');

const buscarId = document.getElementById('buscarId');
const buscarNombre = document.getElementById('buscarNombre');
const buscarCategoria = document.getElementById('buscarCategoria');

let productos = [];
let usandoBackend = true;

function showAlert(htmlText, tipo = 'success', tiempo = 3000) {
  alertContainer.innerHTML = '';
  const a = document.createElement('div');
  a.className = `alert alert-${tipo} alert-dismissible fade show`;
  a.style.maxWidth = '480px';
  a.style.margin = '0 auto 10px auto';
  a.innerHTML = `${htmlText}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  alertContainer.appendChild(a);
  if (tiempo > 0) setTimeout(() => a.remove(), tiempo);
}

async function fetchJson(url, opts = {}) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`HTTP ${res.status} — ${text}`);
    }
    return await res.json();
  } catch (err) {
    usandoBackend = false;
    throw err;
  }
}

function formatCell(v) { return (!v && v !== 0) ? '—' : String(v); }

function renderTabla(list = productos) {
  tabla.innerHTML = '';
  list.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.dataset.idx = idx;
    tr.dataset.backendId = p._id || '';
    tr.innerHTML = `
      <td>${formatCell(p.idProducto)}</td>
      <td>${formatCell(p.nombre)}</td>
      <td>${formatCell(p.cantidad)}</td>
      <td>${formatCell(p.categoria)}</td>
      <td>
        <button class="btn btn-info btn-sm me-1" data-action="ver">Ver</button>
        <button class="btn btn-warning btn-sm me-1" data-action="editar">Editar</button>
        <button class="btn btn-danger btn-sm" data-action="eliminar">Eliminar</button>
      </td>
    `;
    tabla.appendChild(tr);
  });
}

async function cargar() {
  usandoBackend = true;
  try {
    const datos = await fetchJson(API);
    productos = Array.isArray(datos) ? datos : [];
    renderTabla(productos);
  } catch (err) {
    showAlert('Error cargando datos.', 'danger', 3000);
    console.error(err);
  }
}

let editandoBackendId = null;

/* -------------------------
      REGISTRO NUEVO
-------------------------- */
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

/* -------------------------
      ACCIONES TABLA
-------------------------- */
tabla.addEventListener('click', async (ev) => {
  const btn = ev.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  const tr = btn.closest('tr');
  const idx = Number(tr.dataset.idx);
  let producto = productos[idx];
  const backendId = tr.dataset.backendId;

  /* ----------- VER ----------- */
  if (action === 'ver') {
    document.getElementById('verId').textContent = producto.idProducto;
    document.getElementById('verNombre').textContent = producto.nombre;
    document.getElementById('verCantidad').textContent = producto.cantidad;
    document.getElementById('verCategoria').textContent = producto.categoria;
    document.getElementById('verDescripcion').textContent = producto.descripcion || 'Sin descripción';

    new bootstrap.Modal(document.getElementById('modalVer')).show();
    return;
  }

  /* ----------- EDITAR (CON MODAL) ----------- */
  if (action === 'editar') {

    editandoBackendId = backendId;

    crearModalEditar(producto, backendId);  // mostrando modal
    return;
  }

  /* ----------- ELIMINAR ----------- */
  if (action === 'eliminar') {
    if (!confirm("¿Seguro que deseas eliminarlo?")) return;

    try {
      await fetchJson(`${API}/${backendId}`, { method: 'DELETE' });
      showAlert("Producto eliminado.", "danger");
      cargar();
    } catch (err) {
      showAlert("Error al eliminar.", "danger");
    }
  }
});


function crearModalEditar(prod, backendId) {
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

  modalHTML.querySelector('#guardarModal').addEventListener('click', async () => {
    const payload = {
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
      cargar();
    } catch (err) {
      showAlert("Error al actualizar.", "danger");
    }
  });

  modalHTML.addEventListener('hidden.bs.modal', () => modalHTML.remove());
}


function filtrar() {
  const idF = buscarId.value.toLowerCase();
  const nomF = buscarNombre.value.toLowerCase();
  const catF = buscarCategoria.value;

  const filtrados = productos.filter(p =>
    p.idProducto.toLowerCase().includes(idF) &&
    p.nombre.toLowerCase().includes(nomF) &&
    (catF === '' || p.categoria === catF)
  );

  renderTabla(filtrados);
}

buscarId.addEventListener('input', filtrar);
buscarNombre.addEventListener('input', filtrar);
buscarCategoria.addEventListener('change', filtrar);

cargar();
