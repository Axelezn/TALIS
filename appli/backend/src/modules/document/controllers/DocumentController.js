import { AppError } from '../../../core/AppError.js';

export class DocumentController {
  constructor(documentService) {
    this.documentService = documentService;
  }

  async getAll(req, res) {
    try {
      const documents = await this.documentService.getAll();
      res.status(200).json(documents.map((item) => item.toJSON()));
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async getById(req, res) {
    try {
      const document = await this.documentService.getById(req.params.id);
      res.status(200).json(document.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async create(req, res) {
    try {
      const document = await this.documentService.create(req.body);
      res.status(201).json(document.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async update(req, res) {
    try {
      const document = await this.documentService.update(req.params.id, req.body);
      res.status(200).json(document.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async delete(req, res) {
    try {
      await this.documentService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  #handleError(error, res) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message, details: error.details });
    }

    return res.status(400).json({ message: error.message || 'Erreur de validation.' });
  }
}
