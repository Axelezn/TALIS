-- Création de la base de données
CREATE DATABASE IF NOT EXISTS room_booking_system;
USE room_booking_system;

-- Table des salles
-- On utilise UNSIGNED pour la capacité car une capacité négative est une aberration logique.
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    capacity INT UNSIGNED NOT NULL
) ENGINE=InnoDB;

-- Table des réservations
-- L'index UNIQUE sur (room_id, date, start_hour) est CRUCIAL.
-- Il empêche physiquement d'avoir deux réservations pour la même salle au même moment.
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    booking_date DATE NOT NULL,
    start_hour TINYINT UNSIGNED NOT NULL CHECK (start_hour BETWEEN 0 AND 23),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contrainte d'intégrité référentielle
    CONSTRAINT fk_room
        FOREIGN KEY (room_id) 
        REFERENCES rooms(id)
        ON DELETE CASCADE,

    -- Contrainte d'unicité métier : une salle, une date, une heure = une seule ligne possible
    UNIQUE KEY unique_booking_slot (room_id, booking_date, start_hour)
) ENGINE=InnoDB;