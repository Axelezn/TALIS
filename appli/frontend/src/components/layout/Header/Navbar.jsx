import React, { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
// Importation de Link pour la navigation interne sans rechargement
import { Link } from 'react-router-dom'; 
import logo from '../../../assets/talis_logo_full.png';
import Button from '../../common/Button/Button';
import './Navbar.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hasNotifications = true; 

  return (
    <header className="navbar-header">
      
      {/* --- VERSION PC (Desktop) --- */}
      <nav className="nav-desktop">
        <div className="nav-desktop__container">
          
          {/* 1. Bloc Gauche : Logo avec Link vers l'accueil */}
          <div className="nav-desktop__logo">
            <Link to="/">
              <img src={logo} alt="Talis Logo" />
            </Link>
          </div>
          
          {/* 2. Bloc Milieu : Navigation interne */}
          <ul className="nav-desktop__links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/offres">Offres</Link></li>
            <li><Link to="/dashboard">Tableau de bord</Link></li>
          </ul>

          {/* 3. Bloc Droite : Actions avec redirection vers LoginView */}
          <div className="nav-desktop__actions">
            {/* On entoure le bouton avec un Link vers /login */}
            <Link to="/login">
              <Button variant="accent">Connexion</Button>
            </Link>
            
            <Link to="/register">
              <Button variant="primary">Inscription</Button>
            </Link>
          </div>

        </div>
      </nav>

      {/* --- VERSION MOBILE --- */}
      <nav className="nav-mobile">
        <div className="nav-mobile__bell">
          <Bell size={32} />
          {hasNotifications && <span className="dot"></span>}
        </div>

        <div className="nav-mobile__logo">
          <Link to="/">
            <img src={logo} alt="Talis" />
          </Link>
        </div>

        <button className="nav-mobile__burger" onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </nav>

      {/* --- MENU MOBILE OVERLAY --- */}
      <div className={`mobile-overlay ${isOpen ? 'is-active' : ''}`}>
        
        <button className="mobile-overlay__close" onClick={() => setIsOpen(false)}>
          <X size={32} color="white" />
        </button>

        <div className="mobile-overlay__content">
          <div className="white-card">
            <img src={logo} alt="Talis" />
          </div>

          <ul className="mobile-overlay__links">
            <li><Link to="/" onClick={() => setIsOpen(false)}>Accueil</Link></li>
            <li><Link to="/offres" onClick={() => setIsOpen(false)}>Offres</Link></li>
            <li><Link to="/dashboard" onClick={() => setIsOpen(false)}>Tableau de bord</Link></li>
            
            <li className="sep"></li>
            
            <li>
              {/* Lien direct vers LoginView en Mobile */}
              <Link to="/login" className="bold uppercase" onClick={() => setIsOpen(false)}>
                CONNEXION
              </Link>
            </li>
            <li><Link to="/register" onClick={() => setIsOpen(false)}>Inscription</Link></li>
          </ul>

        </div>
      </div>
    </header>
  );
};

export default Navbar;