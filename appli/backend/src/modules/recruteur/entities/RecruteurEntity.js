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
  #bio;
  #companyName;
  #sector;
  #jobTitle;
  #linkedin;
  #idPhotoDocument;

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
    this.#bio = toOptionalString(data.bio, 'bio', 65535);
    this.#companyName = toOptionalString(data.company_name || data.companyName, 'company_name', 100);
    this.#sector = toOptionalString(data.sector, 'sector', 100);
    this.#jobTitle = toOptionalString(data.job_title || data.jobTitle, 'job_title', 100);
    this.#linkedin = toOptionalString(data.linkedin, 'linkedin', 255);
    this.#idPhotoDocument = toOptionalPositiveInt(data.id_photo_document || data.idPhotoDocument, 'id_photo_document');
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
      bio: this.#bio,
      companyName: this.#companyName,
      company_name: this.#companyName,
      sector: this.#sector,
      jobTitle: this.#jobTitle,
      job_title: this.#jobTitle,
      linkedin: this.#linkedin,
      id_photo_document: this.#idPhotoDocument,
    };
  }
}
