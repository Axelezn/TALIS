import { BaseRepository } from '../../../core/BaseRepository.js';
import { DocumentEntity } from '../entities/DocumentEntity.js';

export class DocumentRepository extends BaseRepository {
  async getAll() {
    const [rows] = await this.db.execute(
      'SELECT id_document, nom, path FROM document ORDER BY id_document DESC'
    );

    return rows.map((row) => new DocumentEntity(row));
  }

  async getById(idDocument) {
    const [rows] = await this.db.execute(
      'SELECT id_document, nom, path FROM document WHERE id_document = ?',
      [idDocument]
    );

    if (rows.length === 0) {
      return null;
    }

    return new DocumentEntity(rows[0]);
  }

  async create(entity) {
    const payload = entity.toJSON();
    const [result] = await this.db.execute(
      'INSERT INTO document (nom, path) VALUES (?, ?)',
      [payload.nom, payload.path]
    );

    return this.getById(result.insertId);
  }

  async update(idDocument, entity) {
    const payload = entity.toJSON();
    await this.db.execute('UPDATE document SET nom = ?, path = ? WHERE id_document = ?', [
      payload.nom,
      payload.path,
      idDocument,
    ]);

    return this.getById(idDocument);
  }

  async delete(idDocument) {
    const [result] = await this.db.execute('DELETE FROM document WHERE id_document = ?', [idDocument]);
    return result.affectedRows > 0;
  }
}
