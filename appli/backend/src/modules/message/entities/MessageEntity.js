import {
  toOptionalDateTime,
  toOptionalPositiveInt,
  toOptionalString,
  toOptionalTinyIntFlag,
  toRequiredEnum,
  toRequiredPositiveInt,
  toRequiredString,
} from '../../../core/validators.js';

export const EXPEDITEUR_ROLES = ['etudiant', 'entreprise'];

export class MessageEntity {
  #idMessage;
  #idDemande;
  #expediteurRole;
  #expediteurId;
  #contenu;
  #dateEnvoi;
  #lu;
  // Champs deduits via JOIN (user/recruteur), presents uniquement en lecture (historique).
  #expediteurNom;
  #expediteurPrenom;

  constructor(data = {}) {
    this.#idMessage = toOptionalPositiveInt(data.id_message, 'id_message');
    this.#idDemande = toRequiredPositiveInt(data.id_demande, 'id_demande');
    this.#expediteurRole = toRequiredEnum(data.expediteur_role, 'expediteur_role', EXPEDITEUR_ROLES);
    this.#expediteurId = toRequiredPositiveInt(data.expediteur_id, 'expediteur_id');
    this.#contenu = toRequiredString(data.contenu, 'contenu', 5000);
    this.#dateEnvoi = toOptionalDateTime(data.date_envoi, 'date_envoi');
    this.#lu = toOptionalTinyIntFlag(data.lu, 'lu') ?? 0;
    this.#expediteurNom = toOptionalString(data.expediteur_nom, 'expediteur_nom', 50);
    this.#expediteurPrenom = toOptionalString(data.expediteur_prenom, 'expediteur_prenom', 50);
  }

  toJSON() {
    return {
      id_message: this.#idMessage,
      id_demande: this.#idDemande,
      expediteur_role: this.#expediteurRole,
      expediteur_id: this.#expediteurId,
      contenu: this.#contenu,
      date_envoi: this.#dateEnvoi,
      lu: this.#lu,
      expediteur_nom: this.#expediteurNom,
      expediteur_prenom: this.#expediteurPrenom,
    };
  }
}
