import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Header/Navbar';
import LoginView from './views/LoginView';
import Hero from './components/layout/Hero/Hero';

// Import des styles globaux
import './styles/main.scss';
import RegisterView from './views/RegisterView';
import ProfileView from './views/ProfileView';

// Composant pour le contenu de ta page d'accueil
const Home = () => {
  return (
    <main>
      <Hero />
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
        <Route path="/register" element={<RegisterView />} />
        <Route path="/offres" element={<main><h1>Liste des offres</h1></main>} />

        <Route path="/profil" element={<ProfileView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/ProfileView" element={<ProfileView />} />

        <Route path="*" element={<main><h1>404 - Page non trouvée</h1></main>} />
      </Routes>
    </div>
  );
}

export default App;