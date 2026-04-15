import { AppError } from '../../../core/AppError.js';

export class OffreController {
  constructor(offreService) {
    this.offreService = offreService;
  }

  async getAll(req, res) {
    try {
      const offres = await this.offreService.getAll();
      res.status(200).json(offres.map((item) => item.toJSON()));
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async getById(req, res) {
    try {
      const offre = await this.offreService.getById(req.params.id);
      res.status(200).json(offre.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async create(req, res) {
    try {
      const offre = await this.offreService.create(req.body);
      res.status(201).json(offre.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async update(req, res) {
    try {
      const offre = await this.offreService.update(req.params.id, req.body);
      res.status(200).json(offre.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async delete(req, res) {
    try {
      await this.offreService.delete(req.params.id);
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
