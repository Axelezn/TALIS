import express from 'express';
import { EntrepriseRepository } from './repositories/EntrepriseRepository.js';
import { EntrepriseService } from './services/EntrepriseService.js';
import { EntrepriseController } from './controllers/EntrepriseController.js';

export function setupEntrepriseModule(db) {
	const router = express.Router();

	const repository = new EntrepriseRepository(db);
	const service = new EntrepriseService(repository);
	const controller = new EntrepriseController(service);

	router.get('/', (req, res) => controller.getAll(req, res));
	router.get('/:id', (req, res) => controller.getById(req, res));
	router.post('/', (req, res) => controller.create(req, res));
	router.put('/:id', (req, res) => controller.update(req, res));
	router.delete('/:id', (req, res) => controller.delete(req, res));

	return router;
}
