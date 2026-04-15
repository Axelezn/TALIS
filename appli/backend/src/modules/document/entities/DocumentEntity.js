import { toOptionalPositiveInt, toOptionalString } from '../../../core/validators.js';

export class DocumentEntity {
  #idDocument;
  #nom;
  #path;

  constructor(data = {}) {
    this.#idDocument = toOptionalPositiveInt(data.id_document, 'id_document');
    this.#nom = toOptionalString(data.nom, 'nom', 255);
    this.#path = toOptionalString(data.path, 'path', 255);
  }

  toJSON() {
    return {
      id_document: this.#idDocument,
      nom: this.#nom,
      path: this.#path,
    };
  }
}
