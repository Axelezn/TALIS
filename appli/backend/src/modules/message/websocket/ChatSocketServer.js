import { WebSocketServer } from 'ws';
import { verifyAuthToken } from '../../../core/jwt.js';
import { createMessageService } from '../index.js';

const CHAT_PATH = '/ws/chat';
const HEARTBEAT_INTERVAL_MS = 30000;

const CLOSE_UNAUTHENTICATED = 4001;
const CLOSE_INVALID_DEMANDE = 4002;
const CLOSE_FORBIDDEN = 4003;

// Rooms en memoire : id_demande -> Set<WebSocket> des sockets connectees a cette conversation.
function createRoomRegistry() {
  const rooms = new Map();

  return {
    join(idDemande, socket) {
      if (!rooms.has(idDemande)) {
        rooms.set(idDemande, new Set());
      }
      rooms.get(idDemande).add(socket);
    },
    leave(idDemande, socket) {
      const sockets = rooms.get(idDemande);
      if (!sockets) return;
      sockets.delete(socket);
      if (sockets.size === 0) {
        rooms.delete(idDemande);
      }
    },
    broadcast(idDemande, payload) {
      const sockets = rooms.get(idDemande);
      if (!sockets) return;
      const data = JSON.stringify(payload);
      for (const socket of sockets) {
        if (socket.readyState === socket.OPEN) {
          socket.send(data);
        }
      }
    },
  };
}

function parseIdDemande(request) {
  const url = new URL(request.url, 'http://localhost');
  const idDemande = Number(url.searchParams.get('id_demande'));
  const token = url.searchParams.get('token');
  return { idDemande, token };
}

// Attache un serveur WebSocket de chat (path /ws/chat) au serveur HTTP existant.
// Authentification par JWT en query string (le client ne peut pas fixer de headers custom
// sur une connexion WebSocket depuis un navigateur), un socket = une conversation (id_demande).
export function attachChatSocketServer(server, db) {
  const messageService = createMessageService(db);
  const rooms = createRoomRegistry();
  const wss = new WebSocketServer({ server, path: CHAT_PATH });

  wss.on('connection', async (socket, request) => {
    const { idDemande, token } = parseIdDemande(request);

    let viewer;
    try {
      viewer = verifyAuthToken(token);
    } catch {
      socket.close(CLOSE_UNAUTHENTICATED, 'Authentification invalide.');
      return;
    }

    if (!Number.isInteger(idDemande) || idDemande <= 0) {
      socket.close(CLOSE_INVALID_DEMANDE, 'Identifiant de demande invalide.');
      return;
    }

    let authorized = false;
    try {
      authorized = await messageService.isParticipant(idDemande, viewer.role, viewer.id);
    } catch (error) {
      console.error('[Chat] Echec de la verification des droits :', error.message);
    }

    if (!authorized) {
      socket.close(CLOSE_FORBIDDEN, 'Accès refusé à cette conversation.');
      return;
    }

    socket.isAlive = true;
    socket.on('pong', () => {
      socket.isAlive = true;
    });

    rooms.join(idDemande, socket);

    try {
      await messageService.markAsRead(idDemande, viewer);
    } catch (error) {
      console.error('[Chat] Echec du marquage comme lu :', error.message);
    }

    socket.on('message', async (raw) => {
      let payload;
      try {
        payload = JSON.parse(raw.toString());
      } catch {
        socket.send(JSON.stringify({ type: 'error', message: 'Message mal formé.' }));
        return;
      }

      try {
        const message = await messageService.createMessage({
          id_demande: idDemande,
          expediteur_role: viewer.role,
          expediteur_id: viewer.id,
          contenu: payload.contenu,
        });
        rooms.broadcast(idDemande, { type: 'message', message: message.toJSON() });
      } catch (error) {
        socket.send(JSON.stringify({ type: 'error', message: error.message || 'Envoi impossible.' }));
      }
    });

    socket.on('close', () => {
      rooms.leave(idDemande, socket);
    });
  });

  // Ferme les connexions mortes (client tombé sans fermeture propre) pour éviter les fuites de rooms.
  const heartbeat = setInterval(() => {
    for (const socket of wss.clients) {
      if (socket.isAlive === false) {
        socket.terminate();
        continue;
      }
      socket.isAlive = false;
      socket.ping();
    }
  }, HEARTBEAT_INTERVAL_MS);

  wss.on('close', () => clearInterval(heartbeat));

  return wss;
}
