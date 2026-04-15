import { AppError } from '../../../core/AppError.js';
import { toRequiredPositiveInt } from '../../../core/validators.js';
import { RecruteurEntity } from '../entities/RecruteurEntity.js';

export class RecruteurService {
  constructor(recruteurRepository) {
    this.recruteurRepository = recruteurRepository;
  }

  async getAll() {
    return this.recruteurRepository.getAll();
  }

  async getById(idRecruteur) {
    const parsedId = toRequiredPositiveInt(idRecruteur, 'id_recruteur');
    const recruteur = await this.recruteurRepository.getById(parsedId);

    if (!recruteur) {
      throw new AppError('Recruteur introuvable.', 404);
    }

    return recruteur;
  }

  async create(data) {
    if (!data.id_entreprise) {
      throw new AppError('id_entreprise est obligatoire pour créer un recruteur.', 400);
    }

    const recruteur = new RecruteurEntity(data);
    return this.recruteurRepository.create(recruteur);
  }

  async update(idRecruteur, data) {
    const parsedId = toRequiredPositiveInt(idRecruteur, 'id_recruteur');
    const existing = await this.recruteurRepository.getById(parsedId);

    if (!existing) {
      throw new AppError('Recruteur introuvable.', 404);
    }

    const merged = new RecruteurEntity({
      ...existing.toJSON(),
      ...data,
      id_recruteur: parsedId,
    });

    return this.recruteurRepository.update(parsedId, merged);
  }

  async delete(idRecruteur) {
    const parsedId = toRequiredPositiveInt(idRecruteur, 'id_recruteur');
    const deleted = await this.recruteurRepository.delete(parsedId);

    if (!deleted) {
      throw new AppError('Recruteur introuvable.', 404);
    }
  }
}
