import express from 'express';
import { AuthRepository } from './repositories/AuthRepository.js';
import { AuthService } from './services/AuthService.js';
import { AuthController } from './controllers/AuthController.js';

export function setupAuthModule(db) {
  const router = express.Router();

  const repository = new AuthRepository(db);
  const service = new AuthService(repository);
  const controller = new AuthController(service);

  router.post('/register', (req, res) => controller.register(req, res));
  router.post('/login', (req, res) => controller.login(req, res));

  return router;
}
