// small DOM-based toast helper — no deps
const containerId = 'app-toast-container';

function ensureContainer() {
  let c = document.getElementById(containerId);
  if (!c) {
    c = document.createElement('div');
    c.id = containerId;
    c.style.position = 'fixed';
    c.style.right = '18px';
    c.style.bottom = '18px';
    c.style.display = 'flex';
    c.style.flexDirection = 'column';
    c.style.gap = '10px';
    c.style.zIndex = 99999;
    document.body.appendChild(c);
  }
  return c;
}

function makeToastNode(text, type = 'info') {
  const n = document.createElement('div');
  n.textContent = text;
  n.style.padding = '10px 14px';
  n.style.borderRadius = '10px';
  n.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
  n.style.color = '#fff';
  n.style.fontWeight = 600;
  n.style.minWidth = '160px';
  n.style.maxWidth = '320px';
  n.style.fontSize = '14px';
  n.style.opacity = '0';
  n.style.transform = 'translateY(6px)';
  n.style.transition = 'opacity .18s ease, transform .18s ease';
  if (type === 'success') {
    n.style.background = 'linear-gradient(90deg,#48c78e,#2a9d66)';
  } else if (type === 'error') {
    n.style.background = 'linear-gradient(90deg,#ff7b7b,#d94a4a)';
  } else if (type === 'warn') {
    n.style.background = 'linear-gradient(90deg,#f6c36b,#d08b2d)';
  } else {
    n.style.background = 'linear-gradient(90deg,#6f7766,#44544b)';
  }
  return n;
}

export function showToast(text, type = 'info', duration = 3500) {
  try {
    const c = ensureContainer();
    const n = makeToastNode(text, type);
    c.appendChild(n);
    // entrance
    requestAnimationFrame(() => {
      n.style.opacity = '1';
      n.style.transform = 'translateY(0)';
    });
    const t = setTimeout(() => {
      // exit
      n.style.opacity = '0';
      n.style.transform = 'translateY(6px)';
      setTimeout(() => n.remove(), 200);
      clearTimeout(t);
    }, duration);
    return n;
  } catch (e) {
    // fallback: alert
    try { console.warn('toast failed', e); } catch {}
    alert(text);
  }
}
