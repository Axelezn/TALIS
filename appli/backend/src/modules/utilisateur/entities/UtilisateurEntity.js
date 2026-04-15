import {
  toOptionalDate,
  toOptionalPositiveInt,
  toOptionalString,
  toOptionalTinyIntFlag,
} from '../../../core/validators.js';

export class UtilisateurEntity {
  #idUser;
  #nom;
  #prenom;
  #ddn;
  #mail;
  #tel;
  #certif;
  #idDocument;

  constructor(data = {}) {
    this.#idUser = toOptionalPositiveInt(data.id_user, 'id_user');
    this.#nom = toOptionalString(data.nom, 'nom', 50);
    this.#prenom = toOptionalString(data.prenom, 'prenom', 50);
    this.#ddn = toOptionalDate(data.ddn, 'ddn');
    this.#mail = toOptionalString(data.mail, 'mail', 100);
    this.#tel = toOptionalString(data.tel, 'tel', 60);
    this.#certif = toOptionalTinyIntFlag(data.certif, 'certif');
    this.#idDocument = toOptionalPositiveInt(data.id_document, 'id_document');
  }

  toJSON() {
    return {
      id_user: this.#idUser,
      nom: this.#nom,
      prenom: this.#prenom,
      ddn: this.#ddn,
      mail: this.#mail,
      tel: this.#tel,
      certif: this.#certif,
      id_document: this.#idDocument,
    };
  }
}
