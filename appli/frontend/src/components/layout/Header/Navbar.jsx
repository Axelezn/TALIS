// src/components/layout/Header/Navbar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/talis_logo_full.png';
import Button from '../../common/Button/Button';
import './Navbar.scss';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const hasNotifications = true; 
  const [currentUser, setCurrentUser] = useState(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [accountMenuPathname, setAccountMenuPathname] = useState(location.pathname);

  const burgerBtnRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const syncUserFromStorage = () => {
      const token = localStorage.getItem('talis_token');
      const rawUser = localStorage.getItem('talis_user');

      if (!token || !rawUser) {
        setCurrentUser(null);
        return;
      }

      try {
        setCurrentUser(JSON.parse(rawUser));
      } catch {
        setCurrentUser(null);
      }
    };

    syncUserFromStorage();
    window.addEventListener('storage', syncUserFromStorage);
    return () => window.removeEventListener('storage', syncUserFromStorage);
  }, [location.pathname]);

  // Fermeture des menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.account-menu')) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus trap et gestion de la touche Échap sur l'overlay mobile (Critère RGAA 12.11)
  useEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusableElements = overlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        burgerBtnRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    overlay.addEventListener('keydown', handleKeyDown);
    return () => overlay.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const isAuthenticated = Boolean(currentUser);
  const isAccountMenuVisible = isAccountMenuOpen && accountMenuPathname === location.pathname;
  const avatarUrl = currentUser?.photo || currentUser?.avatar || null;
  const avatarFallback = currentUser?.prenom?.[0] || currentUser?.nom?.[0] || currentUser?.mail?.[0] || 'U';

  const openOrToggleAccountMenu = () => {
    setIsAccountMenuOpen((previous) => {
      if (previous && accountMenuPathname === location.pathname) {
        return false;
      }
      setAccountMenuPathname(location.pathname);
      return true;
    });
  };

  const handleAccountManagement = () => {
    setIsAccountMenuOpen(false);
    navigate('/profil');
  };

  const handleLogout = () => {
    localStorage.removeItem('talis_token');
    localStorage.removeItem('talis_user');
    setCurrentUser(null);
    setIsAccountMenuOpen(false);
    setIsOpen(false);
    navigate('/login');
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
    burgerBtnRef.current?.focus();
  };

  return (
    <header className="navbar-header" role="banner">
      {/* Desktop */}
      <nav className="nav-desktop" aria-label="Navigation principale">
        <div className="nav-desktop__container">
          <div className="nav-desktop__logo">
            <Link to="/" aria-label="Retour à l'accueil TALIS">
              <img src={logo} alt="Logo TALIS - Accueil" />
            </Link>
          </div>

          <ul className="nav-desktop__links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/offres">Offres</Link></li>
            {isAuthenticated && <li><Link to="/demandes">Demandes</Link></li>}
            <li><Link to="/profil">Mon Profil</Link></li>
          </ul>

          <div className="nav-desktop__actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login"><Button variant="accent">Connexion</Button></Link>
                <Link to="/register"><Button variant="primary">Inscription</Button></Link>
              </>
            ) : (
              <div className="account-menu">
                <button
                  type="button"
                  className="nav-avatar"
                  aria-haspopup="true"
                  aria-expanded={isAccountMenuVisible}
                  aria-label="Menu du compte utilisateur"
                  onClick={openOrToggleAccountMenu}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{avatarFallback.toUpperCase()}</span>
                  )}
                </button>

                {isAccountMenuVisible && (
                  <div className="account-menu__dropdown" role="menu" aria-label="Options du compte">
                    <button type="button" role="menuitem" onClick={handleAccountManagement}>
                      Gérer mon compte
                    </button>
                    <button type="button" role="menuitem" onClick={handleLogout}>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile */}
      <nav className="nav-mobile" aria-label="Navigation mobile">
        {isAuthenticated ? (
          <div className="account-menu account-menu--mobile">
            <button
              type="button"
              className="nav-mobile__avatar"
              aria-haspopup="true"
              aria-expanded={isAccountMenuVisible}
              aria-label="Menu du compte utilisateur"
              onClick={openOrToggleAccountMenu}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" aria-hidden="true" />
              ) : (
                <span aria-hidden="true">{avatarFallback.toUpperCase()}</span>
              )}
            </button>

            {isAccountMenuVisible && (
              <div className="account-menu__dropdown" role="menu" aria-label="Options du compte">
                <button type="button" role="menuitem" onClick={handleAccountManagement}>
                  Gérer mon compte
                </button>
                <button type="button" role="menuitem" onClick={handleLogout}>
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <button type="button" className="nav-mobile__bell" aria-label={hasNotifications ? "Notifications non lues" : "Notifications"}>
            <Bell size={32} aria-hidden="true" focusable="false" />
            {hasNotifications && <span className="dot" aria-hidden="true"></span>}
          </button>
        )}

        <div className="nav-mobile__logo">
          <Link to="/" aria-label="Retour à l'accueil TALIS">
            <img src={logo} alt="Logo TALIS - Accueil" />
          </Link>
        </div>

        <button
          ref={burgerBtnRef}
          type="button"
          className="nav-mobile__burger"
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir le menu de navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-menu-overlay"
        >
          <Menu size={28} aria-hidden="true" focusable="false" />
        </button>
      </nav>

      {/* Mobile Overlay avec focus trap */}
      <div
        ref={overlayRef}
        id="mobile-menu-overlay"
        className={`mobile-overlay ${isOpen ? 'is-active' : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobile"
      >
        <button
          type="button"
          className="mobile-overlay__close"
          onClick={handleCloseMenu}
          aria-label="Fermer le menu de navigation"
        >
          <X size={32} color="white" aria-hidden="true" focusable="false" />
        </button>

        <div className="mobile-overlay__content">
          <div className="white-card">
            <img src={logo} alt="Logo TALIS" />
          </div>

          <ul className="mobile-overlay__links">
            <li><Link to="/" onClick={handleCloseMenu}>Accueil</Link></li>
            <li><Link to="/offres" onClick={handleCloseMenu}>Offres</Link></li>
            {isAuthenticated && <li><Link to="/demandes" onClick={handleCloseMenu}>Demandes</Link></li>}
            <li><Link to="/profil" onClick={handleCloseMenu}>Mon Profil</Link></li>

            {!isAuthenticated && (
              <>
                <li className="sep" aria-hidden="true"></li>
                <li>
                  <Link to="/login" className="bold uppercase" onClick={handleCloseMenu}>
                    CONNEXION
                  </Link>
                </li>
                <li><Link to="/register" onClick={handleCloseMenu}>Inscription</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;