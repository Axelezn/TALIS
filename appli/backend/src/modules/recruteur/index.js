import express from 'express';
import { RecruteurRepository } from './repositories/RecruteurRepository.js';
import { RecruteurService } from './services/RecruteurService.js';
import { RecruteurController } from './controllers/RecruteurController.js';

export function setupRecruteurModule(db) {
	const router = express.Router();

	const repository = new RecruteurRepository(db);
	const service = new RecruteurService(repository);
	const controller = new RecruteurController(service);

	router.get('/', (req, res) => controller.getAll(req, res));
	router.get('/:id', (req, res) => controller.getById(req, res));
	router.post('/', (req, res) => controller.create(req, res));
	router.put('/:id', (req, res) => controller.update(req, res));
	router.delete('/:id', (req, res) => controller.delete(req, res));

	return router;
}
