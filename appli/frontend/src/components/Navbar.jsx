import React, { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import logo from '../assets/talis_logo_full.png';
import Button from './Button'; 
import '../styles/Navbar.scss';

const Navbar = () => {
  // État pour ouvrir/fermer le menu mobile
  const [isOpen, setIsOpen] = useState(false);

  // true = point rouge visible, false = point rouge masqué
  const hasNotifications = true; 

  return (
    <header className="navbar-header">
      
      {/* --- VERSION PC (Desktop) --- */}
      <nav className="nav-desktop">
        <div className="nav-desktop__container">
          
          {/* 1. Bloc Gauche : Logo */}
          <div className="nav-desktop__logo">
            <a href="/">
              <img src={logo} alt="Talis Logo" />
            </a>
          </div>
          
          {/* 2. Bloc Milieu : Liens de navigation */}
          <ul className="nav-desktop__links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/offres">Offres</a></li>
            <li><a href="/dashboard">Tableau de bord</a></li>
          </ul>

          {/* 3. Bloc Droite : Boutons d'action */}
          <div className="nav-desktop__actions">
            <Button variant="accent">Connexion</Button>
            <Button variant="primary">Inscription</Button>
          </div>

        </div>
      </nav>

      {/* --- VERSION MOBILE (Barre du haut) --- */}
      <nav className="nav-mobile">
        <div className="nav-mobile__bell">
          <Bell size={32} />
          {hasNotifications && <span className="dot"></span>}
        </div>

        {/* Logo centré */}
        <div className="nav-mobile__logo">
          <img src={logo} alt="Talis" />
        </div>

        {/* Bouton Burger */}
        <button className="nav-mobile__burger" onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </nav>

      {/* --- MENU MOBILE OVERLAY (Le menu violet qui s'ouvre) --- */}
      <div className={`mobile-overlay ${isOpen ? 'is-active' : ''}`}>
        
        {/* Bouton pour fermer */}
        <button className="mobile-overlay__close" onClick={() => setIsOpen(false)}>
          <X size={32} color="white" />
        </button>

        <div className="mobile-overlay__content">
          <div className="white-card">
            <img src={logo} alt="Talis" />
          </div>

          {/* Liste des liens mobile */}
          <ul className="mobile-overlay__links">
            <li><a href="/" onClick={() => setIsOpen(false)}>Accueil</a></li>
            <li><a href="/offres" onClick={() => setIsOpen(false)}>Offres</a></li>
            <li><a href="/dashboard" onClick={() => setIsOpen(false)}>Tableau de bord</a></li>
            
            {/* Petit trait de séparation */}
            <li className="sep"></li>
            
            <li>
              <a href="/login" className="bold uppercase" onClick={() => setIsOpen(false)}>
                CONNEXION
              </a>
            </li>
            <li><a href="/register" onClick={() => setIsOpen(false)}>Inscription</a></li>
          </ul>

        </div>
      </div>
    </header>
  );
};

export default Navbar;