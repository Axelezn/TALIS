import fs from 'fs';
import path from 'path';
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
    let finalPath = data.path;

    if (data.fileData) {
      // Decode base64 payload
      const matches = data.fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const fileType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Find extension (e.g., pdf, png, jpeg)
        let extension = 'bin';
        if (fileType.includes('pdf')) {
          extension = 'pdf';
        } else if (fileType.includes('png')) {
          extension = 'png';
        } else if (fileType.includes('jpeg') || fileType.includes('jpg')) {
          extension = 'jpg';
        } else {
          extension = fileType.split('/')[1] || 'bin';
        }

        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;
        
        // Save dynamically inside 'uploads' directory
        const uploadDir = path.resolve(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        
        // Store path in table (e.g. 'uploads/17186123456_a1b2c.pdf')
        finalPath = `uploads/${fileName}`;
      }
    }

    const document = new DocumentEntity({
      nom: data.nom,
      path: finalPath,
    });
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
