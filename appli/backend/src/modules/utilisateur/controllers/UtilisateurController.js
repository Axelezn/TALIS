import { AppError } from '../../../core/AppError.js';

export class UtilisateurController {
  constructor(utilisateurService) {
    this.utilisateurService = utilisateurService;
  }

  async getAll(req, res) {
    try {
      const utilisateurs = await this.utilisateurService.getAll();
      res.status(200).json(utilisateurs.map((item) => item.toJSON()));
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async getById(req, res) {
    try {
      const utilisateur = await this.utilisateurService.getById(req.params.id);
      res.status(200).json(utilisateur.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async create(req, res) {
    try {
      const utilisateur = await this.utilisateurService.create(req.body);
      res.status(201).json(utilisateur.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async update(req, res) {
    try {
      const utilisateur = await this.utilisateurService.update(req.params.id, req.body);
      res.status(200).json(utilisateur.toJSON());
    } catch (error) {
      this.#handleError(error, res);
    }
  }

  async delete(req, res) {
    try {
      await this.utilisateurService.delete(req.params.id);
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
