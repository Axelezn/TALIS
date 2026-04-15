import {
  toOptionalDate,
  toOptionalPositiveInt,
  toOptionalString,
  toOptionalTinyIntFlag,
} from '../../../core/validators.js';

export class RecruteurEntity {
  #idRecruteur;
  #idEntreprise;
  #nom;
  #prenom;
  #ddn;
  #mail;
  #tel;
  #certif;
  #idDocument;
  #idOffre;

  constructor(data = {}) {
    this.#idRecruteur = toOptionalPositiveInt(data.id_recruteur, 'id_recruteur');
    this.#idEntreprise = toOptionalPositiveInt(data.id_entreprise, 'id_entreprise');
    this.#nom = toOptionalString(data.nom, 'nom', 50);
    this.#prenom = toOptionalString(data.prenom, 'prenom', 50);
    this.#ddn = toOptionalDate(data.ddn, 'ddn');
    this.#mail = toOptionalString(data.mail, 'mail', 100);
    this.#tel = toOptionalString(data.tel, 'tel', 60);
    this.#certif = toOptionalTinyIntFlag(data.certif, 'certif');
    this.#idDocument = toOptionalPositiveInt(data.id_document, 'id_document');
    this.#idOffre = toOptionalPositiveInt(data.id_offre, 'id_offre');
  }

  toJSON() {
    return {
      id_recruteur: this.#idRecruteur,
      id_entreprise: this.#idEntreprise,
      nom: this.#nom,
      prenom: this.#prenom,
      ddn: this.#ddn,
      mail: this.#mail,
      tel: this.#tel,
      certif: this.#certif,
      id_document: this.#idDocument,
      id_offre: this.#idOffre,
    };
  }
}
