# Comprendre le fonctionnement du projet

Ce projet est une API REST Node.js organisée par domaine métier.

L'idée principale est la suivante :

- le module `rooms` gère les salles
- le module `bookings` gère les réservations
- chaque module est découpé en couches pour séparer les responsabilités

Le projet suit donc une architecture en plusieurs niveaux :

1. `controller` : reçoit la requête HTTP
2. `service` : applique la logique métier
3. `repository` : parle à la base de données
4. `entity` : représente les objets métier manipulés dans le code

## 1. Structure générale

### `app.js`

En principe, c'est le point d'entrée de l'application Express.

Dans l'état actuel du dépôt, ce fichier est presque vide et contient seulement un commentaire. Cela veut dire que la structure métier existe, mais que le démarrage complet du serveur n'est pas encore câblé ici.

Normalement, ce fichier devrait :

- créer l'application Express
- connecter la base de données
- brancher les modules avec des routes comme `/bookings` ou `/rooms`
- lancer le serveur avec `app.listen(...)`

### `config/`

Ce dossier contient la configuration.

- `database.sql` définit la structure de la base de données
- `README.md` indique que ce dossier doit aussi contenir la config de connexion à la base

Le fichier SQL crée 2 tables :

- `rooms` : les salles
- `bookings` : les réservations

La table `bookings` contient une contrainte importante :

- un créneau ne peut pas être réservé deux fois pour la même salle

Cette règle est protégée par la clé unique :

- `(room_id, booking_date, start_hour)`

### `core/`

Ce dossier contient du code partagé.

Le fichier `BaseRepository.js` sert de classe mère pour les repositories. Il stocke la connexion à la base dans un champ privé `#db` et fournit un getter `db` aux classes enfants.

Autrement dit, tous les repositories héritent du même mécanisme d'accès à la base.

### `modules/`

Chaque sous-dossier représente un domaine métier.

- `modules/rooms/`
- `modules/bookings/`

Cette organisation est importante : au lieu de ranger le code par technique globale, on le range par fonctionnalité métier.

## 2. Rôle de chaque couche

Dans chaque module, on retrouve toujours le même type de fichiers.

### `entities/`

Les entités représentent les objets métier.

Exemples :

- `RoomEntity` représente une salle
- `BookingEntity` représente une réservation

Leur but est de centraliser les données et une partie des validations.

#### `RoomEntity`

Cette classe contient :

- `id`
- `name`
- `capacity`

Elle possède aussi des méthodes comme :

- `setCapacity(value)` : refuse une capacité inférieure ou égale à 0
- `setName(value)` : refuse un nom vide
- `isLargeEnough(peopleCount)` : vérifie si la salle peut contenir un nombre de personnes

#### `BookingEntity`

Cette classe contient :

- `id`
- `roomId`
- `customerName`
- `date`
- `startHour`

Elle convertit la date reçue en objet `Date` et expose ensuite un getter `date` au format `YYYY-MM-DD`.

Elle contient aussi une validation d'heure avec `setStartHour(hour)` pour n'accepter que des valeurs entre 0 et 23.

### `repositories/`

Les repositories sont la couche d'accès aux données.

Leur rôle est simple :

- écrire les requêtes SQL
- lire les résultats de la base
- transformer les lignes SQL en objets métier quand c'est nécessaire

#### `RoomRepository`

Il gère les salles et contient notamment :

- `findAll()` : récupère toutes les salles
- `findById(id)` : récupère une salle par identifiant
- `create(roomEntity)` : insère une nouvelle salle

#### `BookingRepository`

Il gère les réservations et contient notamment :

- `isSlotAvailable(roomId, date, hour)` : vérifie si un créneau est libre
- `save(bookingEntity)` : enregistre une réservation

Ici, toute la logique SQL est bien concentrée dans cette couche.

### `services/`

Le service contient la logique métier.

Il ne doit pas gérer directement HTTP et ne doit pas écrire de SQL.

Dans ce projet, `BookingService` orchestre la création d'une réservation.

Son rôle est de répondre à la question suivante :

> Peut-on vraiment créer cette réservation ?

Pour cela, il enchaîne plusieurs vérifications.

### `controllers/`

Le contrôleur reçoit `req` et `res` depuis Express.

Il doit rester léger :

- il lit les données de la requête
- il appelle le service
- il renvoie une réponse HTTP

Dans ce projet, `BookingController` expose une méthode `create(req, res)` pour traiter un `POST /bookings`.

## 3. Comment fonctionne une réservation

Voici le chemin complet d'une requête de réservation dans ce projet.

### Étape 1 : la route reçoit la requête

Dans `modules/bookings/index.js`, on crée les dépendances puis on déclare la route :

- création du `RoomRepository`
- création du `BookingRepository`
- injection de ces repositories dans `BookingService`
- injection du service dans `BookingController`
- déclaration de `router.post('/')`

