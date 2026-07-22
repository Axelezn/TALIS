import { BaseRepository } from '../../../core/BaseRepository.js';
import { DemandeEntity } from '../entities/DemandeEntity.js';

export class DemandeRepository extends BaseRepository {
  async getAll() {
    const [rows] = await this.db.execute(
      'SELECT id_demande, id_user, id_offre, date_envoi, demande FROM demande ORDER BY id_demande DESC'
    );

    return rows.map((row) => new DemandeEntity(row));
  }

  async getById(idDemande) {
    const [rows] = await this.db.execute(
      'SELECT id_demande, id_user, id_offre, date_envoi, demande FROM demande WHERE id_demande = ?',
      [idDemande]
    );

    if (rows.length === 0) {
      return null;
    }

    return new DemandeEntity(rows[0]);
  }

  async findByUserAndOffre(idUser, idOffre) {
    const [rows] = await this.db.execute(
      'SELECT id_demande, id_user, id_offre, date_envoi, demande FROM demande WHERE id_user = ? AND id_offre = ? LIMIT 1',
      [idUser, idOffre]
    );

    if (rows.length === 0) {
      return null;
    }

    return new DemandeEntity(rows[0]);
  }

  // Suivi des candidatures d'un candidat : ses demandes + l'offre et l'entreprise visees.
  async getByUser(idUser) {
    const [rows] = await this.db.execute(
      `SELECT d.id_demande, d.id_user, d.id_offre, d.date_envoi, d.demande,
              o.titre, o.type, e.nom AS entreprise, e.ville AS localisation
       FROM demande d
       JOIN offre o ON o.id_offre = d.id_offre
       LEFT JOIN entreprise e ON e.id_entreprise = o.id_entreprise
       WHERE d.id_user = ?
       ORDER BY d.date_envoi DESC, d.id_demande DESC`,
      [idUser]
    );

    return rows.map((row) => new DemandeEntity(row));
  }

  // Suivi des candidatures recues par un recruteur : demandes sur les offres de son entreprise.
  async getByEntreprise(idEntreprise) {
    const [rows] = await this.db.execute(
      `SELECT d.id_demande, d.id_user, d.id_offre, d.date_envoi, d.demande,
              o.titre, o.type, u.nom AS candidat_nom, u.prenom AS candidat_prenom, u.mail AS candidat_mail
       FROM demande d
       JOIN offre o ON o.id_offre = d.id_offre
       JOIN \`user\` u ON u.id_user = d.id_user
       WHERE o.id_entreprise = ?
       ORDER BY d.date_envoi DESC, d.id_demande DESC`,
      [idEntreprise]
    );

    return rows.map((row) => new DemandeEntity(row));
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
