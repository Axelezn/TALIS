import React, { useEffect, useRef, useState, useId } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOffres } from "../../../services/offreService";
import { getUtilisateurs } from "../../../services/utilisateurService";
import heroGroupImage from "../../../assets/hero_img.png";
import "./Hero.scss";

export default function Hero() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchWrapperRef = useRef(null);
  const searchListId = useId();

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("talis_token")));
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("talis_user") || "null"); } catch { return null; }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [rawData, setRawData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const isRecruiter = currentUser?.role === 'entreprise';

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("talis_token")));
      try { setCurrentUser(JSON.parse(localStorage.getItem("talis_user") || "null")); }
      catch { setCurrentUser(null); }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [location.pathname]);

  useEffect(() => {
    if (isRecruiter) {
      getUtilisateurs().then(setRawData).catch(() => setRawData([]));
    } else {
      getOffres().then(setRawData).catch(() => setRawData([]));
    }
  }, [isRecruiter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = searchQuery.trim().length >= 2
    ? rawData.filter((item) => {
        const q = searchQuery.toLowerCase();
        if (isRecruiter) {
          const name = `${item.prenom || ''} ${item.nom || ''}`.toLowerCase();
          return name.includes(q)
            || (item.formation || '').toLowerCase().includes(q)
            || (item.city || '').toLowerCase().includes(q);
        }
        return (item.titre || '').toLowerCase().includes(q)
          || (item.entreprise || '').toLowerCase().includes(q);
      }).slice(0, 6)
    : [];

  const handleSuggestionClick = (item) => {
    setShowDropdown(false);
    setSearchQuery('');
    if (isRecruiter) {
      navigate(`/candidats/${item.id_user}`);
    } else {
      navigate(`/offres?id=${item.id_offre}`);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/offres?type=${encodeURIComponent(tag)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (isRecruiter) {
      navigate(`/candidats?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/offres?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="hero-page-wrapper">
      <header className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <svg className="hero-chevron-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d="M 100,0 L 100,100 L 15,58 Q 0,50 15,42 L 100,0 Z" fill="#FFFFFF" />
            </svg>

            <h1 className="hero-title">
              Votre avenir commence ici,<br />
              <span className="hero-title-accent">trouvez votre stagiaire ou alternant(e).</span>
            </h1>
            <p className="hero-subtitle">Mettre en relation talents ambitieux & entreprises innovantes</p>

            <div className="hero-search-wrapper" ref={searchWrapperRef}>
              <form role="search" className="search-bar" onSubmit={handleSearchSubmit}>
                <label htmlFor="hero-search-input" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                  {isRecruiter ? "Rechercher un candidat" : "Rechercher une offre ou une entreprise"}
                </label>
                <input
                  id="hero-search-input"
                  type="search"
                  placeholder={isRecruiter ? "Rechercher un candidat..." : "Rechercher une offre, une entreprise..."}
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                  onKeyDown={(e) => e.key === 'Escape' && setShowDropdown(false)}
                  aria-expanded={showDropdown && suggestions.length > 0}
                  aria-autocomplete="list"
                  aria-controls={showDropdown && suggestions.length > 0 ? searchListId : undefined}
                />
                <button type="submit" className="search-btn" aria-label="Lancer la recherche">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" focusable="false">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </form>

              {showDropdown && suggestions.length > 0 && (
                <ul id={searchListId} role="listbox" className="search-suggestions" aria-label="Suggestions de recherche">
                  {suggestions.map((item) => (
                    <li key={isRecruiter ? item.id_user : item.id_offre} className="search-suggestions__item" role="option">
                      <button type="button" onClick={() => handleSuggestionClick(item)}>
                        {isRecruiter ? (
                          <>
                            <span className="suggestion-main">
                              {`${item.prenom || ''} ${item.nom || ''}`.trim()}
                            </span>
                            <span className="suggestion-sub">
                              {[item.formation, item.city].filter(Boolean).join(' · ')}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="suggestion-main">{item.titre}</span>
                            <span className="suggestion-sub">
                              {[item.entreprise, item.type].filter(Boolean).join(' · ')}
                            </span>
                          </>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!isRecruiter && (
                <div className="hero-tags" role="group" aria-label="Filtres rapides">
                  {["Stage", "Alternance"].map((tag) => (
                    <button key={tag} type="button" className="tag-btn" onClick={() => handleTagClick(tag)}>
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hero-image-box">
            <img 
              src={heroGroupImage} 
              alt="Groupe d'étudiants souriants et recruteurs en échange professionnel" 
              className="hero-img" 
            />
          </div>
        </div>
      </header>

      <section className="how-it-works" aria-labelledby="how-it-works-title">
        <h2 id="how-it-works-title" className="section-title">Comment ça marche ?</h2>
        <div className={`cards-grid ${isAuthenticated ? 'cards-grid--authenticated' : ''}`}>

          {!isAuthenticated && (
            <button type="button" className="work-card" onClick={() => navigate("/register")}>
              <div className="card-icon card-icon--purple" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="16" y1="11" x2="22" y2="11" />
                </svg>
              </div>
              <span className="card-label">Créer votre profil</span>
            </button>
          )}

          <button type="button" className="work-card" onClick={() => navigate("/offres")}>
            <div className="card-icon card-icon--purple-blue" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <circle cx="11.5" cy="14.5" r="2.5" />
                <line x1="18" y1="21" x2="13.25" y2="16.25" />
              </svg>
            </div>
            <span className="card-label">Explorer les offres</span>
          </button>

          <button type="button" className="work-card" onClick={() => navigate(isAuthenticated ? "/demandes" : "/login")}>
            <div className="card-icon card-icon--blue" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="10" y2="15" />
                <line x1="12" y1="15" x2="15" y2="15" />
                <line x1="9" y1="11" x2="10" y2="11" />
                <line x1="12" y1="11" x2="15" y2="11" />
                <path d="M8 19h8" />
              </svg>
            </div>
            <span className="card-label">Gérer mes demandes</span>
          </button>

        </div>
      </section>
    </div>
  );
}