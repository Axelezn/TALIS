import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { subscribe, removeToast } from './toastStore';
import './Toast.scss';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// À monter une seule fois, en haut de l'arbre (voir App.jsx).
// Toute la logique d'affichage est pilotée par toastStore, donc n'importe
// quel composant peut déclencher un toast via toast.js sans prop-drilling.
export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => subscribe(setToasts), []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info;
        return (
          <div key={t.id} className={`toast toast--${t.type}`} role="status">
            <Icon size={18} className="toast__icon" />
            <span className="toast__message">{t.message}</span>
            <button
              type="button"
              className="toast__close"
              aria-label="Fermer la notification"
              onClick={() => removeToast(t.id)}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
