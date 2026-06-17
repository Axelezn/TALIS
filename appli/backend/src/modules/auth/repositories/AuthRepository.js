import { BaseRepository } from '../../../core/BaseRepository.js';

export class AuthRepository extends BaseRepository {
  async findUserByEmail(mail) {
    const [rows] = await this.db.execute(
      `SELECT id_user AS id, nom, prenom, mail, password_hash
       FROM \`user\`
       WHERE mail = ?
       LIMIT 1`,
      [mail]
    );

    if (rows.length === 0) {
      return null;
    }

    return {
      role: 'etudiant',
      id: rows[0].id,
      nom: rows[0].nom,
      prenom: rows[0].prenom,
      mail: rows[0].mail,
      password_hash: rows[0].password_hash,
    };
  }

  async findRecruteurByEmail(mail) {
    const [rows] = await this.db.execute(
      `SELECT id_recruteur AS id, id_entreprise, nom, prenom, mail, password_hash
       FROM recruteur
       WHERE mail = ?
       LIMIT 1`,
      [mail]
    );

    if (rows.length === 0) {
      return null;
    }

    return {
      role: 'entreprise',
      id: rows[0].id,
      id_entreprise: rows[0].id_entreprise,
      nom: rows[0].nom,
      prenom: rows[0].prenom,
      mail: rows[0].mail,
      password_hash: rows[0].password_hash,
    };
  }

  async createUserAccount(payload) {
    const [result] = await this.db.execute(
      `INSERT INTO \`user\` (nom, prenom, ddn, mail, password_hash, tel, certif, id_document, address, city, zip_code, study_level, study_place, formation, contract_type, bio, id_photo_document)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.nom,
        payload.prenom,
        payload.ddn,
        payload.mail,
        payload.password_hash,
        payload.tel,
        payload.certif,
        payload.id_document,
        payload.address,
        payload.city,
        payload.zip_code,
        payload.study_level,
        payload.study_place,
        payload.formation,
        payload.contract_type,
        payload.bio,
        payload.id_photo_document,
      ]
    );

    const [rows] = await this.db.execute(
      'SELECT id_user, nom, prenom, mail FROM `user` WHERE id_user = ?',
      [result.insertId]
    );

    return rows[0] || null;
  }

  async createEntreprise(payload) {
    const [result] = await this.db.execute(
      `INSERT INTO entreprise (nom, adresse_complete, numero_rue, code_postal, ville, certif)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payload.nom,
        payload.adresse_complete,
        payload.numero_rue,
        payload.code_postal,
        payload.ville,
        payload.certif,
      ]
    );

    return result.insertId;
  }

  async createRecruteurAccount(payload) {
    const [result] = await this.db.execute(
      `INSERT INTO recruteur (id_entreprise, nom, prenom, ddn, mail, password_hash, tel, certif, id_document, id_offre, bio, company_name, sector, job_title, linkedin, id_photo_document)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.id_entreprise,
        payload.nom,
        payload.prenom,
        payload.ddn,
        payload.mail,
        payload.password_hash,
        payload.tel,
        payload.certif,
        payload.id_document,
        payload.id_offre,
        payload.bio,
        payload.company_name,
        payload.sector,
        payload.job_title,
        payload.linkedin,
        payload.id_photo_document,
      ]
    );

    const [rows] = await this.db.execute(
      `SELECT id_recruteur, id_entreprise, nom, prenom, mail
       FROM recruteur
       WHERE id_recruteur = ?`,
      [result.insertId]
    );

    return rows[0] || null;
  }
}
