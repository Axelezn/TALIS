import express from 'express';
import { UtilisateurRepository } from './repositories/UtilisateurRepository.js';
import { UtilisateurService } from './services/UtilisateurService.js';
import { UtilisateurController } from './controllers/UtilisateurController.js';

export function setupUtilisateurModule(db) {
	const router = express.Router();

	const repository = new UtilisateurRepository(db);
	const service = new UtilisateurService(repository);
	const controller = new UtilisateurController(service);

	router.get('/', (req, res) => controller.getAll(req, res));
	router.get('/:id', (req, res) => controller.getById(req, res));
	router.post('/', (req, res) => controller.create(req, res));
	router.put('/:id', (req, res) => controller.update(req, res));
	router.delete('/:id', (req, res) => controller.delete(req, res));

	return router;
}
