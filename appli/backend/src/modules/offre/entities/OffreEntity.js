import { toOptionalDate, toOptionalNumber, toOptionalPositiveInt, toOptionalString } from '../../../core/validators.js';

export class OffreEntity {
  #idOffre;
  #type;
  #titre;
  #dateSend;
  #dateStop;
  #remuneration;
  #description;
  #entreprise;

  constructor(data = {}) {
    this.#idOffre = toOptionalPositiveInt(data.id_offre, 'id_offre');
    this.#type = toOptionalString(data.type, 'type', 50);
    this.#titre = toOptionalString(data.titre, 'titre', 200);
    this.#dateSend = toOptionalDate(data.date_send, 'date_send');
    this.#dateStop = toOptionalDate(data.date_stop, 'date_stop');
    this.#remuneration = toOptionalNumber(data.remuneration, 'remuneration');
    this.#description = toOptionalString(data.description, 'description', 10000);
    this.#entreprise = toOptionalString(data.entreprise, 'entreprise', 255);

    if (this.#dateSend && this.#dateStop && this.#dateStop < this.#dateSend) {
      throw new Error('date_stop doit être supérieure ou égale à date_send.');
    }
  }

  toJSON() {
    return {
      id_offre: this.#idOffre,
      type: this.#type,
      titre: this.#titre,
      date_send: this.#dateSend,
      date_stop: this.#dateStop,
      remuneration: this.#remuneration,
      description: this.#description,
      entreprise: this.#entreprise,
    };
  }
}
