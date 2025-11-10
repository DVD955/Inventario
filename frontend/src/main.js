
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


const STORAGE_KEY = 'productos_fallback_v1';
function loadFallback() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    productos = s ? JSON.parse(s) : [];
  } catch {
    productos = [];
  }
}
function saveFallback() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  } catch (e) {  }
}


function formatCell(v) { return typeof v === 'undefined' || v === null || v === '' ? '—' : String(v); }

function renderTabla(list = productos) {
  tabla.innerHTML = '';
  if (!Array.isArray(list)) list = [];
  list.forEach((p, idx) => {
    const tr = document.createElement('tr');
   
    tr.dataset.idx = idx;
    tr.dataset.backendId = p._id || ''; 
    tr.dataset.descripcion = p.descripcion || '';
    tr.innerHTML = `
      <td>${formatCell(p.idProducto ?? p.id)}</td>
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
    const productosBackend = await fetchJson(API);
   
    productos = Array.isArray(productosBackend) ? productosBackend : [];
    renderTabla(productos);
  } catch (err) {

    loadFallback();
    renderTabla(productos);
    showAlert('Backend no disponible: usando almacenamiento local (offline).', 'warning', 3500);
    console.warn('Error cargando desde backend, usando fallback:', err);
  }
}


let editandoBackendId = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

 
  const idVal = idProductoInput.value.trim();
  const nombreVal = nombreInput.value.trim();
  const cantidadVal = cantidadInput.value.trim();
  const categoriaVal = categoriaInput.value.trim();
  const descripcionVal = descripcionInput.value.trim();

  
  [idProductoInput, nombreInput, cantidadInput, categoriaInput].forEach(el => el.classList.toggle('is-invalid', !el.value));

  if (!idVal || !nombreVal || !cantidadVal || !categoriaVal) {
    showAlert('Completa los campos requeridos (ID, Nombre, Cantidad, Categoría).', 'danger', 3000);
    return;
  }

  const payload = {
    idProducto: idVal,
    nombre: nombreVal,
    cantidad: Number(cantidadVal),
    categoria: categoriaVal,
    descripcion: descripcionVal
  };

 
  if (editandoBackendId) {
   
    try {
      if (usandoBackend) {
        await fetchJson(`${API}/${editandoBackendId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showAlert('Producto actualizado (backend).', 'info', 2200);
        editandoBackendId = null;
        form.reset();
        cargar();
        return;
      }
      throw new Error('no backend');
    } catch (err) {
     
      const idx = productos.findIndex(p => (p._id && p._id === editandoBackendId) || p.idProducto === payload.idProducto || p.id === payload.idProducto);
      if (idx >= 0) {
        productos[idx] = { ...productos[idx], ...payload };
        saveFallback();
        renderTabla(productos);
        showAlert('Producto actualizado (local).', 'info', 2000);
        editandoBackendId = null;
        form.reset();
        return;
      }
      showAlert('Error al actualizar producto.', 'danger', 3000);
      console.error(err);
      return;
    }
  }

  try {
    if (usandoBackend) {
      await fetchJson(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showAlert('Producto agregado (backend).', 'success', 2000);
      form.reset();
      cargar();
      return;
    }
    throw new Error('no backend');
  } catch (err) {
    
    const existeIdx = productos.findIndex(p => p.idProducto === payload.idProducto || p.id === payload.idProducto);
    if (existeIdx >= 0) {
    
      productos[existeIdx] = { ...productos[existeIdx], ...payload };
      showAlert('Producto actualizado (local).', 'info', 1800);
    } else {
      
      const newItem = { ...payload, id: payload.idProducto || `L-${Date.now()}` };
      productos.push(newItem);
      showAlert('Producto agregado (local).', 'success', 1800);
    }
    saveFallback();
    renderTabla(productos);
    form.reset();
  }
});

tabla.addEventListener('click', async (ev) => {
  const btn = ev.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const tr = btn.closest('tr');
  if (!tr) return;
  const idx = Number(tr.dataset.idx);
  const backendId = tr.dataset.backendId || null;
  let producto = productos[idx];

  if (!producto && backendId) {
    // tratar de pedir al backend por id
    try {
      producto = await fetchJson(`${API}/${backendId}`);
    } catch {
      // ignore
    }
  }

  if (action === 'ver') {
    // llenar modalVer (ya existe en tu index.html)
    const verId = document.getElementById('verId');
    const verNombre = document.getElementById('verNombre');
    const verCantidad = document.getElementById('verCantidad');
    const verCategoria = document.getElementById('verCategoria');
    const verDescripcion = document.getElementById('verDescripcion');
    verId.textContent = producto?.idProducto ?? producto?.id ?? '—';
    verNombre.textContent = producto?.nombre ?? '—';
    verCantidad.textContent = producto?.cantidad ?? '—';
    verCategoria.textContent = producto?.categoria ?? '—';
    verDescripcion.textContent = producto?.descripcion ?? 'Sin descripción';
    const modal = new bootstrap.Modal(document.getElementById('modalVer'));
    modal.show();
    return;
  }

  if (action === 'editar') {
    
    if (backendId && usandoBackend) {
      try {
        producto = await fetchJson(`${API}/${backendId}`);
      } catch (err) {
       
      }
    }

  
    crearModalEditar(producto, backendId);
    return;
  }

  if (action === 'eliminar') {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

   
    if (backendId && usandoBackend) {
      try {
        await fetchJson(`${API}/${backendId}`, { method: 'DELETE' });
        showAlert('Producto eliminado (backend).', 'danger', 1600);
        cargar();
        return;
      } catch (err) {
      
        usingFallbackDelete(idx);
        return;
      }
    }

   
    usingFallbackDelete(idx);
  }
});

