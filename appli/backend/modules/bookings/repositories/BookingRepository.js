import { BaseRepository } from '../../../core/BaseRepository.js';
import { BookingEntity } from '../entities/BookingEntity.js';

export class BookingRepository extends BaseRepository {
  
  async isSlotAvailable(roomId, date, hour) {
    const [rows] = await this.db.query(
      'SELECT id FROM bookings WHERE room_id = ? AND booking_date = ? AND start_hour = ?',
      [roomId, date, hour]
    );
    return rows.length === 0;
  }

  async save(bookingEntity) {
    const [result] = await this.db.query(
      'INSERT INTO bookings (room_id, customer_name, booking_date, start_hour) VALUES (?, ?, ?, ?)',
      [
        bookingEntity.roomId, 
        bookingEntity.customerName, 
        bookingEntity.date, 
        bookingEntity.startHour
      ]
    );
    return result.insertId;
  }
}