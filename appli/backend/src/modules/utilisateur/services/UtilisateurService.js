import { AppError } from '../../../core/AppError.js';
import { toRequiredPositiveInt } from '../../../core/validators.js';
import { UtilisateurEntity } from '../entities/UtilisateurEntity.js';

export class UtilisateurService {
  constructor(utilisateurRepository) {
    this.utilisateurRepository = utilisateurRepository;
  }

  async getAll() {
    return this.utilisateurRepository.getAll();
  }

  async getById(idUser) {
    const parsedId = toRequiredPositiveInt(idUser, 'id_user');
    const utilisateur = await this.utilisateurRepository.getById(parsedId);

    if (!utilisateur) {
      throw new AppError('Utilisateur introuvable.', 404);
    }

    return utilisateur;
  }

  async create(data) {
    const utilisateur = new UtilisateurEntity(data);
    return this.utilisateurRepository.create(utilisateur);
  }

  async update(idUser, data) {
    const parsedId = toRequiredPositiveInt(idUser, 'id_user');
    const existing = await this.utilisateurRepository.getById(parsedId);

    if (!existing) {
      throw new AppError('Utilisateur introuvable.', 404);
    }

    const merged = new UtilisateurEntity({
      ...existing.toJSON(),
      ...data,
      id_user: parsedId,
    });

    return this.utilisateurRepository.update(parsedId, merged);
  }

  async delete(idUser) {
    const parsedId = toRequiredPositiveInt(idUser, 'id_user');
    const deleted = await this.utilisateurRepository.delete(parsedId);

    if (!deleted) {
      throw new AppError('Utilisateur introuvable.', 404);
    }
  }
}
