# Guide de code review : Architecture API REST (Node.js)
Ce guide sert de base à l'évaluation de vos projets. Si l'un de ces points n'est pas respecté, la partie architecture sera considérée comme non acquise.

## 1. Structure et dossiers (Screaming architecture)
- Organisation par domaine : Est-ce que le code est découpé par entité métier (rooms/, bookings/) plutôt que par type technique (controllers/, models/) ?

- Absence de "God Files" : Les fichiers dépassent-ils 150 lignes ? Si oui, le découpage est probablement insuffisant.

- Dossier config : Les variables sensibles (DB_USER, DB_PASS) sont-elles isolées ? (Interdiction d'avoir des identifiants en dur).

## 2. Les entités (Entities)
- Encapsulation réelle : Utilisez-vous le préfixe # pour les propriétés privées ?

- Validation interne : Le constructeur ou les setters privés empêchent-ils la création d'un objet incohérent (ex: capacité négative, heure à 26h) ?

- Contrat de données : L'entité est-elle le seul objet qui circule entre le Repository et le Service ?

## 3. Les répertoires (Repositories)
- Exclusivité SQL : Est-ce que TOUTES les requêtes SQL sont localisées ici ? (Si une ligne de SQL apparaît dans un Service ou un Contrôleur, c'est une faute grave).

- Mapping : Est-ce que les méthodes renvoient des instances de classes (new RoomEntity()) ou des objets JSON bruts de la base de données ?

- Sécurité : Utilisez-vous systématiquement des requêtes préparées (?) pour éviter les injections SQL ?

## 4. Les services (Business logic)
- Orchestration : Le service vérifie-t-il les règles métier (ex: disponibilité de la salle) avant d'appeler le save() du repository ?

- Indépendance technologique : Le service est-il totalement ignorant du protocole HTTP ? (Interdiction d'utiliser req, res, ou de renvoyer des codes 404/400 ici).

- Injection de dépendances : Les repositories sont-ils passés au constructeur du service ? (Interdiction de faire un new Repository() à l'intérieur du service).

## 5. Les contrôleurs (Controllers)
- Régime mince (Skinny) : Le contrôleur fait-il plus que 10-15 lignes par méthode ? Il ne doit que déléguer au service.

- Gestion d'erreurs : Y a-t-il un bloc try/catch global par route pour éviter que le serveur ne crash ?

- Codes HTTP : Les codes de retour sont-ils sémantiquement corrects (201 pour création, 400 pour erreur client, 409 pour conflit) ?

___
___

# check list

## Structure & Dossiers
[ ] Mon code est organisé par domaine métier (ex: /modules/rooms/) et non par type technique.

[ ] Chaque module possède son propre point d'entrée (index.js) pour le câblage.

[ ] Aucun identifiant de base de données ou secret n'est écrit "en dur" (usage de .env).

## Entities (Le Coeur)
[ ] Toutes mes propriétés de classe sensibles sont privées avec le préfixe #.

[ ] Mon entité valide ses données dès le constructor (pas de capacité négative, pas d'heure > 23).

[ ] Mon entité ne contient aucune logique de base de données (pas de SQL ici).

## Repositories (La Donnée)
[ ] Le SQL est strictement limité aux fichiers Repository.

[ ] Mes méthodes de repository retournent des instances d'Entity (ex: return new RoomEntity(data)) et non du JSON brut.

[ ] Toutes mes requêtes sont sécurisées via des paramètres (ex: WHERE id = ?) pour contrer les injections SQL.

## Services (Le Métier)
[ ] Ma logique métier (ex: "vérifier si la salle est libre") est dans le Service.

[ ] Mon Service ne connaît pas Express (pas d'objets req ou res).

[ ] J'utilise l'injection de dépendances : mes repositories sont passés au constructeur du service.

## Controllers (L'Interface)
[ ] Mon contrôleur est "maigre" : il ne fait qu'extraire les données et appeler le service.

[ ] Chaque route est protégée par un bloc try/catch.

[ ] Je renvoie les codes HTTP appropriés (201 pour création, 400/409 pour erreurs métier).
