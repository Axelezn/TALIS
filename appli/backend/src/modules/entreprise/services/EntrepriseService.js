import { AppError } from '../../../core/AppError.js';
import { toRequiredPositiveInt } from '../../../core/validators.js';
import { EntrepriseEntity } from '../entities/EntrepriseEntity.js';

export class EntrepriseService {
  constructor(entrepriseRepository) {
    this.entrepriseRepository = entrepriseRepository;
  }

  async getAll() {
    return this.entrepriseRepository.getAll();
  }

  async getById(idEntreprise) {
    const parsedId = toRequiredPositiveInt(idEntreprise, 'id_entreprise');
    const entreprise = await this.entrepriseRepository.getById(parsedId);

    if (!entreprise) {
      throw new AppError('Entreprise introuvable.', 404);
    }

    return entreprise;
  }

  async create(data) {
    const entreprise = new EntrepriseEntity(data);
    return this.entrepriseRepository.create(entreprise);
  }

  async update(idEntreprise, data) {
    const parsedId = toRequiredPositiveInt(idEntreprise, 'id_entreprise');
    const existing = await this.entrepriseRepository.getById(parsedId);

    if (!existing) {
      throw new AppError('Entreprise introuvable.', 404);
    }

    const merged = new EntrepriseEntity({
      ...existing.toJSON(),
      ...data,
      id_entreprise: parsedId,
    });

    return this.entrepriseRepository.update(parsedId, merged);
  }

  async delete(idEntreprise) {
    const parsedId = toRequiredPositiveInt(idEntreprise, 'id_entreprise');
    const deleted = await this.entrepriseRepository.delete(parsedId);

    if (!deleted) {
      throw new AppError('Entreprise introuvable.', 404);
    }
  }
}
