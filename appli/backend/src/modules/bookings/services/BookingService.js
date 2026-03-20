import { BookingEntity } from '../entities/BookingEntity.js';

export class BookingService {
  #bookingRepository;
  #roomRepository;

  constructor(bookingRepository, roomRepository) {
    this.#bookingRepository = bookingRepository;
    this.#roomRepository = roomRepository;
  }

  /**
   * Orchestre la création d'une réservation avec validations métier
   */
  async createReservation(bookingData) {
    // 1. Vérifier si la salle existe
    const room = await this.#roomRepository.findById(bookingData.roomId);
    if (!room) {
      throw new Error(`La salle avec l'ID ${bookingData.roomId} n'existe pas.`);
    }

    // 2. Vérifier la disponibilité (Logique métier)
    const isAvailable = await this.#bookingRepository.isSlotAvailable(
      bookingData.roomId,
      bookingData.date,
      bookingData.start_hour
    );

    if (!isAvailable) {
      throw new Error("Cette salle est déjà réservée pour ce créneau horaire.");
    }

    // 3. Instancier l'entité (les validations privées du # s'exécutent ici)
    const newBooking = new BookingEntity(bookingData);

    // 4. Persistance
    const insertedId = await this.#bookingRepository.save(newBooking);
    
    return {
      message: "Réservation confirmée",
      id: insertedId
    };
  }
}