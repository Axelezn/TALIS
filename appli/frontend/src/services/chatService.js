import { apiRequest } from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function getMessageHistory(idDemande, token) {
  return apiRequest(`/messages/demande/${idDemande}`, {
    method: 'GET',
    token,
  });
}

// Ouvre la connexion WebSocket temps réel pour la conversation d'une demande.
// Le token est passé en query string : un WebSocket navigateur ne permet pas de headers custom.
export function connectChatSocket(idDemande, token) {
  const wsBaseUrl = API_BASE_URL.replace(/\/api\/?$/, '').replace(/^http/, 'ws');
  const url = `${wsBaseUrl}/ws/chat?id_demande=${idDemande}&token=${encodeURIComponent(token)}`;
  return new WebSocket(url);
}
