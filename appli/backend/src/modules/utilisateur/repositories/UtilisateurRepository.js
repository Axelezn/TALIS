import { BaseRepository } from '../../../core/BaseRepository.js';
import { UtilisateurEntity } from '../entities/UtilisateurEntity.js';

export class UtilisateurRepository extends BaseRepository {
  async getAll() {
    const [rows] = await this.db.execute(
      'SELECT id_user, nom, prenom, ddn, mail, tel, certif, id_document FROM `user` ORDER BY id_user DESC'
    );

    return rows.map((row) => new UtilisateurEntity(row));
  }

  async getById(idUser) {
    const [rows] = await this.db.execute(
      'SELECT id_user, nom, prenom, ddn, mail, tel, certif, id_document FROM `user` WHERE id_user = ?',
      [idUser]
    );

    if (rows.length === 0) {
      return null;
    }

    return new UtilisateurEntity(rows[0]);
  }

  async create(entity) {
    const payload = entity.toJSON();
    const [result] = await this.db.execute(
      `INSERT INTO \`user\` (nom, prenom, ddn, mail, tel, certif, id_document)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.nom,
        payload.prenom,
        payload.ddn,
        payload.mail,
        payload.tel,
        payload.certif,
        payload.id_document,
      ]
    );

    return this.getById(result.insertId);
  }

  async update(idUser, entity) {
    const payload = entity.toJSON();
    await this.db.execute(
      `UPDATE \`user\`
       SET nom = ?, prenom = ?, ddn = ?, mail = ?, tel = ?, certif = ?, id_document = ?
       WHERE id_user = ?`,
      [
        payload.nom,
        payload.prenom,
        payload.ddn,
        payload.mail,
        payload.tel,
        payload.certif,
        payload.id_document,
        idUser,
      ]
    );

    return this.getById(idUser);
  }

  async delete(idUser) {
    const [result] = await this.db.execute('DELETE FROM `user` WHERE id_user = ?', [idUser]);
    return result.affectedRows > 0;
  }
}