function usingFallbackDelete(idx) {
  productos.splice(idx, 1);
  saveFallback();
  renderTabla(productos);
  showAlert('Producto eliminado (local).', 'danger', 1600);
}


function crearModalEditar(prod = {}, backendId = null) {
 
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
          <div class="mb-2"><label class="form-label">ID</label><input id="modal_edit_id" class="form-control" value="${escapeHtml(prod.idProducto ?? prod.id ?? '')}"></div>
          <div class="mb-2"><label class="form-label">Nombre</label><input id="modal_edit_nombre" class="form-control" value="${escapeHtml(prod.nombre ?? '')}"></div>
          <div class="mb-2"><label class="form-label">Cantidad</label><input id="modal_edit_cantidad" type="number" class="form-control" value="${escapeHtml(prod.cantidad ?? '')}"></div>
          <div class="mb-2"><label class="form-label">Categoría</label><input id="modal_edit_categoria" class="form-control" value="${escapeHtml(prod.categoria ?? '')}"></div>
          <div class="mb-2"><label class="form-label">Descripción</label><textarea id="modal_edit_descripcion" class="form-control">${escapeHtml(prod.descripcion ?? '')}</textarea></div>
        </div>
        <div class="modal-footer">
          <button id="modal_save_btn" class="btn btn-success">Guardar</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalHTML);
  const bsModal = new bootstrap.Modal(modalHTML);
  bsModal.show();

  modalHTML.querySelector('#modal_save_btn').addEventListener('click', async () => {
    const payload = {
      idProducto: modalHTML.querySelector('#modal_edit_id').value.trim(),
      nombre: modalHTML.querySelector('#modal_edit_nombre').value.trim(),
      cantidad: Number(modalHTML.querySelector('#modal_edit_cantidad').value),
      categoria: modalHTML.querySelector('#modal_edit_categoria').value.trim(),
      descripcion: modalHTML.querySelector('#modal_edit_descripcion').value.trim()
    };

 
    if (!payload.idProducto || !payload.nombre || !payload.categoria || Number.isNaN(payload.cantidad)) {
      showAlert('Completa los campos requeridos en edición', 'danger', 2500);
      return;
    }

    // intento actualizar en backend si corresponde
    if (backendId && usandoBackend) {
      try {
        await fetchJson(`${API}/${backendId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showAlert('Producto actualizado (backend).', 'info', 2000);
        bsModal.hide();
        modalHTML.remove();
        cargar();
        return;
      } catch (err) {
       
        console.warn('Fallo actualizar backend, usando local', err);
      }
    }

   
    const idx = productos.findIndex(p => p.idProducto === payload.idProducto || p.id === payload.idProducto || (p._id && p._id === backendId));
    if (idx >= 0) {
      productos[idx] = { ...productos[idx], ...payload };
      saveFallback();
      renderTabla(productos);
      showAlert('Producto actualizado (local).', 'info', 1800);
    } else {
   
      productos.push({ ...payload, id: payload.idProducto });
      saveFallback();
      renderTabla(productos);
      showAlert('Producto agregado localmente.', 'success', 1800);
    }

    bsModal.hide();
    modalHTML.remove();
  });

 
  modalHTML.addEventListener('hidden.bs.modal', () => modalHTML.remove());
}


function filtrar() {
  const idF = (buscarId?.value || '').toLowerCase();
  const nombreF = (buscarNombre?.value || '').toLowerCase();
  const catF = (buscarCategoria?.value || '');
  const filtered = productos.filter(p => {
    const idText = String(p.idProducto ?? p.id ?? '').toLowerCase();
    const nombreText = String(p.nombre ?? '').toLowerCase();
    const categoriaText = String(p.categoria ?? '');
    return idText.includes(idF) && nombreText.includes(nombreF) && (catF === '' || categoriaText === catF);
  });
  renderTabla(filtered);
}
[buscarId, buscarNombre].forEach(el => el && el.addEventListener('input', filtrar));
if (buscarCategoria) buscarCategoria.addEventListener('change', filtrar);


function escapeHtml(s='') {
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}


cargar();
