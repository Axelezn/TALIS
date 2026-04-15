import express from 'express';
import { DocumentRepository } from './repositories/DocumentRepository.js';
import { DocumentService } from './services/DocumentService.js';
import { DocumentController } from './controllers/DocumentController.js';

export function setupDocumentModule(db) {
	const router = express.Router();

	const repository = new DocumentRepository(db);
	const service = new DocumentService(repository);
	const controller = new DocumentController(service);

	router.get('/', (req, res) => controller.getAll(req, res));
	router.get('/:id', (req, res) => controller.getById(req, res));
	router.post('/', (req, res) => controller.create(req, res));
	router.put('/:id', (req, res) => controller.update(req, res));
	router.delete('/:id', (req, res) => controller.delete(req, res));

	return router;
}
