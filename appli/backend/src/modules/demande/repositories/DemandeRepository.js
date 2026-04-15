import { BaseRepository } from '../../../core/BaseRepository.js';
import { DemandeEntity } from '../entities/DemandeEntity.js';

export class DemandeRepository extends BaseRepository {
  async getAll() {
    const [rows] = await this.db.execute(
      'SELECT id_demande, id_user, id_offre, demande FROM demande ORDER BY id_demande DESC'
    );

    return rows.map((row) => new DemandeEntity(row));
  }

  async getById(idDemande) {
    const [rows] = await this.db.execute(
      'SELECT id_demande, id_user, id_offre, demande FROM demande WHERE id_demande = ?',
      [idDemande]
    );

    if (rows.length === 0) {
      return null;
    }

    return new DemandeEntity(rows[0]);
  }

  async findByUserAndOffre(idUser, idOffre) {
    const [rows] = await this.db.execute(
      'SELECT id_demande, id_user, id_offre, demande FROM demande WHERE id_user = ? AND id_offre = ? LIMIT 1',
      [idUser, idOffre]
    );

    if (rows.length === 0) {
      return null;
    }

    return new DemandeEntity(rows[0]);
  }

  async create(entity) {
    const payload = entity.toJSON();
    const [result] = await this.db.execute(
      'INSERT INTO demande (id_user, id_offre, demande) VALUES (?, ?, ?)',
      [payload.id_user, payload.id_offre, payload.demande]
    );

    return this.getById(result.insertId);
  }

  async update(idDemande, entity) {
    const payload = entity.toJSON();
    await this.db.execute('UPDATE demande SET id_user = ?, id_offre = ?, demande = ? WHERE id_demande = ?', [
      payload.id_user,
      payload.id_offre,
      payload.demande,
      idDemande,
    ]);

    return this.getById(idDemande);
  }

  async delete(idDemande) {
    const [result] = await this.db.execute('DELETE FROM demande WHERE id_demande = ?', [idDemande]);
    return result.affectedRows > 0;
  }
}
