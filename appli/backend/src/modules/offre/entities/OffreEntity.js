import { toOptionalDate, toOptionalNumber, toOptionalPositiveInt, toOptionalString } from '../../../core/validators.js';

export class OffreEntity {
  #idOffre;
  #type;
  #titre;
  #idEntreprise;
  #entreprise;
  #localisation;
  #dateSend;
  #dateStop;
  #remuneration;
  #description;

  constructor(data = {}) {
    this.#idOffre = toOptionalPositiveInt(data.id_offre, 'id_offre');
    this.#type = toOptionalString(data.type, 'type', 50);
    this.#titre = toOptionalString(data.titre, 'titre', 200);
    this.#idEntreprise = toOptionalPositiveInt(data.id_entreprise, 'id_entreprise');
    // entreprise/localisation sont deduites via JOIN sur la table entreprise, jamais ecrites directement.
    this.#entreprise = toOptionalString(data.entreprise, 'entreprise', 50);
    this.#localisation = toOptionalString(data.localisation, 'localisation', 255);
    this.#dateSend = toOptionalDate(data.date_send, 'date_send');
    this.#dateStop = toOptionalDate(data.date_stop, 'date_stop');
    this.#remuneration = toOptionalNumber(data.remuneration, 'remuneration');
    this.#description = toOptionalString(data.description, 'description', 10000);

    if (this.#dateSend && this.#dateStop && this.#dateStop < this.#dateSend) {
      throw new Error('date_stop doit être supérieure ou égale à date_send.');
    }
  }

  toJSON() {
    return {
      id_offre: this.#idOffre,
      type: this.#type,
      titre: this.#titre,
      id_entreprise: this.#idEntreprise,
      entreprise: this.#entreprise,
      localisation: this.#localisation,
      date_send: this.#dateSend,
      date_stop: this.#dateStop,
      remuneration: this.#remuneration,
      description: this.#description,
    };
  }
}
