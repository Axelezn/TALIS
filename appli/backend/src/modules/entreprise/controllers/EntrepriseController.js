import { AppError } from '../../../core/AppError.js';

export class EntrepriseController {
  constructor(entrepriseService) {
    this.entrepriseService = entrepriseService;
  }

  async getAll(req, res) {
    try {
      const entreprises = await this.entrepriseService.getAll();
      res.status(200).json(entreprises.map((item) => item.toJSON()));
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async getById(req, res) {
    try {
      const entreprise = await this.entrepriseService.getById(req.params.id);
      res.status(200).json(entreprise.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async create(req, res) {
    try {
      const entreprise = await this.entrepriseService.create(req.body);
      res.status(201).json(entreprise.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async update(req, res) {
    try {
      const entreprise = await this.entrepriseService.update(req.params.id, req.body);
      res.status(200).json(entreprise.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async delete(req, res) {
    try {
      await this.entrepriseService.delete(req.params.id);
      res.status(200).json({ message: 'Entreprise supprimee avec succes.' });
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
