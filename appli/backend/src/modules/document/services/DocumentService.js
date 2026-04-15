import { AppError } from '../../../core/AppError.js';
import { toRequiredPositiveInt } from '../../../core/validators.js';
import { DocumentEntity } from '../entities/DocumentEntity.js';

export class DocumentService {
  constructor(documentRepository) {
    this.documentRepository = documentRepository;
  }

  async getAll() {
    return this.documentRepository.getAll();
  }

  async getById(idDocument) {
    const parsedId = toRequiredPositiveInt(idDocument, 'id_document');
    const document = await this.documentRepository.getById(parsedId);

    if (!document) {
      throw new AppError('Document introuvable.', 404);
    }

    return document;
  }

  async create(data) {
    const document = new DocumentEntity(data);
    return this.documentRepository.create(document);
  }

  async update(idDocument, data) {
    const parsedId = toRequiredPositiveInt(idDocument, 'id_document');
    const existing = await this.documentRepository.getById(parsedId);

    if (!existing) {
      throw new AppError('Document introuvable.', 404);
    }

    const merged = new DocumentEntity({
      ...existing.toJSON(),
      ...data,
      id_document: parsedId,
    });

    return this.documentRepository.update(parsedId, merged);
  }

  async delete(idDocument) {
    const parsedId = toRequiredPositiveInt(idDocument, 'id_document');
    const deleted = await this.documentRepository.delete(parsedId);

    if (!deleted) {
      throw new AppError('Document introuvable.', 404);
    }
  }
}
