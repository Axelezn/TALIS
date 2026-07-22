import React, { useEffect, useRef, useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { getMessageHistory, connectChatSocket } from '../../services/chatService';
import { toast } from '../common/Toast/toast';
import './ChatDrawer.scss';

export default function ChatDrawer({ demande, isRecruiter, currentUser, token, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'open' | 'closed'

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    getMessageHistory(demande.id_demande, token)
      .then((history) => {
        if (!cancelled) setMessages(history || []);
      })
      .catch((err) => {
        console.error('Fetch chat history error:', err);
        toast.error("Impossible de charger l'historique de la conversation.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const socket = connectChatSocket(demande.id_demande, token);
    socketRef.current = socket;

    socket.onopen = () => setStatus('open');
    socket.onclose = () => setStatus('closed');
    socket.onerror = () => setStatus('closed');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => (
          prev.some((m) => m.id_message === data.message.id_message) ? prev : [...prev, data.message]
        ));
      } else if (data.type === 'error') {
        toast.error(data.message || 'Erreur de messagerie.');
      }
    };

    return () => {
      cancelled = true;
      socket.close();
      socketRef.current = null;
    };
  }, [demande.id_demande, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const contenu = inputValue.trim();
    if (!contenu) return;

    if (status !== 'open' || socketRef.current?.readyState !== WebSocket.OPEN) {
      toast.error('La connexion au chat est interrompue. Réessayez dans un instant.');
      return;
    }

    socketRef.current.send(JSON.stringify({ contenu }));
    setInputValue('');
  };

  const isMine = (message) => (
    message.expediteur_role === currentUser.role && String(message.expediteur_id) === String(currentUser.id)
  );

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const counterpartName = isRecruiter
    ? `${demande.candidat_prenom || ''} ${demande.candidat_nom || ''}`.trim() || 'Candidat'
    : demande.entreprise || 'Entreprise';

  return (
    <div className="chat-backdrop show" onClick={onClose}>
      <div className="chat-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="chat-drawer__header">
          <div className="chat-drawer__title">
            <MessageCircle size={18} />
            <div>
              <h3>{counterpartName}</h3>
              <p>{demande.titre || 'Offre'}</p>
            </div>
          </div>
          <button className="chat-drawer__close" onClick={onClose} aria-label="Fermer la conversation">
            <X size={22} />
          </button>
        </div>

        <span className={`chat-drawer__status chat-drawer__status--${status}`}>
          {status === 'open' ? 'En ligne' : status === 'connecting' ? 'Connexion en cours...' : 'Déconnecté'}
        </span>

        <div className="chat-drawer__messages">
          {loading && <p className="chat-drawer__hint">Chargement de la conversation...</p>}

          {!loading && messages.length === 0 && (
            <p className="chat-drawer__hint">Aucun message pour l'instant. Lancez la conversation !</p>
          )}

          {!loading && messages.map((message) => (
            <div
              key={message.id_message}
              className={`chat-bubble ${isMine(message) ? 'chat-bubble--mine' : 'chat-bubble--theirs'}`}
            >
              <p className="chat-bubble__content">{message.contenu}</p>
              <span className="chat-bubble__time">{formatTime(message.date_envoi)}</span>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-drawer__input-bar" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Écrivez votre message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={status !== 'open'}
          />
          <button type="submit" disabled={status !== 'open' || !inputValue.trim()} aria-label="Envoyer">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
