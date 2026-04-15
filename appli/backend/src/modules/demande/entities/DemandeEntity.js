import { toOptionalPositiveInt, toOptionalString } from '../../../core/validators.js';

export class DemandeEntity {
  #idDemande;
  #idUser;
  #idOffre;
  #demande;

  constructor(data = {}) {
    this.#idDemande = toOptionalPositiveInt(data.id_demande, 'id_demande');
    this.#idUser = toOptionalPositiveInt(data.id_user, 'id_user');
    this.#idOffre = toOptionalPositiveInt(data.id_offre, 'id_offre');
    this.#demande = toOptionalString(data.demande, 'demande', 100);
  }

  toJSON() {
    return {
      id_demande: this.#idDemande,
      id_user: this.#idUser,
      id_offre: this.#idOffre,
      demande: this.#demande,
    };
  }
}
