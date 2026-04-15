import express from 'express';
import { OffreRepository } from './repositories/OffreRepository.js';
import { OffreService } from './services/OffreService.js';
import { OffreController } from './controllers/OffreController.js';

export function setupOffreModule(db) {
	const router = express.Router();

	const repository = new OffreRepository(db);
	const service = new OffreService(repository);
	const controller = new OffreController(service);

	router.get('/', (req, res) => controller.getAll(req, res));
	router.get('/:id', (req, res) => controller.getById(req, res));
	router.post('/', (req, res) => controller.create(req, res));
	router.put('/:id', (req, res) => controller.update(req, res));
	router.delete('/:id', (req, res) => controller.delete(req, res));

	return router;
}
