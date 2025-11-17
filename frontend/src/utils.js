export function showAlert(htmlText, tipo = 'success', tiempo = 3000) {
  const alertContainer = document.getElementById('alertContainer');
  alertContainer.innerHTML = '';
  const a = document.createElement('div');
  a.className = `alert alert-${tipo} alert-dismissible fade show`;
  a.style.maxWidth = '480px';
  a.style.margin = '0 auto 10px auto';
  a.innerHTML = `${htmlText}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  alertContainer.appendChild(a);
  if (tiempo > 0) setTimeout(() => a.remove(), tiempo);
}

export function formatCell(v) {
  return (!v && v !== 0) ? '—' : String(v);
}
