import React from 'react';
import '../styles/Navbar.scss';
import Button from './Button';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        
        {/* Logo TALIS */}
        <div className="navbar__logo">
          <span>T</span>ALIS
        </div>

        {/* Liens de navigation */}
        <ul className="navbar__links">
          <li><a href="#offres">Offres de stage</a></li>
          <li><a href="#etudiants">Espace Étudiant</a></li>
          <li><a href="#entreprises">Espace Entreprise</a></li>
        </ul>

        {/* Boutons d'action (CTA) */}
        <div className="navbar__actions">
            <Button variant="primary" size="sm">Se connecter</Button>
            <Button variant="accent" size="sm">S'inscrire</Button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;