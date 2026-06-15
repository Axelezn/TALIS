import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/common/InputField/InputField";
import AuthToggle from "../components/auth/AuthToggle";
import talisLogoFull from "../assets/talis_logo_full.png";
import { registerUser } from "../services/authService";
import "../styles/pages/Auth.scss";

export default function RegisterView() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("etudiant");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    lastName: "",
    ddn: "",
    firstName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    siret: "",
    companySize: "",
    sector: "",
    jobTitle: "",
    linkedin: "",
    hqAddress: "",
    hqCity: "",
    hqZipCode: "",
    studyLevel: "",
    studyPlace: "",
    major: "",
    contractType: "stage",
  });

  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (
      !formData.lastName ||
      !formData.firstName ||
      !formData.email ||
      !formData.password ||
      !formData.ddn
    ) {
      setErrorMessage("Veuillez renseigner les champs obligatoires de l'étape 1.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setErrorMessage("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await registerUser({
        ...formData,
        ddn: formData.ddn === "" ? null : formData.ddn,
        role,
      });

      navigate("/login", {
        state: {
          message: "Compte créé avec succès, vous pouvez vous connecter.",
        },
      });
    } catch (error) {
      setErrorMessage(error.message || "La création du compte a échoué.");
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

        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="auth-feedback auth-feedback--error">{errorMessage}</p>
          ) : null}

          {step === 1 && (
            <div className="step-content">
              <h2 className="h2-style text-small-title">
                Vos informations personnelles
              </h2>
              <div className="form-grid">
                <InputField
                  label="Nom"
                  name="lastName"
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Prénom"
                  name="firstName"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <InputField
                label="Date de naissance"
                type="date"
                name="ddn"
                value={formData.ddn}
                onChange={handleChange}
                required
              />
              <InputField
                label="E-Mail"
                type="email"
                name="email"
                placeholder="jean@talis.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                label="Adresse"
                name="address"
                placeholder="12 rue des Lilas"
                value={formData.address}
                onChange={handleChange}
              />
              <div className="form-grid">
                <InputField
                  label="Code Postal"
                  name="zipCode"
                  placeholder="75000"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
                <InputField
                  label="Ville"
                  name="city"
                  placeholder="Paris"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <InputField
                label="Téléphone"
                type="tel"
                name="phone"
                placeholder="06 12 34 56 78"
                value={formData.phone}
                onChange={handleChange}
              />
              <div className="form-grid">
                <InputField
                  label="Mot de passe"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Confirmation"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="button"
                className="btn btn--primary"
                onClick={handleNextStep}
              >
                Continuer
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2 className="h2-style text-small-title">
                Quel est votre profil ?
              </h2>

              <div className="role-toggle-container">
                <button
                  type="button"
                  className={`role-btn ${role === "etudiant" ? "active" : ""}`}
                  onClick={() => setRole("etudiant")}
                >
                  Étudiant
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === "entreprise" ? "active" : ""}`}
                  onClick={() => setRole("entreprise")}
                >
                  Entreprise
                </button>
              </div>

              {role === "etudiant" && (
                <div className="role-fields animate-fade-in">
                  <InputField
                    label="Niveau d'études"
                    name="studyLevel"
                    placeholder="Master 1..."
                    value={formData.studyLevel}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Lieu d'études"
                    name="studyPlace"
                    placeholder="Université de..."
                    value={formData.studyPlace}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Intitulé formation"
                    name="major"
                    placeholder="Développement Web..."
                    value={formData.major}
                    onChange={handleChange}
                  />
                  <div className="custom-select-group">
                    <label className="text-bold">Type de contrat</label>
                    <select
                      name="contractType"
                      className="custom-select"
                      value={formData.contractType}
                      onChange={handleChange}
                    >
                      <option value="stage">Stage</option>
                      <option value="alternance">Alternance</option>
                    </select>
                  </div>
                </div>
              )}

              {role === "entreprise" && (
                <div className="role-fields animate-fade-in">
                  <div className="form-grid">
                    <InputField
                      label="Nom société"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label="Siret"
                      name="siret"
                      value={formData.siret}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-grid">
                    <InputField
                      label="Taille"
                      name="companySize"
                      placeholder="1-10 sal."
                      value={formData.companySize}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Secteur"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                    />
                  </div>
                  <InputField
                    label="Poste occupé"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                  <InputField
                    label="LinkedIn Pro"
                    name="linkedin"
                    placeholder="url..."
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                  <hr />
                  <InputField
                    label="Siège social"
                    name="hqAddress"
                    value={formData.hqAddress}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-grid">
                    <InputField
                      label="Code Postal"
                      name="hqZipCode"
                      value={formData.hqZipCode}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Ville"
                      name="hqCity"
                      value={formData.hqCity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setStep(1)}
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creation..." : "Creer mon compte"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}