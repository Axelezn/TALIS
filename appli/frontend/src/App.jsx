import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginView from './views/LoginView';

// Import des styles globaux
import './styles/main.scss';

// Composant pour le contenu de ta page d'accueil
const Home = () => {
  return (
    <main>
      <h1>Bienvenue sur TALIS - Votre plateforme de stage</h1>
      <p className="text-secondary">Test police secondaire</p>
      {/* Tu pourras ajouter ton image heroImg ici plus tard */}
    </main>
  );
};

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* URL : / (Accueil) */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginView />} />

        <Route path="/offres" element={<main><h1>Liste des offres</h1></main>} />

        <Route path="/dashboard" element={<main><h1>Tableau de bord</h1></main>} />

        <Route path="*" element={<main><h1>404 - Page non trouvée</h1></main>} />
      </Routes>
    </div>
  );
}

export default App;