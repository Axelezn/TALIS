import { BaseRepository } from '../../../core/BaseRepository.js';
import { RoomEntity } from '../entities/RoomEntity.js';

export class RoomRepository extends BaseRepository {
  
  async findAll() {
    const [rows] = await this.db.query('SELECT * FROM rooms');
    // On mappe chaque ligne SQL vers une instance d'entité
    return rows.map(row => new RoomEntity(row));
  }

  async findById(id) {
    const [rows] = await this.db.query('SELECT * FROM rooms WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    return new RoomEntity(rows[0]);
  }

  async create(roomEntity) {
    const [result] = await this.db.query(
      'INSERT INTO rooms (name, capacity) VALUES (?, ?)',
      [roomEntity.name, roomEntity.capacity]
    );
    return result.insertId;
  }
}