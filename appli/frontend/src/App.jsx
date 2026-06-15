import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Header/Navbar';
import LoginView from './views/LoginView';
import Hero from './components/layout/hero/Hero';

import './styles/main.scss';
import RegisterView from './views/RegisterView';

const Home = () => {
  return (
    <main>
      <h1>Bienvenue sur TALIS - Votre plateforme de stage</h1>
      <Hero />
      <p className="text-secondary">Test police secondaire</p>
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

        <Route path="/dashboard" element={<main><h1>Tableau de bord</h1></main>} />

        <Route path="*" element={<main><h1>404 - Page non trouvée</h1></main>} />
      </Routes>
    </div>
  );
}

export default App;