import React, { useEffect, useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
// Importation de Link pour la navigation interne sans rechargement
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.account-menu')) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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

  const openAccountMenuWithRightClick = (event) => {
    event.preventDefault();
    setAccountMenuPathname(location.pathname);
    setIsAccountMenuOpen(true);
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

  return (
    <header className="navbar-header">
      
      {/* --- VERSION PC (Desktop) --- */}
      <nav className="nav-desktop">
        <div className="nav-desktop__container">
          
          {/* 1. Bloc Gauche : Logo avec Link vers l'Accueil */}
          <div className="nav-desktop__logo">
            <Link to="/">
              <img src={logo} alt="Talis Logo" />
            </Link>
          </div>
          
          {/* 2. Bloc Milieu : Navigation interne */}
          <ul className="nav-desktop__links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/offres">Offres</Link></li>
            {isAuthenticated && <li><Link to="/demandes">Demandes</Link></li>}
            <li><Link to="/profil">Mon Profil</Link></li>
          </ul>

          {/* 3. Bloc Droite : Actions avec redirection vers LoginView */}
          <div className="nav-desktop__actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="accent">Connexion</Button>
                </Link>

                <Link to="/register">
                  <Button variant="primary">Inscription</Button>
                </Link>
              </>
            ) : (
              <div className="account-menu">
                <button
                  type="button"
                  className="nav-avatar"
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuVisible}
                  aria-label="Ouvrir le menu utilisateur"
                  onClick={openOrToggleAccountMenu}
                  onContextMenu={openAccountMenuWithRightClick}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Photo utilisateur" />
                  ) : (
                    <span>{avatarFallback.toUpperCase()}</span>
                  )}
                </button>

                {isAccountMenuVisible ? (
                  <div className="account-menu__dropdown" role="menu" aria-label="Menu utilisateur">
                    <button type="button" role="menuitem" onClick={handleAccountManagement}>
                      Gérer mon compte
                    </button>
                    <button type="button" role="menuitem" onClick={handleLogout}>
                      Déconnexion
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* --- VERSION MOBILE --- */}
      <nav className="nav-mobile">
        {isAuthenticated ? (
          <div className="account-menu account-menu--mobile">
            <button
              type="button"
              className="nav-mobile__avatar"
              aria-haspopup="menu"
              aria-expanded={isAccountMenuVisible}
              aria-label="Ouvrir le menu utilisateur"
              onClick={openOrToggleAccountMenu}
              onContextMenu={openAccountMenuWithRightClick}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Photo utilisateur" />
              ) : (
                <span>{avatarFallback.toUpperCase()}</span>
              )}
            </button>

            {isAccountMenuVisible ? (
              <div className="account-menu__dropdown" role="menu" aria-label="Menu utilisateur">
                <button type="button" role="menuitem" onClick={handleAccountManagement}>
                  Gérer mon compte
                </button>
                <button type="button" role="menuitem" onClick={handleLogout}>
                  Déconnexion
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="nav-mobile__bell">
            <Bell size={32} />
            {hasNotifications && <span className="dot"></span>}
          </div>
        )}

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
            {isAuthenticated && <li><Link to="/demandes" onClick={() => setIsOpen(false)}>Demandes</Link></li>}
            <li><Link to="/profil" onClick={() => setIsOpen(false)}>Mon Profil</Link></li>

            {!isAuthenticated ? (
              <>
                <li className="sep"></li>

                <li>
                  <Link to="/login" className="bold uppercase" onClick={() => setIsOpen(false)}>
                    CONNEXION
                  </Link>
                </li>
                <li><Link to="/register" onClick={() => setIsOpen(false)}>Inscription</Link></li>
              </>
            ) : null}
          </ul>

        </div>
      </div>
    </header>
  );
};

export default Navbar;


