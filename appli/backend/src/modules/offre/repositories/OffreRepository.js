import { BaseRepository } from '../../../core/BaseRepository.js';
import { OffreEntity } from '../entities/OffreEntity.js';

const SELECT_FIELDS = `
  o.id_offre, o.type, o.titre, o.id_entreprise, o.date_send, o.date_stop, o.remuneration, o.description,
  e.nom AS entreprise, e.ville AS localisation
`;

export class OffreRepository extends BaseRepository {
  async getAll() {
    const [rows] = await this.db.execute(
      `SELECT ${SELECT_FIELDS}
       FROM offre o
       LEFT JOIN entreprise e ON e.id_entreprise = o.id_entreprise
       ORDER BY o.id_offre DESC`
    );

    return rows.map((row) => new OffreEntity(row));
  }

  async getById(idOffre) {
    const [rows] = await this.db.execute(
      `SELECT ${SELECT_FIELDS}
       FROM offre o
       LEFT JOIN entreprise e ON e.id_entreprise = o.id_entreprise
       WHERE o.id_offre = ?`,
      [idOffre]
    );

    if (rows.length === 0) {
      return null;
    }

    return new OffreEntity(rows[0]);
  }

  async create(entity) {
    const payload = entity.toJSON();
    const [result] = await this.db.execute(
      `INSERT INTO offre (type, titre, id_entreprise, date_send, date_stop, remuneration, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.type,
        payload.titre,
        payload.id_entreprise,
        payload.date_send,
        payload.date_stop,
        payload.remuneration,
        payload.description,
      ]
    );

    return this.getById(result.insertId);
  }

  async update(idOffre, entity) {
    const payload = entity.toJSON();
    await this.db.execute(
      `UPDATE offre
       SET type = ?, titre = ?, id_entreprise = ?, date_send = ?, date_stop = ?, remuneration = ?, description = ?
       WHERE id_offre = ?`,
      [
        payload.type,
        payload.titre,
        payload.id_entreprise,
        payload.date_send,
        payload.date_stop,
        payload.remuneration,
        payload.description,
        idOffre,
      ]
    );

    return this.getById(idOffre);
  }

  async delete(idOffre) {
    const [result] = await this.db.execute('DELETE FROM offre WHERE id_offre = ?', [idOffre]);
    return result.affectedRows > 0;
  }
}
