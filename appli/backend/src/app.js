import express from 'express';
import { createDbPool } from './config/db.js';
import { setupUtilisateurModule } from './modules/utilisateur/index.js';
import { setupDocumentModule } from './modules/document/index.js';
import { setupEntrepriseModule } from './modules/entreprise/index.js';
import { setupOffreModule } from './modules/offre/index.js';
import { setupRecruteurModule } from './modules/recruteur/index.js';
import { setupDemandeModule } from './modules/demande/index.js';
import { AppError } from './core/AppError.js';

const app = express();
const port = Number(process.env.PORT || 3000);
const db = createDbPool();

app.use(express.json());

app.get('/health', async (req, res, next) => {
	try {
		await db.execute('SELECT 1');
		res.status(200).json({ status: 'ok' });
	} catch (error) {
		next(error);
	}
});

app.use('/api/utilisateurs', setupUtilisateurModule(db));
app.use('/api/documents', setupDocumentModule(db));
app.use('/api/entreprises', setupEntrepriseModule(db));
app.use('/api/offres', setupOffreModule(db));
app.use('/api/recruteurs', setupRecruteurModule(db));
app.use('/api/demandes', setupDemandeModule(db));

app.use((req, res) => {
	res.status(404).json({ message: 'Route non trouvée' });
});

app.use((error, req, res, next) => {
	if (error instanceof AppError) {
		return res.status(error.statusCode).json({ message: error.message, details: error.details });
	}

	console.error('[Unhandled Error]', error);
	return res.status(500).json({ message: 'Erreur interne du serveur' });
});

async function startServer() {
	try {
		await db.execute('SELECT 1');
		console.log('[DB] Connexion a la base de donnees reussie.');
	} catch (error) {
		console.error('[DB] Echec de connexion a la base de donnees :', error.message);
	}

	app.listen(port, () => {
		console.log(`Backend TALIS lance sur le port ${port}`);
	});
}

startServer();