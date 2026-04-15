import { BaseRepository } from '../../../core/BaseRepository.js';
import { EntrepriseEntity } from '../entities/EntrepriseEntity.js';

export class EntrepriseRepository extends BaseRepository {
  async getAll() {
    const [rows] = await this.db.execute(
      `SELECT id_entreprise, nom, adresse_complete, numero_rue, code_postal, ville, certif
       FROM entreprise
       ORDER BY id_entreprise DESC`
    );

    return rows.map((row) => new EntrepriseEntity(row));
  }

  async getById(idEntreprise) {
    const [rows] = await this.db.execute(
      `SELECT id_entreprise, nom, adresse_complete, numero_rue, code_postal, ville, certif
       FROM entreprise
       WHERE id_entreprise = ?`,
      [idEntreprise]
    );

    if (rows.length === 0) {
      return null;
    }

    return new EntrepriseEntity(rows[0]);
  }

  async create(entity) {
    const payload = entity.toJSON();
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

    return this.getById(result.insertId);
  }

  async update(idEntreprise, entity) {
    const payload = entity.toJSON();
    await this.db.execute(
      `UPDATE entreprise
       SET nom = ?, adresse_complete = ?, numero_rue = ?, code_postal = ?, ville = ?, certif = ?
       WHERE id_entreprise = ?`,
      [
        payload.nom,
        payload.adresse_complete,
        payload.numero_rue,
        payload.code_postal,
        payload.ville,
        payload.certif,
        idEntreprise,
      ]
    );

    return this.getById(idEntreprise);
  }

  async delete(idEntreprise) {
    const [result] = await this.db.execute('DELETE FROM entreprise WHERE id_entreprise = ?', [idEntreprise]);
    return result.affectedRows > 0;
  }
}