Cela veut dire que si ce routeur est monté sur `/bookings`, alors un `POST /bookings` appellera `bookingController.create(...)`.

### Étape 2 : le contrôleur lit les données

`BookingController.create(req, res)` extrait :

- `roomId`
- `customerName`
- `date`
- `start_hour`

Ensuite, il transmet ces données au service via `createReservation(...)`.

Il gère aussi les erreurs avec un `try/catch` et renvoie :

- `201` si tout va bien
- `400` pour certaines erreurs métier identifiées par le message
- `500` pour le reste

### Étape 3 : le service applique les règles métier

Dans `BookingService.createReservation(bookingData)`, il se passe 4 choses.

#### 1. Vérifier que la salle existe

Le service appelle :

- `roomRepository.findById(bookingData.roomId)`

Si aucune salle n'existe avec cet identifiant, une erreur est levée.

#### 2. Vérifier que le créneau est libre

Le service appelle :

- `bookingRepository.isSlotAvailable(roomId, date, start_hour)`

Si le créneau est déjà pris, une erreur est levée.

#### 3. Construire une entité métier

Le service crée ensuite :

- `new BookingEntity(bookingData)`

L'intérêt est de manipuler un objet métier plutôt qu'un simple objet brut.

#### 4. Sauvegarder dans la base

Enfin, le service appelle :

- `bookingRepository.save(newBooking)`

Le repository exécute l'`INSERT` SQL et renvoie l'identifiant créé.

Le service retourne alors une réponse métier simple :

- `message: "Réservation confirmée"`
- `id: insertedId`

### Étape 4 : le contrôleur renvoie la réponse HTTP

Le contrôleur récupère le résultat et renvoie un JSON avec le code HTTP `201`.

## 4. Exemple concret

Si l'API est montée de manière classique, on peut imaginer une requête comme celle-ci :

```http
POST /bookings
Content-Type: application/json

{
  "roomId": 2,
  "customerName": "Alice Martin",
  "date": "2026-03-21",
  "start_hour": 14
}
```

Le parcours serait alors :

1. Express reçoit la requête
2. la route `/bookings` appelle `BookingController.create`
3. le contrôleur appelle `BookingService.createReservation`
4. le service vérifie l'existence de la salle
5. le service vérifie la disponibilité du créneau
6. le service crée une `BookingEntity`
7. le repository sauvegarde en base
8. l'API renvoie une confirmation JSON

Réponse attendue :

```json
{
  "message": "Réservation confirmée",
  "id": 12
}
```

## 5. Ce que le projet fait bien

Le projet a déjà de bonnes bases :

- séparation claire entre HTTP, logique métier et SQL
- injection de dépendances dans le module bookings
- usage de classes métier (`Entity`)
- requêtes SQL paramétrées avec `?`
- contrainte SQL d'unicité pour empêcher les doubles réservations

## 6. Ce qui peut te perturber actuellement

Il y a plusieurs raisons pour lesquelles le projet peut sembler difficile à lire au début.

### `app.js` n'est pas encore réellement implémenté

Le point d'entrée de l'application n'est pas terminé. Donc on voit bien les briques internes, mais pas encore l'assemblage complet du serveur.

### Le module `rooms` est incomplet

Le dossier `rooms` contient :

- une entité
- un repository
- un `index.js`

Mais pour l'instant :

- `index.js` ne contient qu'un commentaire
- il n'y a pas encore de contrôleur ni de service implémentés

Donc le module rooms existe surtout comme base de travail pour être utilisé par les réservations.

### Certaines validations sont présentes mais pas toujours appelées

Par exemple, `BookingEntity` possède une méthode `setStartHour(hour)` avec validation, mais le constructeur assigne directement `start_hour` sans appeler ce setter.

Donc l'intention d'architecture est bonne, mais certaines validations pourraient encore être renforcées.

## 7. Résumé mental simple

Si tu veux retenir le projet simplement, pense-le comme ceci :

- `Controller` = entrée HTTP
- `Service` = cerveau métier
- `Repository` = accès SQL
- `Entity` = objet métier manipulé dans le code

Pour une réservation :

- le contrôleur reçoit la demande
- le service décide si la réservation est autorisée
- le repository écrit en base

## 8. Ordre conseillé pour lire le projet

Si tu veux le comprendre sans te perdre, lis les fichiers dans cet ordre :

1. `modules/bookings/index.js`
2. `modules/bookings/controllers/BookingController.js`
3. `modules/bookings/services/BookingService.js`
4. `modules/bookings/repositories/BookingRepository.js`
5. `modules/bookings/entities/BookingEntity.js`
6. `modules/rooms/repositories/RoomRepository.js`
7. `modules/rooms/entities/RoomEntity.js`
8. `config/database.sql`

Cet ordre te permet de suivre une requête depuis l'entrée HTTP jusqu'à la base de données.