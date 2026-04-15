import {
  toOptionalPositiveInt,
  toOptionalString,
  toOptionalTinyIntFlag,
} from '../../../core/validators.js';

export class EntrepriseEntity {
  #idEntreprise;
  #nom;
  #adresseComplete;
  #numeroRue;
  #codePostal;
  #ville;
  #certif;

  constructor(data = {}) {
    this.#idEntreprise = toOptionalPositiveInt(data.id_entreprise, 'id_entreprise');
    this.#nom = toOptionalString(data.nom, 'nom', 50);
    this.#adresseComplete = toOptionalString(data.adresse_complete, 'adresse_complete', 255);
    this.#numeroRue = toOptionalPositiveInt(data.numero_rue, 'numero_rue');
    this.#codePostal = toOptionalPositiveInt(data.code_postal, 'code_postal');
    this.#ville = toOptionalString(data.ville, 'ville', 255);
    this.#certif = toOptionalTinyIntFlag(data.certif, 'certif');
  }

  toJSON() {
    return {
      id_entreprise: this.#idEntreprise,
      nom: this.#nom,
      adresse_complete: this.#adresseComplete,
      numero_rue: this.#numeroRue,
      code_postal: this.#codePostal,
      ville: this.#ville,
      certif: this.#certif,
    };
  }
}
