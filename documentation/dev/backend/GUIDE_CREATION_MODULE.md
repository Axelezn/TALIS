# Créer et organiser un module

Ce projet est organisé par domaine métier.

Donc, pour ajouter une nouvelle fonctionnalité, on crée un module dédié dans `modules/`.

Exemple :

- `rooms` pour les salles
- `bookings` pour les réservations
- `users` pour les utilisateurs

## Structure minimale d'un module

Un module doit suivre cette structure :

```text
modules/
  mon-module/
    index.js
    controllers/
      MonModuleController.js
    services/
      MonModuleService.js
    repositories/
      MonModuleRepository.js
    entities/
      MonModuleEntity.js
```

## Rôle de chaque fichier

### `index.js`

C'est le point d'entrée du module.

Il sert à :

- créer le router Express
- instancier les dépendances
- brancher les routes
- retourner le router

En pratique, c'est ici qu'on fait le câblage entre les classes.

### `entities/`

L'entité représente l'objet métier.

Exemple :

- une salle
- une réservation
- un utilisateur

L'entité contient :

- les données métier
- les getters
- éventuellement des validations simples

Elle ne doit pas contenir de SQL ni de logique HTTP.

### `repositories/`

Le repository parle à la base de données.

Il contient :

- les requêtes SQL
- les `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- le mapping entre la base et les entités

Règle importante :

- tout le SQL doit rester dans le repository

### `services/`

Le service contient la logique métier.

C'est ici qu'on met les règles comme :

- vérifier qu'une donnée existe
- refuser un doublon
- appliquer des contrôles métier avant sauvegarde

Le service ne doit pas utiliser `req` ou `res`.

### `controllers/`

Le contrôleur reçoit la requête HTTP.

Il doit :

- lire `req.params`, `req.body` ou `req.query`
- appeler le service
- renvoyer la réponse HTTP
- gérer les erreurs avec `try/catch`

Le contrôleur doit rester court.

## Ordre conseillé pour créer un module

Pour aller vite sans te perdre, crée un module dans cet ordre :

1. créer le dossier du module dans `modules/`
2. créer l'entité
3. créer le repository
4. créer le service
5. créer le controller
6. créer `index.js` pour brancher le tout
7. brancher ce module dans `app.js`

## Exemple de câblage dans `index.js`

```js
import express from 'express';
import { MonModuleRepository } from './repositories/MonModuleRepository.js';
import { MonModuleService } from './services/MonModuleService.js';
import { MonModuleController } from './controllers/MonModuleController.js';

export function setupMonModule(db) {
  const router = express.Router();

  const repository = new MonModuleRepository(db);
  const service = new MonModuleService(repository);
  const controller = new MonModuleController(service);

  router.post('/', (req, res) => controller.create(req, res));
  router.get('/', (req, res) => controller.getAll(req, res));

  return router;
}
```

## Résumé simple

Pour créer un module propre, retiens cette logique :

- `Entity` = représente les données métier
- `Repository` = accède à la base
- `Service` = applique les règles métier
- `Controller` = gère la requête HTTP
- `index.js` = assemble tout

## Bon réflexe

Quand tu ajoutes un nouveau module, copie la logique d'organisation de `bookings`.

C'est actuellement le meilleur exemple du projet pour comprendre comment structurer un module.