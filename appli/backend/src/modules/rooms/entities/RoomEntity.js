export class RoomEntity {
  #id;
  #name;
  #capacity;

  constructor({ id = null, name, capacity }) {
    this.#id = id;
    this.#name = name;
    this.#capacity=capacity;
  }

  // Setters pour modifier les données
  setCapacity(value) {
    if (value <= 0) {
      throw new Error("La capacité d'une salle doit être supérieure à 0.");
    }
    this.#capacity = value;
  }

  setName(value) {
    if (value == "") {
      throw new Error("Le nom ne peut être vide.");
    }
    this.#name = value;
  }

  // Getters pour exposer les données en lecture seule
  get id() { return this.#id; }
  get name() { return this.#name; }
  get capacity() { return this.#capacity; }

  // On peut imaginer une méthode métier
  isLargeEnough(peopleCount) {
    return peopleCount <= this.#capacity;
  }
}