import { AppError } from '../../../core/AppError.js';
import { toRequiredPositiveInt } from '../../../core/validators.js';
import { DemandeEntity } from '../entities/DemandeEntity.js';

export class DemandeService {
  constructor(demandeRepository) {
    this.demandeRepository = demandeRepository;
  }

  async getAll() {
    return this.demandeRepository.getAll();
  }

  async getById(idDemande) {
    const parsedId = toRequiredPositiveInt(idDemande, 'id_demande');
    const demande = await this.demandeRepository.getById(parsedId);

    if (!demande) {
      throw new AppError('Demande introuvable.', 404);
    }

    return demande;
  }

  async create(data) {
    const entity = new DemandeEntity(data);
    const payload = entity.toJSON();

    if (!payload.id_user || !payload.id_offre) {
      throw new AppError('id_user et id_offre sont obligatoires.', 400);
    }

    const duplicate = await this.demandeRepository.findByUserAndOffre(payload.id_user, payload.id_offre);
    if (duplicate) {
      throw new AppError('Une demande existe déjà pour ce user et cette offre.', 409);
    }

    return this.demandeRepository.create(entity);
  }

  async update(idDemande, data) {
    const parsedId = toRequiredPositiveInt(idDemande, 'id_demande');
    const existing = await this.demandeRepository.getById(parsedId);

    if (!existing) {
      throw new AppError('Demande introuvable.', 404);
    }

    const merged = new DemandeEntity({
      ...existing.toJSON(),
      ...data,
      id_demande: parsedId,
    });

    const payload = merged.toJSON();
    if (!payload.id_user || !payload.id_offre) {
      throw new AppError('id_user et id_offre sont obligatoires.', 400);
    }

    const duplicate = await this.demandeRepository.findByUserAndOffre(payload.id_user, payload.id_offre);
    if (duplicate && duplicate.toJSON().id_demande !== parsedId) {
      throw new AppError('Une demande existe déjà pour ce user et cette offre.', 409);
    }

    return this.demandeRepository.update(parsedId, merged);
  }

  async delete(idDemande) {
    const parsedId = toRequiredPositiveInt(idDemande, 'id_demande');
    const deleted = await this.demandeRepository.delete(parsedId);

    if (!deleted) {
      throw new AppError('Demande introuvable.', 404);
    }
  }
}
