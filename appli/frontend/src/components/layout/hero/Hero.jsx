import React from "react";
import talisLogoFull from "../../../assets/talis_logo_full.png";
import heroGroupImage from "../../../assets/hero_img.png";
import "./Hero.scss";

export default function Hero() {
  const categories = ["Marketing", "Informatique", "Commerce"];

  return (
    <div className="hero-page-wrapper">
      <header className="hero-section">
        {/* Navigation Bar for mobile header display as requested */}
        <div className="hero-nav">
          <button type="button" className="nav-icon nav-icon--bell" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="bell-dot"></span>
          </button>
          
          <div className="nav-logo">
            <img src={talisLogoFull} alt="Talis Logo" />
          </div>
          
          <button type="button" className="nav-icon nav-icon--burger" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Hero Section Core Container */}
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Votre avenir commence ici :<br />
              <span className="hero-title-accent">trouvez le stage ou l'alternance de vos rêves.</span>
            </h1>
            <p className="hero-subtitle">Mettre en relation talents ambitieux & entreprises innovantes</p>

            <div className="hero-search-wrapper">
              <div className="search-bar">
                <input type="text" placeholder="Recherche" className="search-input" />
                <button type="button" className="search-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>

              <div className="hero-tags">
                {categories.map((category) => (
                  <button key={category} type="button" className="tag-btn">
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-image-box">
            <img src={heroGroupImage} alt="Étudiants et recruteurs" className="hero-img" />
          </div>
        </div>
      </header>

      {/* "Comment ça marche ?" Section - from your screenshots */}
      <section className="how-it-works">
        <h2 className="section-title">Comment ça marche ?</h2>
        <div className="cards-grid">
          
          <div className="work-card">
            <div className="card-icon card-icon--purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
            </div>
            <h3 className="card-label">Créer votre profil</h3>
          </div>

          <div className="work-card">
            <div className="card-icon card-icon--purple-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <circle cx="11.5" cy="14.5" r="2.5" />
                <line x1="18" y1="21" x2="13.25" y2="16.25" />
              </svg>
            </div>
            <h3 className="card-label">Explorer les offres</h3>
          </div>

          <div className="work-card">
            <div className="card-icon card-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="10" y2="15" />
                <line x1="12" y1="15" x2="15" y2="15" />
                <line x1="9" y1="11" x2="10" y2="11" />
                <line x1="12" y1="11" x2="15" y2="11" />
                <path d="M8 19h8" />
              </svg>
            </div>
            <h3 className="card-label">Gérer mes demandes</h3>
          </div>

        </div>
      </section>
    </div>
  );
}
