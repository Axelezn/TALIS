-- Creation de la table document
CREATE TABLE document (
    id_document INT AUTO_INCREMENT,
    nom VARCHAR(255),
    path VARCHAR(255),
    PRIMARY KEY (id_document)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creation de la table entreprise
CREATE TABLE entreprise (
    id_entreprise INT AUTO_INCREMENT,
    nom VARCHAR(50),
    adresse_complete VARCHAR(255),
    numero_rue INT,
    code_postal INT,
    ville VARCHAR(255),
    certif BOOLEAN,
    PRIMARY KEY (id_entreprise)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creation de la table user (Utilisateur)
CREATE TABLE `user` (
    id_user INT AUTO_INCREMENT,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    ddn DATE,
    mail VARCHAR(100),
    tel VARCHAR(60),
    certif BOOLEAN,
    id_document INT NULL,
    PRIMARY KEY (id_user),
    CONSTRAINT fk_user_document FOREIGN KEY (id_document) REFERENCES document (id_document)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creation de la table offre
CREATE TABLE offre (
    id_offre INT AUTO_INCREMENT,
    type VARCHAR(50),
    titre VARCHAR(200),
    date_send DATE,
    date_stop DATE,
    remuneration DOUBLE,
    description TEXT,
    PRIMARY KEY (id_offre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creation de la table recruteur
CREATE TABLE recruteur (
    id_recruteur INT AUTO_INCREMENT,
    id_entreprise INT NOT NULL,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    ddn DATE,
    mail VARCHAR(100),
    tel VARCHAR(60),
    certif BOOLEAN,
    id_document INT NULL,
    id_offre INT NULL,
    PRIMARY KEY (id_recruteur),
    CONSTRAINT fk_recruteur_entreprise FOREIGN KEY (id_entreprise) REFERENCES entreprise (id_entreprise),
    CONSTRAINT fk_recruteur_document FOREIGN KEY (id_document) REFERENCES document (id_document),
    CONSTRAINT fk_recruteur_offre FOREIGN KEY (id_offre) REFERENCES offre (id_offre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creation de la table demande
CREATE TABLE demande (
    id_demande INT AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_offre INT NOT NULL,
    demande VARCHAR(100),
    PRIMARY KEY (id_demande),
    UNIQUE KEY uq_demande_user_offre (id_user, id_offre),
    CONSTRAINT fk_demande_user FOREIGN KEY (id_user) REFERENCES `user` (id_user),
    CONSTRAINT fk_demande_offre FOREIGN KEY (id_offre) REFERENCES offre (id_offre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;