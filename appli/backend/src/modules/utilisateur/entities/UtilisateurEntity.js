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
  #address;
  #city;
  #zipCode;
  #studyLevel;
  #studyPlace;
  #formation;
  #contractType;
  #bio;
  #idPhotoDocument;

  constructor(data = {}) {
    this.#idUser = toOptionalPositiveInt(data.id_user, 'id_user');
    this.#nom = toOptionalString(data.nom, 'nom', 50);
    this.#prenom = toOptionalString(data.prenom, 'prenom', 50);
    this.#ddn = toOptionalDate(data.ddn, 'ddn');
    this.#mail = toOptionalString(data.mail, 'mail', 100);
    this.#tel = toOptionalString(data.tel, 'tel', 60);
    this.#certif = toOptionalTinyIntFlag(data.certif, 'certif');
    this.#idDocument = toOptionalPositiveInt(data.id_document, 'id_document');
    this.#address = toOptionalString(data.address, 'address', 255);
    this.#city = toOptionalString(data.city, 'city', 100);
    this.#zipCode = toOptionalString(data.zip_code || data.zipCode, 'zip_code', 20);
    this.#studyLevel = toOptionalString(data.study_level || data.studyLevel, 'study_level', 100);
    this.#studyPlace = toOptionalString(data.study_place || data.studyPlace, 'study_place', 100);
    this.#formation = toOptionalString(data.formation, 'formation', 100);
    this.#contractType = toOptionalString(data.contract_type || data.contractType, 'contract_type', 50);
    this.#bio = toOptionalString(data.bio, 'bio', 65535);
    this.#idPhotoDocument = toOptionalPositiveInt(data.id_photo_document || data.idPhotoDocument, 'id_photo_document');
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
      address: this.#address,
      city: this.#city,
      zipCode: this.#zipCode,
      zip_code: this.#zipCode,
      studyLevel: this.#studyLevel,
      study_level: this.#studyLevel,
      studyPlace: this.#studyPlace,
      study_place: this.#studyPlace,
      formation: this.#formation,
      contractType: this.#contractType,
      contract_type: this.#contractType,
      bio: this.#bio,
      id_photo_document: this.#idPhotoDocument,
    };
  }
}
