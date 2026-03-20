export class BookingEntity {
  #id;
  #roomId;
  #customerName;
  #date;
  #startHour;

  constructor({ id = null, roomId, customerName, date, start_hour }) {
    this.#id = id;
    this.#roomId = roomId;
    this.#customerName = customerName;
    this.#date = new Date(date);
    this.#startHour = start_hour;
  }

  setStartHour(hour) {
    if (hour < 0 || hour > 23) {
      throw new Error("L'heure de début doit être comprise entre 0 et 23.");
    }
    this.#startHour = hour;
  }

  get id() { return this.#id; }
  get roomId() { return this.#roomId; }
  get customerName() { return this.#customerName; }
  get date() { return this.#date.toISOString().split('T')[0]; }
  get startHour() { return this.#startHour; }

  // Pour l'affichage ou les logs sans exposer les membres privés
  toJSON() {
    return {
      id: this.#id,
      roomId: this.#roomId,
      customerName: this.#customerName,
      date: this.date,
      startHour: this.#startHour
    };
  }
}