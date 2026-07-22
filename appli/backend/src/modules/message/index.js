import express from 'express';
import { requireAuth } from '../../core/authMiddleware.js';
import { MessageRepository } from './repositories/MessageRepository.js';
import { MessageService } from './services/MessageService.js';
import { MessageController } from './controllers/MessageController.js';

export function setupMessageModule(db) {
  const router = express.Router();

  const repository = new MessageRepository(db);
  const service = new MessageService(repository);
  const controller = new MessageController(service);

  router.get('/demande/:idDemande', requireAuth, (req, res) => controller.getHistory(req, res));

  return router;
}

// Reexporte pour permettre au serveur WebSocket de partager la meme instance de service.
export function createMessageService(db) {
  return new MessageService(new MessageRepository(db));
}
