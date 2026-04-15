import { AppError } from '../../../core/AppError.js';
import { toRequiredPositiveInt } from '../../../core/validators.js';
import { OffreEntity } from '../entities/OffreEntity.js';

export class OffreService {
  constructor(offreRepository) {
    this.offreRepository = offreRepository;
  }

  async getAll() {
    return this.offreRepository.getAll();
  }

  async getById(idOffre) {
    const parsedId = toRequiredPositiveInt(idOffre, 'id_offre');
    const offre = await this.offreRepository.getById(parsedId);

    if (!offre) {
      throw new AppError('Offre introuvable.', 404);
    }

    return offre;
  }

  async create(data) {
    const offre = new OffreEntity(data);
    return this.offreRepository.create(offre);
  }

  async update(idOffre, data) {
    const parsedId = toRequiredPositiveInt(idOffre, 'id_offre');
    const existing = await this.offreRepository.getById(parsedId);

    if (!existing) {
      throw new AppError('Offre introuvable.', 404);
    }

    const merged = new OffreEntity({
      ...existing.toJSON(),
      ...data,
      id_offre: parsedId,
    });

    return this.offreRepository.update(parsedId, merged);
  }

  async delete(idOffre) {
    const parsedId = toRequiredPositiveInt(idOffre, 'id_offre');
    const deleted = await this.offreRepository.delete(parsedId);

    if (!deleted) {
      throw new AppError('Offre introuvable.', 404);
    }
  }
}
