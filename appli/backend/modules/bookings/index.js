import { BookingRepository } from './repositories/BookingRepository.js';
import { BookingService } from './services/BookingService.js';
import { BookingController } from './controllers/BookingController.js';
import { RoomRepository } from '../rooms/repositories/RoomRepository.js';
import express from 'express';

export function setupBookingModule(db) {
  const router = express.Router();

  // Initialisation des dépendances (Injection de dépendances manuelle)
  const roomRepo = new RoomRepository(db);
  const bookingRepo = new BookingRepository(db);
  const bookingService = new BookingService(bookingRepo, roomRepo);
  const bookingController = new BookingController(bookingService);

  // Définition des routes
  router.post('/', (req, res) => bookingController.create(req, res));

  return router;
}