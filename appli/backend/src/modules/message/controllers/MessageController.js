import { AppError } from '../../../core/AppError.js';

export class MessageController {
  constructor(messageService) {
    this.messageService = messageService;
  }

  async getHistory(req, res) {
    try {
      const messages = await this.messageService.getHistory(req.params.idDemande, req.auth);
      res.status(200).json(messages.map((item) => item.toJSON()));
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
