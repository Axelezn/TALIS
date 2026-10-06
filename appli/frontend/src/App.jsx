import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Header/Navbar';
import LoginView from './views/LoginView';
import Hero from './components/layout/Hero/Hero';
import ToastContainer from './components/common/Toast/ToastContainer';
import usePageFocus from './hooks/usePageFocus';

import './styles/main.scss';
import RegisterView from './views/RegisterView';
import ProfileView from './views/ProfileView';
import OffresView from './views/OffresView';
import DemandesView from './views/DemandesView';
import CandidatView from './views/CandidatView';

const PAGE_TITLES = {
  '/': 'Accueil | TALIS',
  '/login': 'Connexion | TALIS',
  '/register': 'Inscription | TALIS',
  '/offres': 'Offres de stage et alternance | TALIS',
  '/demandes': 'Mes demandes | TALIS',
  '/profil': 'Mon profil | TALIS',
  '/profile': 'Mon profil | TALIS',
  '/ProfileView': 'Mon profil | TALIS',
};

const Home = () => {
  return (
    <main id="main-content" tabIndex="-1">
      <Hero />
    </main>
  );
};

function App() {
  const location = useLocation();
  usePageFocus();

  useEffect(() => {
    if (location.pathname.startsWith('/candidats/')) {
      document.title = 'Fiche candidat | TALIS';
      return;
    }
    document.title = PAGE_TITLES[location.pathname] || 'Page non trouvée | TALIS';
  }, [location.pathname]);

  return (
    <div className="App">
      {/* Lien d'évitement conforme RGAA */}
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/offres" element={<OffresView />} />
        <Route path="/demandes" element={<DemandesView />} />
        <Route path="/candidats/:id" element={<CandidatView />} />
        <Route path="/profil" element={<ProfileView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/ProfileView" element={<ProfileView />} />
        <Route path="*" element={<main id="main-content" tabIndex="-1"><h1>404 - Page non trouvée</h1></main>} />
      </Routes>
    </div>
  );
}

export default App;