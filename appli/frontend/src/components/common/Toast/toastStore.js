// Petit store pub/sub sans dépendance : utilisable depuis n'importe quel
// composant ou service (même en dehors de React) via toast.js.
let toasts = [];
let listeners = [];
let idCounter = 0;

function notify() {
  listeners.forEach((listener) => listener(toasts));
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function addToast({ type = 'info', message, duration = 4000 }) {
  const id = ++idCounter;
  toasts = [...toasts, { id, type, message }];
  notify();

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }

  return id;
}

export function removeToast(id) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}
