import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Header/Navbar';
import LoginView from './views/LoginView';
import Hero from './components/layout/Hero/Hero';
import ToastContainer from './components/common/Toast/ToastContainer';

// Import des styles globaux
import './styles/main.scss';
import RegisterView from './views/RegisterView';
import ProfileView from './views/ProfileView';
import OffresView from './views/OffresView';
import DemandesView from './views/DemandesView';

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
      <ToastContainer />
      <Navbar />
      <Routes>
        {/* URL : / (Accueil) */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/offres" element={<OffresView />} />
        <Route path="/demandes" element={<DemandesView />} />

        <Route path="/profil" element={<ProfileView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/ProfileView" element={<ProfileView />} />

        <Route path="*" element={<main><h1>404 - Page non trouvée</h1></main>} />
      </Routes>
    </div>
  );
}

export default App;