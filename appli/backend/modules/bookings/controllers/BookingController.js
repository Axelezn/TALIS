export class BookingController {
  #bookingService;

  constructor(bookingService) {
    this.#bookingService = bookingService;
  }

  /**
   * POST /bookings
   */
  async create(req, res) {
    try {
      // Extraction et formatage minimal si nécessaire
      const { roomId, customerName, date, start_hour } = req.body;

      // Appel du service
      const result = await this.#bookingService.createReservation({
        roomId,
        customerName,
        date,
        start_hour
      });

      // Réponse de succès (201 Created)
      return res.status(201).json(result);

    } catch (error) {
      // Gestion des erreurs métier (400) ou technique (500)
      const statusCode = error.message.includes('existe pas') || 
                         error.message.includes('déjà réservée') ? 400 : 500;
      
      return res.status(statusCode).json({
        error: error.message
      });
    }
  }
}