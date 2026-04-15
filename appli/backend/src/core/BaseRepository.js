// classe abstraite
export class BaseRepository {
  #db;

  constructor(db) {
    if (this.constructor === BaseRepository) {
      throw new Error("BaseRepository est une classe abstraite.");
    }
    this.#db = db;
  }

  // Getter protégé pour les classes filles
  get db() {
    return this.#db;
  }
}