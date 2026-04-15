import { AppError } from '../../../core/AppError.js';

export class RecruteurController {
  constructor(recruteurService) {
    this.recruteurService = recruteurService;
  }

  async getAll(req, res) {
    try {
      const recruteurs = await this.recruteurService.getAll();
      res.status(200).json(recruteurs.map((item) => item.toJSON()));
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async getById(req, res) {
    try {
      const recruteur = await this.recruteurService.getById(req.params.id);
      res.status(200).json(recruteur.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async create(req, res) {
    try {
      const recruteur = await this.recruteurService.create(req.body);
      res.status(201).json(recruteur.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async update(req, res) {
    try {
      const recruteur = await this.recruteurService.update(req.params.id, req.body);
      res.status(200).json(recruteur.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async delete(req, res) {
    try {
      await this.recruteurService.delete(req.params.id);
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
