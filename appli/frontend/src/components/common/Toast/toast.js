import { addToast } from './toastStore';

function push(type, message, duration) {
  return addToast({ type, message, duration });
}

// API globale : import { toast } from '.../Toast/toast';
// toast.success('Profil enregistré'); toast.error('Erreur réseau'); ...
export const toast = {
  success: (message, duration) => push('success', message, duration),
  error: (message, duration) => push('error', message, duration),
  warning: (message, duration) => push('warning', message, duration),
  info: (message, duration) => push('info', message, duration),
};
