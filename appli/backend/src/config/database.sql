CREATE DATABASE IF NOT EXISTS talis;
USE talis;

-- 1. Table document (Stockage des CVs et photos de profil)
CREATE TABLE IF NOT EXISTS document (
    id_document INT(11) NOT NULL AUTO_INCREMENT,
    nom VARCHAR(255) NULL,
    path VARCHAR(255) NULL,
    PRIMARY KEY (id_document)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Table entreprise
CREATE TABLE IF NOT EXISTS entreprise (
    id_entreprise INT(11) NOT NULL AUTO_INCREMENT,
    nom VARCHAR(50) NULL,
    adresse_complete VARCHAR(255) NULL,
    numero_rue INT(11) NULL,
    code_postal INT(11) NULL,
    ville VARCHAR(255) NULL,
    certif TINYINT(1) NULL,
    PRIMARY KEY (id_entreprise)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Table offre
CREATE TABLE IF NOT EXISTS offre (
    id_offre INT(11) NOT NULL AUTO_INCREMENT,
    type VARCHAR(50) NULL,
    titre VARCHAR(200) NULL,
    id_entreprise INT(11) NULL,
    date_send DATE NULL,
    date_stop DATE NULL,
    remuneration DOUBLE NULL,
    description TEXT NULL,
    PRIMARY KEY (id_offre),
    KEY fk_offre_entreprise (id_entreprise),
    CONSTRAINT fk_offre_entreprise FOREIGN KEY (id_entreprise) REFERENCES entreprise(id_entreprise)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Table user (Étudiants / Candidats)
CREATE TABLE IF NOT EXISTS `user` (
    id_user INT(11) NOT NULL AUTO_INCREMENT,
    nom VARCHAR(50) NULL,
    prenom VARCHAR(50) NULL,
    ddn DATE NULL,
    mail VARCHAR(100) NULL,
    password_hash VARCHAR(255) NULL,
    tel VARCHAR(60) NULL,
    certif TINYINT(1) NULL,
    id_document INT(11) NULL, -- CV PDF
    address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    zip_code VARCHAR(20) NULL,
    study_level VARCHAR(100) NULL,
    study_place VARCHAR(100) NULL,
    formation VARCHAR(100) NULL,
    contract_type VARCHAR(50) NULL,
    bio TEXT NULL,
    id_photo_document INT(11) NULL, -- Photo de profil liée
    PRIMARY KEY (id_user),
    UNIQUE KEY uq_user_mail (mail),
    KEY fk_user_document (id_document),
    KEY fk_user_photo_document (id_photo_document),
    CONSTRAINT fk_user_document FOREIGN KEY (id_document) REFERENCES document(id_document),
    CONSTRAINT fk_user_photo_document FOREIGN KEY (id_photo_document) REFERENCES document(id_document)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Table recruteur
CREATE TABLE IF NOT EXISTS recruteur (
    id_recruteur INT(11) NOT NULL AUTO_INCREMENT,
    id_entreprise INT(11) NOT NULL,
    nom VARCHAR(50) NULL,
    prenom VARCHAR(50) NULL,
    ddn DATE NULL,
    mail VARCHAR(100) NULL,
    password_hash VARCHAR(255) NULL,
    tel VARCHAR(60) NULL,
    certif TINYINT(1) NULL,
    id_document INT(11) NULL,
    id_offre INT(11) NULL,
    bio TEXT NULL,
    company_name VARCHAR(100) NULL,
    sector VARCHAR(100) NULL,
    job_title VARCHAR(100) NULL,
    linkedin VARCHAR(255) NULL,
    id_photo_document INT(11) NULL, -- Photo de profil liée
    PRIMARY KEY (id_recruteur),
    UNIQUE KEY uq_recruteur_mail (mail),
    KEY fk_recruteur_entreprise (id_entreprise),
    KEY fk_recruteur_document (id_document),
    KEY fk_recruteur_photo_document (id_photo_document),
    KEY fk_recruteur_offre (id_offre),
    CONSTRAINT fk_recruteur_entreprise FOREIGN KEY (id_entreprise) REFERENCES entreprise(id_entreprise),
    CONSTRAINT fk_recruteur_document FOREIGN KEY (id_document) REFERENCES document(id_document),
    CONSTRAINT fk_recruteur_photo_document FOREIGN KEY (id_photo_document) REFERENCES document(id_document),
    CONSTRAINT fk_recruteur_offre FOREIGN KEY (id_offre) REFERENCES offre(id_offre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 6. Table demande (Candidatures)
CREATE TABLE IF NOT EXISTS demande (
    id_demande INT(11) NOT NULL AUTO_INCREMENT,
    id_user INT(11) NOT NULL,
    id_offre INT(11) NOT NULL,
    date_envoi DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    demande VARCHAR(100) NOT NULL DEFAULT 'En attente',
    PRIMARY KEY (id_demande),
    UNIQUE KEY uq_demande_user_offre (id_user, id_offre),
    KEY fk_demande_offre (id_offre),
    CONSTRAINT fk_demande_offre FOREIGN KEY (id_offre) REFERENCES offre(id_offre),
    CONSTRAINT fk_demande_user FOREIGN KEY (id_user) REFERENCES `user`(id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;