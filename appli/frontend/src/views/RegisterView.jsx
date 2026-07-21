import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/common/InputField/InputField';
import AuthToggle from '../components/auth/AuthToggle';
import talisLogoFull from '../assets/talis_logo_full.png';
import { registerUser } from '../services/authService';
import { toast } from '../components/common/Toast/toast';
import '../styles/pages/Auth.scss';

export default function RegisterView() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('etudiant'); // 'etudiant' ou 'entreprise'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Étape 1
    email: '', lastName: '', firstName: '', address: '', city: '', zipCode: '', phone: '', password: '', confirmPassword: '', ddn: '',
    // Étape 2 - Entreprise
    companyName: '', siret: '', companySize: '', sector: '', jobTitle: '', linkedin: '', hqAddress: '', hqCity: '', hqZipCode: '',
    // Étape 2 - Étudiant
    studyLevel: '', studyPlace: '', major: '', contractType: 'stage'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    const newErrors = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = "le champ Nom est obligatoire";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "le champ Prénom est obligatoire";
    }
    if (!formData.email.trim()) {
      newErrors.email = "le champ E-Mail est obligatoire";
    }
    if (!formData.address.trim()) {
      newErrors.address = "le champ Adresse est obligatoire";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "le champ Code Postal est obligatoire";
    }
    if (!formData.city.trim()) {
      newErrors.city = "le champ Ville est obligatoire";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "le champ Téléphone est obligatoire";
    }
    if (!formData.ddn.trim()) {
      newErrors.ddn = "le champ Date de naissance est obligatoire";
    }
    if (!formData.password) {
      newErrors.password = "le champ Mot de passe est obligatoire";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "le champ Confirmation est obligatoire";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrors({ email: "L'adresse e-mail n'est pas valide." });
      toast.error('L\'adresse e-mail n\'est pas valide.');
      return;
    }

    // 3. Validate zipCode (up to 5 digits)
    const zipRegex = /^\d{1,5}$/;
    if (!zipRegex.test(formData.zipCode.trim())) {
      setErrors({ zipCode: "Le code postal doit être composé uniquement de chiffres (maximum 5 caractères)." });
      toast.error('Le code postal doit être composé uniquement de chiffres (maximum 5 caractères).');
      return;
    }

    // 4. Validate phone number format
    const cleanPhone = formData.phone.replace(/[\s.-]/g, '');
    const phoneRegex = /^(?:(?:\+|00)\d{1,4}|0)[1-9]\d{8,14}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrors({ phone: "Le numéro de téléphone n'est pas valide (ex: 0612345678)." });
      toast.error('Le numéro de téléphone n\'est pas valide (ex: 0612345678).');
      return;
    }

    // 5. Validate age (at least 15 years old)
    const birthDate = new Date(formData.ddn);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 15) {
      setErrors({ ddn: "Vous devez avoir au moins 15 ans pour accéder au site." });
      toast.error('Vous devez avoir au moins 15 ans pour accéder au site.');
      return;
    }

    // 6. Validate password match and length
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas." });
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ password: "Le mot de passe doit contenir au moins 8 caractères." });
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Check Step 2 empty fields
    if (role === 'etudiant') {
      if (!formData.studyLevel.trim()) {
        newErrors.studyLevel = "le champ Niveau d'études est obligatoire";
      }
      if (!formData.studyPlace.trim()) {
        newErrors.studyPlace = "le champ Lieu d'études est obligatoire";
      }
      if (!formData.major.trim()) {
        newErrors.major = "le champ Intitulé formation est obligatoire";
      }
    } else if (role === 'entreprise') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "le champ Nom société est obligatoire";
      }
      if (!formData.siret.trim()) {
        newErrors.siret = "le champ Siret est obligatoire";
      }
      if (!formData.companySize.trim()) {
        newErrors.companySize = "le champ Taille est obligatoire";
      }
      if (!formData.sector.trim()) {
        newErrors.sector = "le champ Secteur est obligatoire";
      }
      if (!formData.jobTitle.trim()) {
        newErrors.jobTitle = "le champ Poste occupé est obligatoire";
      }
      if (!formData.linkedin.trim()) {
        newErrors.linkedin = "le champ LinkedIn Pro est obligatoire";
      }
      if (!formData.hqAddress.trim()) {
        newErrors.hqAddress = "le champ Siège social est obligatoire";
      }
      if (!formData.hqZipCode.trim()) {
        newErrors.hqZipCode = "le champ Code Postal est obligatoire";
      }
      if (!formData.hqCity.trim()) {
        newErrors.hqCity = "le champ Ville est obligatoire";
      }

      if (!newErrors.hqZipCode) {
        const hqZipRegex = /^\d{1,5}$/;
        if (!hqZipRegex.test(formData.hqZipCode.trim())) {
          newErrors.hqZipCode = "Le code postal du siège social doit être composé uniquement de chiffres (maximum 5 caractères).";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        ...formData,
        role,
      });

      navigate('/login', {
        state: { message: 'Compte créé avec succès, vous pouvez vous connecter.' },
      });
    } catch (error) {
      toast.error(error.message || 'La création du compte a échoué.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="brand">
          <img src={talisLogoFull} alt="Talis Logo" />
        </div>
        <AuthToggle />

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {step === 1 && (
            <div className="step-content">
              <h2 className="h2-style text-small-title">Vos informations personnelles</h2>
              <div className="form-grid">
                <InputField label="Nom" name="lastName" placeholder="Dupont" value={formData.lastName} onChange={handleChange} required error={errors.lastName} />
                <InputField label="Prénom" name="firstName" placeholder="Jean" value={formData.firstName} onChange={handleChange} required error={errors.firstName} />
              </div>
              <InputField label="E-Mail" type="email" name="email" placeholder="jean@talis.com" value={formData.email} onChange={handleChange} required error={errors.email} />
              <InputField label="Adresse" name="address" placeholder="12 rue des Lilas" value={formData.address} onChange={handleChange} required error={errors.address} />
              <div className="form-grid">
                <InputField label="Code Postal" name="zipCode" placeholder="75000" value={formData.zipCode} onChange={handleChange} required error={errors.zipCode} />
                <InputField label="Ville" name="city" placeholder="Paris" value={formData.city} onChange={handleChange} required error={errors.city} />
              </div>
              <div className="form-grid">
                <InputField label="Téléphone" type="tel" name="phone" placeholder="06 12 34 56 78" value={formData.phone} onChange={handleChange} required error={errors.phone} />
                <InputField label="Date de naissance" type="date" name="ddn" value={formData.ddn} onChange={handleChange} required error={errors.ddn} />
              </div>
              <div className="form-grid">
                <InputField label="Mot de passe" type="password" name="password" value={formData.password} onChange={handleChange} required error={errors.password} />
                <InputField label="Confirmation" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required error={errors.confirmPassword} />
              </div>

              <p className="required-note">* champs obligatoires !</p>
              
              <button type="button" className="btn btn--primary" onClick={handleNextStep}>
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
                  onClick={() => {
                    setRole('etudiant');
                    setErrors({});
                  }}
                >Étudiant</button>
                <button 
                  type="button" 
                  className={`role-btn ${role === 'entreprise' ? 'active' : ''}`}
                  onClick={() => {
                    setRole('entreprise');
                    setErrors({});
                  }}
                >Entreprise</button>
              </div>

              {/* CHAMPS ÉTUDIANT */}
              {role === 'etudiant' && (
                <div className="role-fields animate-fade-in">
                  <InputField label="Niveau d'études" name="studyLevel" placeholder="Master 1..." value={formData.studyLevel} onChange={handleChange} required error={errors.studyLevel} />
                  <InputField label="Lieu d'études" name="studyPlace" placeholder="Université de..." value={formData.studyPlace} onChange={handleChange} required error={errors.studyPlace} />
                  <InputField label="Intitulé formation" name="major" placeholder="Développement Web..." value={formData.major} onChange={handleChange} required error={errors.major} />
                  <div className="custom-select-group">
                    <label className="text-bold">
                      Type de contrat <span style={{ color: '#E84118', marginLeft: '4px', fontWeight: 'bold' }}>*</span>
                    </label>
                    <select name="contractType" className="custom-select" value={formData.contractType} onChange={handleChange}>
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
                    <InputField label="Nom société" name="companyName" value={formData.companyName} onChange={handleChange} required error={errors.companyName} />
                    <InputField label="Siret" name="siret" value={formData.siret} onChange={handleChange} required error={errors.siret} />
                  </div>
                  <div className="form-grid">
                    <InputField label="Taille" name="companySize" placeholder="1-10 sal." value={formData.companySize} onChange={handleChange} required error={errors.companySize} />
                    <InputField label="Secteur" name="sector" value={formData.sector} onChange={handleChange} required error={errors.sector} />
                  </div>
                  <InputField label="Poste occupé" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required error={errors.jobTitle} />
                  <InputField label="LinkedIn Pro" name="linkedin" placeholder="url..." value={formData.linkedin} onChange={handleChange} required error={errors.linkedin} />
                  <hr />
                  <InputField label="Siège social" name="hqAddress" value={formData.hqAddress} onChange={handleChange} required error={errors.hqAddress} />
                  <div className="form-grid">
                    <InputField label="Code Postal" name="hqZipCode" value={formData.hqZipCode} onChange={handleChange} required error={errors.hqZipCode} />
                    <InputField label="Ville" name="hqCity" value={formData.hqCity} onChange={handleChange} required error={errors.hqCity} />
                  </div>
                </div>
              )}

              <p className="required-note">* champs obligatoires !</p>

              <div className="form-actions">
                <button type="button" className="btn-link" onClick={() => setStep(1)}>Retour</button>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Creation...' : 'Creer mon compte'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}