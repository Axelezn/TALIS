import { BaseRepository } from '../../../core/BaseRepository.js';
import { RecruteurEntity } from '../entities/RecruteurEntity.js';

export class RecruteurRepository extends BaseRepository {
  async getAll() {
    const [rows] = await this.db.execute(
      `SELECT id_recruteur, id_entreprise, nom, prenom, ddn, mail, tel, certif, id_document, id_offre, bio, company_name, sector, job_title, linkedin, id_photo_document
       FROM recruteur
       ORDER BY id_recruteur DESC`
    );

    return rows.map((row) => new RecruteurEntity(row));
  }

  async getById(idRecruteur) {
    const [rows] = await this.db.execute(
      `SELECT id_recruteur, id_entreprise, nom, prenom, ddn, mail, tel, certif, id_document, id_offre, bio, company_name, sector, job_title, linkedin, id_photo_document
       FROM recruteur
       WHERE id_recruteur = ?`,
      [idRecruteur]
    );

    if (rows.length === 0) {
      return null;
    }

    return new RecruteurEntity(rows[0]);
  }

  async create(entity) {
    const payload = entity.toJSON();
    const [result] = await this.db.execute(
      `INSERT INTO recruteur
       (id_entreprise, nom, prenom, ddn, mail, tel, certif, id_document, id_offre, bio, company_name, sector, job_title, linkedin, id_photo_document)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.id_entreprise,
        payload.nom,
        payload.prenom,
        payload.ddn,
        payload.mail,
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

    return this.getById(result.insertId);
  }

  async update(idRecruteur, entity) {
    const payload = entity.toJSON();
    await this.db.execute(
      `UPDATE recruteur
       SET id_entreprise = ?, nom = ?, prenom = ?, ddn = ?, mail = ?, tel = ?, certif = ?, id_document = ?, id_offre = ?, bio = ?, company_name = ?, sector = ?, job_title = ?, linkedin = ?, id_photo_document = ?
       WHERE id_recruteur = ?`,
      [
        payload.id_entreprise,
        payload.nom,
        payload.prenom,
        payload.ddn,
        payload.mail,
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
        idRecruteur,
      ]
    );

    return this.getById(idRecruteur);
  }

  async delete(idRecruteur) {
    const [result] = await this.db.execute('DELETE FROM recruteur WHERE id_recruteur = ?', [idRecruteur]);
    return result.affectedRows > 0;
  }
}
