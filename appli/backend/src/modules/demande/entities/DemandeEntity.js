import { toOptionalDate, toOptionalPositiveInt, toOptionalString } from '../../../core/validators.js';

export class DemandeEntity {
  #idDemande;
  #idUser;
  #idOffre;
  #dateEnvoi;
  #demande;
  // Champs deduits via JOIN, presents uniquement sur les vues de suivi (getByUser/getByEntreprise).
  #titre;
  #typeOffre;
  #entreprise;
  #localisation;
  #candidatNom;
  #candidatPrenom;
  #candidatMail;

  constructor(data = {}) {
    this.#idDemande = toOptionalPositiveInt(data.id_demande, 'id_demande');
    this.#idUser = toOptionalPositiveInt(data.id_user, 'id_user');
    this.#idOffre = toOptionalPositiveInt(data.id_offre, 'id_offre');
    this.#dateEnvoi = toOptionalDate(data.date_envoi, 'date_envoi');
    this.#demande = toOptionalString(data.demande, 'demande', 100) || 'En attente';
    this.#titre = toOptionalString(data.titre, 'titre', 200);
    this.#typeOffre = toOptionalString(data.type, 'type', 50);
    this.#entreprise = toOptionalString(data.entreprise, 'entreprise', 50);
    this.#localisation = toOptionalString(data.localisation, 'localisation', 255);
    this.#candidatNom = toOptionalString(data.candidat_nom, 'candidat_nom', 50);
    this.#candidatPrenom = toOptionalString(data.candidat_prenom, 'candidat_prenom', 50);
    this.#candidatMail = toOptionalString(data.candidat_mail, 'candidat_mail', 100);
  }

  toJSON() {
    return {
      id_demande: this.#idDemande,
      id_user: this.#idUser,
      id_offre: this.#idOffre,
      date_envoi: this.#dateEnvoi,
      demande: this.#demande,
      titre: this.#titre,
      type: this.#typeOffre,
      entreprise: this.#entreprise,
      localisation: this.#localisation,
      candidat_nom: this.#candidatNom,
      candidat_prenom: this.#candidatPrenom,
      candidat_mail: this.#candidatMail,
    };
  }
}
