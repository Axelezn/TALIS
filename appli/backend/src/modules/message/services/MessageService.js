import { AppError } from '../../../core/AppError.js';
import { toRequiredPositiveInt } from '../../../core/validators.js';
import { EXPEDITEUR_ROLES, MessageEntity } from '../entities/MessageEntity.js';

export class MessageService {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async isParticipant(idDemande, role, id) {
    if (!EXPEDITEUR_ROLES.includes(role)) {
      return false;
    }

    return this.messageRepository.isParticipant(idDemande, role, id);
  }

  async getHistory(idDemande, viewer) {
    const parsedId = toRequiredPositiveInt(idDemande, 'id_demande');

    const authorized = await this.isParticipant(parsedId, viewer.role, viewer.id);
    if (!authorized) {
      throw new AppError("Vous n'avez pas accès à cette conversation.", 403);
    }

    await this.messageRepository.markAsRead(parsedId, viewer.role);
    return this.messageRepository.getByDemande(parsedId);
  }

  async markAsRead(idDemande, viewer) {
    const parsedId = toRequiredPositiveInt(idDemande, 'id_demande');

    const authorized = await this.isParticipant(parsedId, viewer.role, viewer.id);
    if (!authorized) {
      throw new AppError("Vous n'avez pas accès à cette conversation.", 403);
    }

    await this.messageRepository.markAsRead(parsedId, viewer.role);
  }

  async createMessage({ id_demande, expediteur_role, expediteur_id, contenu }) {
    const idDemande = toRequiredPositiveInt(id_demande, 'id_demande');

    const authorized = await this.isParticipant(idDemande, expediteur_role, expediteur_id);
    if (!authorized) {
      throw new AppError("Vous n'avez pas accès à cette conversation.", 403);
    }

    const entity = new MessageEntity({
      id_demande: idDemande,
      expediteur_role,
      expediteur_id,
      contenu,
    });

    return this.messageRepository.create(entity);
  }
}
