# TALIS
## Projet TALIS - Talents Alternance Lien Intégré Suivi 

## conventional commit
The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of. This convention dovetails with SemVer, by describing the features, fixes, and breaking changes made in commit messages.

The commit message should be structured as follows:
```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```
The commit contains the following structural elements, to communicate intent to the consumers of your library:

- ***fix***: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
- ***feat***: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
- BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
- types other than **fix:** and **feat:** are allowed, for example @commitlint/config-conventional (based on the Angular convention) recommends **build:**, **chore:**, **ci:**, **docs:**, **style:**, **refactor:**, **perf:**, **test:**, and others.
- footers other than BREAKING CHANGE: *description* may be provided and follow a convention similar to git trailer format.

Additional types are not mandated by the Conventional Commits specification, and have no implicit effect in Semantic Versioning (unless they include a BREAKING CHANGE). A scope may be provided to a commit’s type, to provide additional contextual information and is contained within parenthesis, e.g., feat(parser): add ability to parse arrays.



```
projet
├─ appli
│  ├─ backend
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ README.md
│  │  └─ src
│  │     ├─ app.js
│  │     ├─ config
│  │     │  ├─ database.sql
│  │     │  ├─ db.js
│  │     │  └─ README.md
│  │     ├─ core
│  │     │  ├─ AppError.js
│  │     │  ├─ authMiddleware.js
│  │     │  ├─ BaseRepository.js
│  │     │  ├─ jwt.js
│  │     │  ├─ README.md
│  │     │  └─ validators.js
│  │     ├─ modules
│  │     │  ├─ auth
│  │     │  │  ├─ controllers
│  │     │  │  │  └─ AuthController.js
│  │     │  │  ├─ entities
│  │     │  │  │  └─ AuthPayloadEntity.js
│  │     │  │  ├─ index.js
│  │     │  │  ├─ repositories
│  │     │  │  │  └─ AuthRepository.js
│  │     │  │  └─ services
│  │     │  │     └─ AuthService.js
│  │     │  ├─ demande
│  │     │  │  ├─ controllers
│  │     │  │  │  └─ DemandeController.js
│  │     │  │  ├─ entities
│  │     │  │  │  └─ DemandeEntity.js
│  │     │  │  ├─ index.js
│  │     │  │  ├─ repositories
│  │     │  │  │  └─ DemandeRepository.js
│  │     │  │  └─ services
│  │     │  │     └─ DemandeService.js
│  │     │  ├─ document
│  │     │  │  ├─ controllers
│  │     │  │  │  └─ DocumentController.js
│  │     │  │  ├─ entities
│  │     │  │  │  └─ DocumentEntity.js
│  │     │  │  ├─ index.js
│  │     │  │  ├─ repositories
│  │     │  │  │  └─ DocumentRepository.js
│  │     │  │  └─ services
│  │     │  │     └─ DocumentService.js
│  │     │  ├─ entreprise
│  │     │  │  ├─ controllers
│  │     │  │  │  └─ EntrepriseController.js
│  │     │  │  ├─ entities
│  │     │  │  │  └─ EntrepriseEntity.js
│  │     │  │  ├─ index.js
│  │     │  │  ├─ repositories
│  │     │  │  │  └─ EntrepriseRepository.js
│  │     │  │  └─ services
│  │     │  │     └─ EntrepriseService.js
│  │     │  ├─ message
│  │     │  │  ├─ controllers
│  │     │  │  │  └─ MessageController.js
│  │     │  │  ├─ entities
│  │     │  │  │  └─ MessageEntity.js
│  │     │  │  ├─ index.js
│  │     │  │  ├─ repositories
│  │     │  │  │  └─ MessageRepository.js
│  │     │  │  ├─ services
│  │     │  │  │  └─ MessageService.js
│  │     │  │  └─ websocket
│  │     │  │     └─ ChatSocketServer.js
│  │     │  ├─ offre
│  │     │  │  ├─ controllers
│  │     │  │  │  └─ OffreController.js
│  │     │  │  ├─ entities
│  │     │  │  │  └─ OffreEntity.js
│  │     │  │  ├─ index.js
│  │     │  │  ├─ repositories
│  │     │  │  │  └─ OffreRepository.js
│  │     │  │  └─ services
│  │     │  │     └─ OffreService.js
│  │     │  ├─ README.md
│  │     │  ├─ recruteur
│  │     │  │  ├─ controllers
│  │     │  │  │  └─ RecruteurController.js
│  │     │  │  ├─ entities
│  │     │  │  │  └─ RecruteurEntity.js
│  │     │  │  ├─ index.js
│  │     │  │  ├─ repositories
│  │     │  │  │  └─ RecruteurRepository.js
│  │     │  │  └─ services
│  │     │  │     └─ RecruteurService.js
│  │     │  └─ utilisateur
│  │     │     ├─ controllers
│  │     │     │  └─ UtilisateurController.js
│  │     │     ├─ entities
│  │     │     │  └─ UtilisateurEntity.js
│  │     │     ├─ index.js
│  │     │     ├─ repositories
│  │     │     │  └─ UtilisateurRepository.js
│  │     │     └─ services
│  │     │        └─ UtilisateurService.js
│  │     └─ uploads
│  │        ├─ 1781700403678_7y06p.pdf
│  │        └─ 1781701763378_go2qa.png
│  ├─ frontend
│  │  ├─ eslint.config.js
│  │  ├─ index.html
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ public
│  │  │  ├─ favicon.svg
│  │  │  └─ icons.svg
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ App.css
│  │  │  ├─ App.jsx
│  │  │  ├─ assets
│  │  │  │  ├─ hero.png
│  │  │  │  ├─ hero_img.png
│  │  │  │  ├─ react.svg
│  │  │  │  ├─ talis_logo_full.png
│  │  │  │  └─ vite.svg
│  │  │  ├─ components
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ AuthToggle.jsx
│  │  │  │  │  └─ AuthToggle.scss
│  │  │  │  ├─ chat
│  │  │  │  │  ├─ ChatDrawer.jsx
│  │  │  │  │  └─ ChatDrawer.scss
│  │  │  │  └─ common
│  │  │  │     ├─ Button
│  │  │  │     │  ├─ Button.jsx
│  │  │  │     │  └─ Button.scss
│  │  │  │     ├─ InputField
│  │  │  │     │  ├─ InputField.jsx
│  │  │  │     │  └─ InputField.scss
│  │  │  │     └─ Toast
│  │  │  │        ├─ toast.js
│  │  │  │        ├─ Toast.scss
│  │  │  │        ├─ ToastContainer.jsx
│  │  │  │        └─ toastStore.js
│  │  │  ├─ index.css
│  │  │  ├─ main.jsx
│  │  │  ├─ services
│  │  │  │  ├─ apiClient.js
│  │  │  │  ├─ authService.js
│  │  │  │  ├─ chatService.js
│  │  │  │  ├─ demandeService.js
│  │  │  │  ├─ entrepriseService.js
│  │  │  │  ├─ offreService.js
│  │  │  │  └─ utilisateurService.js
│  │  │  ├─ styles
│  │  │  │  ├─ abstracts
│  │  │  │  │  ├─ _index.scss
│  │  │  │  │  ├─ _mixins.scss
│  │  │  │  │  └─ _variables.scss
│  │  │  │  ├─ base
│  │  │  │  │  ├─ _index.scss
│  │  │  │  │  └─ _typography.scss
│  │  │  │  ├─ main.scss
│  │  │  │  └─ pages
│  │  │  │     └─ Auth.scss
│  │  │  ├─ types
│  │  │  └─ views
│  │  │     ├─ CandidatView.jsx
│  │  │     ├─ CandidatView.scss
│  │  │     ├─ ChatView.jsx
│  │  │     ├─ ChatView.scss
│  │  │     ├─ DemandesView.jsx
│  │  │     ├─ DemandesView.scss
│  │  │     ├─ LoginView.jsx
│  │  │     ├─ OffresView.jsx
│  │  │     ├─ OffresView.scss
│  │  │     ├─ ProfileView.jsx
│  │  │     ├─ ProfileView.scss
│  │  │     └─ RegisterView.jsx
│  │  └─ vite.config.js
│  └─ README.md
├─ bruno
│  ├─ axel
│  │  └─ .keep
│  ├─ gabin
│  │  └─ Talis
│  │     ├─ Auth
│  │     │  ├─ folder.yml
│  │     │  ├─ Login
│  │     │  │  ├─ folder.yml
│  │     │  │  ├─ Login (entreprise).yml
│  │     │  │  └─ Login (étudiant).yml
│  │     │  └─ Register
│  │     │     ├─ folder.yml
│  │     │     ├─ Register (entreprise).yml
│  │     │     └─ Register (étudiuant).yml
│  │     ├─ Demande
│  │     │  ├─ All demandes.yml
│  │     │  ├─ Create demande.yml
│  │     │  ├─ Delete demande.yml
│  │     │  ├─ Edit demande.yml
│  │     │  ├─ folder.yml
│  │     │  └─ Single demande.yml
│  │     ├─ Document
│  │     │  ├─ All documents.yml
│  │     │  ├─ Create document.yml
│  │     │  ├─ Delete document.yml
│  │     │  ├─ Edit document.yml
│  │     │  ├─ folder.yml
│  │     │  └─ Single document.yml
│  │     ├─ Entreprise
│  │     │  ├─ All entreprises.yml
│  │     │  ├─ Create entreprise.yml
│  │     │  ├─ Delete entreprise.yml
│  │     │  ├─ Edit entreprise.yml
│  │     │  ├─ folder.yml
│  │     │  └─ Single entreprise.yml
│  │     ├─ environments
│  │     │  └─ LocalHost.yml
│  │     ├─ Offre
│  │     │  ├─ All offres.yml
│  │     │  ├─ Create offre.yml
│  │     │  ├─ Delete offre.yml
│  │     │  ├─ Edit offre.yml
│  │     │  ├─ folder.yml
│  │     │  └─ Single offre.yml
│  │     ├─ opencollection.yml
│  │     ├─ Recruteur
│  │     │  ├─ All recruteurs.yml
│  │     │  ├─ Creat offre.yml
│  │     │  ├─ Create recruteur.yml
│  │     │  ├─ Delete recruteur.yml
│  │     │  ├─ Edit recruteur.yml
│  │     │  ├─ folder.yml
│  │     │  └─ Single recruteur.yml
│  │     └─ Utilisateur
│  │        ├─ All utilisateurs.yml
│  │        ├─ Delete utilisateur.yml
│  │        ├─ Edit utilisateur.yml
│  │        ├─ folder.yml
│  │        └─ Single utilisateur.yml
│  └─ Talis-API
│     ├─ Authentification
│     │  ├─ folder.bru
│     │  ├─ Inscription.bru
│     │  ├─ Test.bru
│     │  └─ Utilisateurs - All.bru
│     ├─ bruno.json
│     ├─ Entreprises
│     │  └─ folder.bru
│     ├─ environments
│     │  └─ Local.bru
│     └─ Offres
│        └─ folder.bru
├─ documentation
│  ├─ conception
│  │  ├─ Les personaes
│  │  │  ├─ Persona1_Chloé.pdf
│  │  │  ├─ Persona1_Chloé.png
│  │  │  ├─ Persona2_Marc.pdf
│  │  │  ├─ Persona2_Marc.png
│  │  │  ├─ Persona3_Valérie.pdf
│  │  │  ├─ Persona3_Valérie.png
│  │  │  ├─ Persona4_Julien.pdf
│  │  │  └─ Persona4_Julien.png
│  │  ├─ Moscow
│  │  │  └─ Moscow.pdf
│  │  └─ User Story
│  │     ├─ Users_Stories_1.pdf
│  │     ├─ Users_Stories_1.png
│  │     ├─ Users_Stories_2.pdf
│  │     └─ Users_Stories_2.png
│  ├─ design
│  │  ├─ avec_blord.png
│  │  ├─ charte_graphique.png
│  │  ├─ juste_logo.png
│  │  ├─ pas mal
│  │  │  ├─ Gemini_Generated_Image_huabjvhuabjvhuab.png
│  │  │  ├─ Gemini_Generated_Image_m54wp3m54wp3m54w.png
│  │  │  ├─ Gemini_Generated_Image_t4be0st4be0st4be.png
│  │  │  └─ Gemini_Generated_Image_urfmbzurfmbzurfm.png
│  │  └─ sans_blord.png
│  └─ dev
│     └─ backend
│        └─ GUIDE_CREATION_MODULE.md
├─ LICENSE
└─ README.md

```