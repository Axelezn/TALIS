import { AppError } from '../../../core/AppError.js';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async register(req, res) {
    try {
      const result = await this.authService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return this.#handleError(error, res);
    }
  }

  async login(req, res) {
    try {
      const result = await this.authService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return this.#handleError(error, res);
    }
  }

  #handleError(error, res) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message, details: error.details });
    }

    return res.status(400).json({ message: error.message || 'Erreur de validation.' });
  }
}
