import { AppError } from '../../../core/AppError.js';

export class DemandeController {
  constructor(demandeService) {
    this.demandeService = demandeService;
  }

  async getAll(req, res) {
    try {
      const demandes = await this.demandeService.getAll();
      res.status(200).json(demandes.map((item) => item.toJSON()));
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async getById(req, res) {
    try {
      const demande = await this.demandeService.getById(req.params.id);
      res.status(200).json(demande.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async create(req, res) {
    try {
      const demande = await this.demandeService.create(req.body);
      res.status(201).json(demande.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async update(req, res) {
    try {
      const demande = await this.demandeService.update(req.params.id, req.body);
      res.status(200).json(demande.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async delete(req, res) {
    try {
      await this.demandeService.delete(req.params.id);
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
