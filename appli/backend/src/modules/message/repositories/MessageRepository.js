import { BaseRepository } from '../../../core/BaseRepository.js';
import { MessageEntity } from '../entities/MessageEntity.js';

// expediteur_id est polymorphe (user.id_user si etudiant, recruteur.id_recruteur si entreprise) :
// on resout le nom d'affichage avec deux LEFT JOIN mutuellement exclusifs plutot qu'une FK directe.
const SELECT_FIELDS = `
  m.id_message, m.id_demande, m.expediteur_role, m.expediteur_id, m.contenu, m.date_envoi, m.lu,
  COALESCE(u.nom, r.nom) AS expediteur_nom,
  COALESCE(u.prenom, r.prenom) AS expediteur_prenom
`;

const FROM_CLAUSE = `
  FROM message m
  LEFT JOIN \`user\` u ON u.id_user = m.expediteur_id AND m.expediteur_role = 'etudiant'
  LEFT JOIN recruteur r ON r.id_recruteur = m.expediteur_id AND m.expediteur_role = 'entreprise'
`;

export class MessageRepository extends BaseRepository {
  async getByDemande(idDemande) {
    const [rows] = await this.db.execute(
      `SELECT ${SELECT_FIELDS} ${FROM_CLAUSE}
       WHERE m.id_demande = ?
       ORDER BY m.date_envoi ASC, m.id_message ASC`,
      [idDemande]
    );

    return rows.map((row) => new MessageEntity(row));
  }

  async getById(idMessage) {
    const [rows] = await this.db.execute(
      `SELECT ${SELECT_FIELDS} ${FROM_CLAUSE} WHERE m.id_message = ?`,
      [idMessage]
    );

    if (rows.length === 0) {
      return null;
    }

    return new MessageEntity(rows[0]);
  }

  async create(entity) {
    const payload = entity.toJSON();
    const [result] = await this.db.execute(
      'INSERT INTO message (id_demande, expediteur_role, expediteur_id, contenu) VALUES (?, ?, ?, ?)',
      [payload.id_demande, payload.expediteur_role, payload.expediteur_id, payload.contenu]
    );

    return this.getById(result.insertId);
  }

  // Marque comme lus les messages envoyes par "l'autre" partie (celle qui n'est pas viewerRole).
  async markAsRead(idDemande, viewerRole) {
    await this.db.execute(
      'UPDATE message SET lu = 1 WHERE id_demande = ? AND expediteur_role <> ? AND lu = 0',
      [idDemande, viewerRole]
    );
  }

  // Verifie que (role, id) est bien l'une des deux parties de cette demande :
  // l'etudiant qui a candidate, ou un recruteur de l'entreprise proprietaire de l'offre.
  async isParticipant(idDemande, role, id) {
    if (role === 'etudiant') {
      const [rows] = await this.db.execute(
        'SELECT 1 FROM demande WHERE id_demande = ? AND id_user = ? LIMIT 1',
        [idDemande, id]
      );
      return rows.length > 0;
    }

    if (role === 'entreprise') {
      const [rows] = await this.db.execute(
        `SELECT 1
         FROM demande d
         JOIN offre o ON o.id_offre = d.id_offre
         JOIN recruteur r ON r.id_entreprise = o.id_entreprise
         WHERE d.id_demande = ? AND r.id_recruteur = ?
         LIMIT 1`,
        [idDemande, id]
      );
      return rows.length > 0;
    }

    return false;
  }
}
