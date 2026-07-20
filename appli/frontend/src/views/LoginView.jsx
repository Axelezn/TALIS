import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InputField from '../components/common/InputField/InputField';
import talisLogoFull from '../assets/talis_logo_full.png';
import AuthToggle from '../components/auth/AuthToggle';
import { loginUser } from '../services/authService';
import '../styles/pages/Auth.scss';

export default function LoginView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    role: 'etudiant',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const handleChange = (e) => {
    setErrorMessage('');
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "le champ E-Mail est obligatoire";
    }
    if (!formData.password) {
      newErrors.password = "le champ Mot de passe est obligatoire";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);
      localStorage.setItem('talis_token', response.token);
      localStorage.setItem('talis_user', JSON.stringify(response.user));
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message || 'La connexion a échoué.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <img src={talisLogoFull} alt="Talis Logo" className="logo" />
        </div>

        <div className="tabs-container">
            <AuthToggle />
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="custom-select-group">
            <label className="text-bold">
              Profil <span style={{ color: '#E84118', marginLeft: '4px', fontWeight: 'bold' }}>*</span>
            </label>
            <select name="role" className="custom-select" value={formData.role} onChange={handleChange}>
              <option value="etudiant">Etudiant</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>

          {successMessage ? <p className="auth-feedback auth-feedback--success">{successMessage}</p> : null}
          {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}

          <InputField 
            label="E-Mail"
            type="email"
            name="email"
            placeholder="vous@talis.com"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />

          <InputField 
            label="Mot de passe"
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />

          <p className="required-note">* champs obligatoires !</p>

          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '12px' }}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <br></br>
          <Link to="/forgot" className="forgot-password text-small">
            Mot de passe oublié ?
          </Link>
        </form>
      </div>
    </div>
  );
}