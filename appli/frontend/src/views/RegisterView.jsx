import { useState } from 'react';
import InputField from '../components/common/InputField/InputField';
import AuthToggle from '../components/auth/AuthToggle';
import talisLogoFull from '../assets/talis_logo_full.png';
import '../styles/pages/Auth.scss';

export default function RegisterView() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('etudiant'); // 'etudiant' ou 'entreprise'

  const [formData, setFormData] = useState({
    // Étape 1
    email: '', lastName: '', firstName: '', address: '', city: '', zipCode: '', phone: '', password: '', confirmPassword: '',
    // Étape 2 - Entreprise
    companyName: '', siret: '', companySize: '', sector: '', jobTitle: '', linkedin: '', hqAddress: '', hqCity: '', hqZipCode: '',
    // Étape 2 - Étudiant
    studyLevel: '', studyPlace: '', major: '', contractType: 'stage'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="brand">
          <img src={talisLogoFull} alt="Talis Logo" />
        </div>
        <AuthToggle />

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <div className="step-content">
              <h2 className="h2-style text-small-title">Vos informations personnelles</h2>
              <div className="form-grid">
                <InputField label="Nom" name="lastName" placeholder="Dupont" onChange={handleChange} />
                <InputField label="Prénom" name="firstName" placeholder="Jean" onChange={handleChange} />
              </div>
              <InputField label="E-Mail" type="email" name="email" placeholder="jean@talis.com" onChange={handleChange} />
              <InputField label="Adresse" name="address" placeholder="12 rue des Lilas" onChange={handleChange} />
              <div className="form-grid">
                <InputField label="Code Postal" name="zipCode" placeholder="75000" onChange={handleChange} />
                <InputField label="Ville" name="city" placeholder="Paris" onChange={handleChange} />
              </div>
              <InputField label="Téléphone" type="tel" name="phone" placeholder="06 12 34 56 78" onChange={handleChange} />
              <div className="form-grid">
                <InputField label="Mot de passe" type="password" name="password" onChange={handleChange} />
                <InputField label="Confirmation" type="password" name="confirmPassword" onChange={handleChange} />
              </div>
              
              <button type="button" className="btn btn--primary" onClick={() => setStep(2)}>
                Continuer
              </button>
            </div>
          )}

          {/* --- ÉTAPE 2 : RÔLE ET DÉTAILS --- */}
          {step === 2 && (
            <div className="step-content">
              <h2 className="h2-style text-small-title">Quel est votre profil ?</h2>
              
              {/* Le second AuthToggle pour le rôle */}
              <div className="role-toggle-container">
                <button 
                  type="button" 
                  className={`role-btn ${role === 'etudiant' ? 'active' : ''}`}
                  onClick={() => setRole('etudiant')}
                >Étudiant</button>
                <button 
                  type="button" 
                  className={`role-btn ${role === 'entreprise' ? 'active' : ''}`}
                  onClick={() => setRole('entreprise')}
                >Entreprise</button>
              </div>

              {/* CHAMPS ÉTUDIANT */}
              {role === 'etudiant' && (
                <div className="role-fields animate-fade-in">
                  <InputField label="Niveau d'études" name="studyLevel" placeholder="Master 1..." onChange={handleChange} />
                  <InputField label="Lieu d'études" name="studyPlace" placeholder="Université de..." onChange={handleChange} />
                  <InputField label="Intitulé formation" name="major" placeholder="Développement Web..." onChange={handleChange} />
                  <div className="custom-select-group">
                    <label className="text-bold">Type de contrat</label>
                    <select name="contractType" className="custom-select" onChange={handleChange}>
                      <option value="stage">Stage</option>
                      <option value="alternance">Alternance</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CHAMPS ENTREPRISE */}
              {role === 'entreprise' && (
                <div className="role-fields animate-fade-in">
                  <div className="form-grid">
                    <InputField label="Nom société" name="companyName" onChange={handleChange} />
                    <InputField label="Siret" name="siret" onChange={handleChange} />
                  </div>
                  <div className="form-grid">
                    <InputField label="Taille" name="companySize" placeholder="1-10 sal." onChange={handleChange} />
                    <InputField label="Secteur" name="sector" onChange={handleChange} />
                  </div>
                  <InputField label="Poste occupé" name="jobTitle" onChange={handleChange} />
                  <InputField label="LinkedIn Pro" name="linkedin" placeholder="url..." onChange={handleChange} />
                  <hr />
                  <InputField label="Siège social" name="hqAddress" onChange={handleChange} />
                  <div className="form-grid">
                    <InputField label="Code Postal" name="hqZipCode" onChange={handleChange} />
                    <InputField label="Ville" name="hqCity" onChange={handleChange} />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-link" onClick={() => setStep(1)}>Retour</button>
                <button type="submit" className="btn btn--primary">Créer mon compte</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}