import express from 'express';
import { DemandeRepository } from './repositories/DemandeRepository.js';
import { DemandeService } from './services/DemandeService.js';
import { DemandeController } from './controllers/DemandeController.js';

export function setupDemandeModule(db) {
	const router = express.Router();

	const repository = new DemandeRepository(db);
	const service = new DemandeService(repository);
	const controller = new DemandeController(service);

	router.get('/', (req, res) => controller.getAll(req, res));
	router.get('/:id', (req, res) => controller.getById(req, res));
	router.post('/', (req, res) => controller.create(req, res));
	router.put('/:id', (req, res) => controller.update(req, res));
	router.delete('/:id', (req, res) => controller.delete(req, res));

	return router;
}
