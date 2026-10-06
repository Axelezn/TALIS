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
  const [role, setRole] = useState('etudiant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: '', lastName: '', firstName: '', address: '', city: '', zipCode: '', phone: '', password: '', confirmPassword: '', ddn: '',
    companyName: '', siret: '', companySize: '', sector: '', jobTitle: '', linkedin: '', hqAddress: '', hqCity: '', hqZipCode: '',
    studyLevel: '', studyPlace: '', major: '', contractType: 'stage'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    const newErrors = {};

    if (!formData.lastName.trim()) newErrors.lastName = "Le champ Nom est obligatoire";
    if (!formData.firstName.trim()) newErrors.firstName = "Le champ Prénom est obligatoire";
    if (!formData.email.trim()) newErrors.email = "Le champ E-Mail est obligatoire";
    if (!formData.address.trim()) newErrors.address = "Le champ Adresse est obligatoire";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Le champ Code Postal est obligatoire";
    if (!formData.city.trim()) newErrors.city = "Le champ Ville est obligatoire";
    if (!formData.phone.trim()) newErrors.phone = "Le champ Téléphone est obligatoire";
    if (!formData.ddn.trim()) newErrors.ddn = "Le champ Date de naissance est obligatoire";
    if (!formData.password) newErrors.password = "Le champ Mot de passe est obligatoire";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Le champ Confirmation est obligatoire";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrors({ email: "L'adresse e-mail n'est pas valide." });
      toast.error("L'adresse e-mail n'est pas valide.");
      return;
    }

    const zipRegex = /^\d{1,5}$/;
    if (!zipRegex.test(formData.zipCode.trim())) {
      setErrors({ zipCode: "Le code postal doit être composé uniquement de chiffres (maximum 5 caractères)." });
      toast.error("Le code postal doit être composé uniquement de chiffres (maximum 5 caractères).");
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s.-]/g, '');
    const phoneRegex = /^(?:(?:\+|00)\d{1,4}|0)[1-9]\d{8,14}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrors({ phone: "Le numéro de téléphone n'est pas valide (ex: 0612345678)." });
      toast.error("Le numéro de téléphone n'est pas valide (ex: 0612345678).");
      return;
    }

    const birthDate = new Date(formData.ddn);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 15) {
      setErrors({ ddn: "Vous devez avoir au moins 15 ans pour accéder au site." });
      toast.error("Vous devez avoir au moins 15 ans pour accéder au site.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas." });
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ password: "Le mot de passe doit contenir au moins 8 caractères." });
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (role === 'etudiant') {
      if (!formData.studyLevel.trim()) newErrors.studyLevel = "Le champ Niveau d'études est obligatoire";
      if (!formData.studyPlace.trim()) newErrors.studyPlace = "Le champ Lieu d'études est obligatoire";
      if (!formData.major.trim()) newErrors.major = "Le champ Intitulé formation est obligatoire";
    } else if (role === 'entreprise') {
      if (!formData.companyName.trim()) newErrors.companyName = "Le champ Nom société est obligatoire";
      if (!formData.siret.trim()) newErrors.siret = "Le champ Siret est obligatoire";
      if (!formData.companySize.trim()) newErrors.companySize = "Le champ Taille est obligatoire";
      if (!formData.sector.trim()) newErrors.sector = "Le champ Secteur est obligatoire";
      if (!formData.jobTitle.trim()) newErrors.jobTitle = "Le champ Poste occupé est obligatoire";
      if (!formData.linkedin.trim()) newErrors.linkedin = "Le champ LinkedIn Pro est obligatoire";
      if (!formData.hqAddress.trim()) newErrors.hqAddress = "Le champ Siège social est obligatoire";
      if (!formData.hqZipCode.trim()) newErrors.hqZipCode = "Le champ Code Postal est obligatoire";
      if (!formData.hqCity.trim()) newErrors.hqCity = "Le champ Ville est obligatoire";

      if (!newErrors.hqZipCode) {
        const hqZipRegex = /^\d{1,5}$/;
        if (!hqZipRegex.test(formData.hqZipCode.trim())) {
          newErrors.hqZipCode = "Le code postal du siège social doit comporter 5 chiffres maximum.";
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
          <img src={talisLogoFull} alt="TALIS - Accueil" />
        </div>
        <AuthToggle />

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {step === 1 && (
            <fieldset className="step-fieldset">
              <legend className="step-legend h2-style text-small-title">Vos informations personnelles (Étape 1 sur 2)</legend>

              <div className="form-grid">
                <InputField
                  id="register-lastname"
                  label="Nom"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  error={errors.lastName}
                />
                <InputField
                  id="register-firstname"
                  label="Prénom"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  error={errors.firstName}
                />
              </div>

              <InputField
                id="register-email"
                label="E-Mail"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="jean@talis.com"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
              />

              <InputField
                id="register-address"
                label="Adresse"
                name="address"
                autoComplete="street-address"
                placeholder="12 rue des Lilas"
                value={formData.address}
                onChange={handleChange}
                required
                error={errors.address}
              />

              <div className="form-grid">
                <InputField
                  id="register-zipcode"
                  label="Code Postal"
                  name="zipCode"
                  autoComplete="postal-code"
                  placeholder="75000"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  error={errors.zipCode}
                />
                <InputField
                  id="register-city"
                  label="Ville"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Paris"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  error={errors.city}
                />
              </div>

              <div className="form-grid">
                <InputField
                  id="register-phone"
                  label="Téléphone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  error={errors.phone}
                />
                <InputField
                  id="register-ddn"
                  label="Date de naissance (15 ans minimum)"
                  type="date"
                  name="ddn"
                  autoComplete="bday"
                  value={formData.ddn}
                  onChange={handleChange}
                  required
                  error={errors.ddn}
                />
              </div>

              <div className="form-grid">
                <InputField
                  id="register-password"
                  label="Mot de passe (8 caractères minimum)"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  error={errors.password}
                />
                <InputField
                  id="register-confirm-password"
                  label="Confirmation du mot de passe"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  error={errors.confirmPassword}
                />
              </div>

              <p className="required-note" aria-hidden="true">* champs obligatoires !</p>

              <button type="button" className="btn btn--primary" onClick={handleNextStep}>
                Continuer vers l'étape 2
              </button>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="step-fieldset">
              <legend className="step-legend h2-style text-small-title">Quel est votre profil ? (Étape 2 sur 2)</legend>

              {/* Groupe de choix du rôle conforme RGAA 11.5 */}
              <div className="role-toggle-container" role="radiogroup" aria-label="Sélection de votre rôle">
                <button
                  type="button"
                  role="radio"
                  aria-checked={role === 'etudiant'}
                  className={`role-btn ${role === 'etudiant' ? 'active' : ''}`}
                  onClick={() => {
                    setRole('etudiant');
                    setErrors({});
                  }}
                >
                  Étudiant
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={role === 'entreprise'}
                  className={`role-btn ${role === 'entreprise' ? 'active' : ''}`}
                  onClick={() => {
                    setRole('entreprise');
                    setErrors({});
                  }}
                >
                  Entreprise
                </button>
              </div>

              {role === 'etudiant' && (
                <div className="role-fields animate-fade-in">
                  <InputField
                    id="etudiant-studylevel"
                    label="Niveau d'études"
                    name="studyLevel"
                    placeholder="Master 1..."
                    value={formData.studyLevel}
                    onChange={handleChange}
                    required
                    error={errors.studyLevel}
                  />
                  <InputField
                    id="etudiant-studyplace"
                    label="Lieu d'études"
                    name="studyPlace"
                    placeholder="Université ou centre..."
                    value={formData.studyPlace}
                    onChange={handleChange}
                    required
                    error={errors.studyPlace}
                  />
                  <InputField
                    id="etudiant-major"
                    label="Intitulé formation"
                    name="major"
                    placeholder="Développement Web..."
                    value={formData.major}
                    onChange={handleChange}
                    required
                    error={errors.major}
                  />
                  <div className="custom-select-group">
                    <label htmlFor="register-contract-type" className="text-bold">
                      Type de contrat <span className="required-asterisk" aria-hidden="true" style={{ color: '#E84118', marginLeft: '4px', fontWeight: 'bold' }}>*</span>
                    </label>
                    <select
                      id="register-contract-type"
                      name="contractType"
                      className="custom-select"
                      value={formData.contractType}
                      onChange={handleChange}
                      required
                      aria-required="true"
                    >
                      <option value="stage">Stage</option>
                      <option value="alternance">Alternance</option>
                    </select>
                  </div>
                </div>
              )}

              {role === 'entreprise' && (
                <div className="role-fields animate-fade-in">
                  <div className="form-grid">
                    <InputField
                      id="entreprise-name"
                      label="Nom société"
                      name="companyName"
                      autoComplete="organization"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      error={errors.companyName}
                    />
                    <InputField
                      id="entreprise-siret"
                      label="Siret (14 chiffres)"
                      name="siret"
                      value={formData.siret}
                      onChange={handleChange}
                      required
                      error={errors.siret}
                    />
                  </div>
                  <div className="form-grid">
                    <InputField
                      id="entreprise-size"
                      label="Taille de l'entreprise"
                      name="companySize"
                      placeholder="1-10 sal."
                      value={formData.companySize}
                      onChange={handleChange}
                      required
                      error={errors.companySize}
                    />
                    <InputField
                      id="entreprise-sector"
                      label="Secteur d'activité"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      required
                      error={errors.sector}
                    />
                  </div>
                  <InputField
                    id="entreprise-jobtitle"
                    label="Poste occupé"
                    name="jobTitle"
                    autoComplete="organization-title"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    error={errors.jobTitle}
                  />
                  <InputField
                    id="entreprise-linkedin"
                    label="LinkedIn Professionnel"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin}
                    onChange={handleChange}
                    required
                    error={errors.linkedin}
                  />
                  <hr aria-hidden="true" />
                  <InputField
                    id="entreprise-hqaddress"
                    label="Adresse du siège social"
                    name="hqAddress"
                    value={formData.hqAddress}
                    onChange={handleChange}
                    required
                    error={errors.hqAddress}
                  />
                  <div className="form-grid">
                    <InputField
                      id="entreprise-hqzipcode"
                      label="Code Postal du siège social"
                      name="hqZipCode"
                      value={formData.hqZipCode}
                      onChange={handleChange}
                      required
                      error={errors.hqZipCode}
                    />
                    <InputField
                      id="entreprise-hqcity"
                      label="Ville du siège social"
                      name="hqCity"
                      value={formData.hqCity}
                      onChange={handleChange}
                      required
                      error={errors.hqCity}
                    />
                  </div>
                </div>
              )}

              <p className="required-note" aria-hidden="true">* champs obligatoires !</p>

              <div className="form-actions">
                <button type="button" className="btn-back" onClick={() => setStep(1)}>
                  Retour à l'étape 1
                </button>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
                </button>
              </div>
            </fieldset>
          )}
        </form>
      </div>
    </div>
  );
}