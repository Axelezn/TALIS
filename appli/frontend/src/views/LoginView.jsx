import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InputField from '../components/common/InputField/InputField';
import talisLogoFull from '../assets/talis_logo_full.png';
import AuthToggle from '../components/auth/AuthToggle';
import { loginUser } from '../services/authService';
import { toast } from '../components/common/Toast/toast';
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
  const [errors, setErrors] = useState({});

  const shownRedirectMessageRef = useRef(null);

  useEffect(() => {
    const message = location.state?.message;
    if (message && shownRedirectMessageRef.current !== message) {
      shownRedirectMessageRef.current = message;
      toast.success(message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Le champ E-Mail est obligatoire';
    }
    if (!formData.password) {
      newErrors.password = 'Le champ Mot de passe est obligatoire';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);
      localStorage.setItem('talis_token', response.token);
      localStorage.setItem('talis_user', JSON.stringify(response.user));
      window.dispatchEvent(new Event('storage'));
      toast.success(`Bon retour, ${response.user?.prenom || 'sur TALIS'} !`);
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'La connexion a échoué.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <img src={talisLogoFull} alt="TALIS - Accueil" className="logo" />
        </div>

        <div className="tabs-container">
          <AuthToggle />
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="custom-select-group">
            <label htmlFor="login-role-select" className="text-bold">
              Profil de connexion <span className="required-asterisk" aria-hidden="true" style={{ color: '#E84118', marginLeft: '4px', fontWeight: 'bold' }}>*</span>
            </label>
            <select
              id="login-role-select"
              name="role"
              className="custom-select"
              value={formData.role}
              onChange={handleChange}
              required
              aria-required="true"
            >
              <option value="etudiant">Étudiant</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>

          <InputField
            id="login-email"
            label="E-Mail"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="vous@talis.com"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />

          <InputField
            id="login-password"
            label="Mot de passe"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />

          <p className="required-note" aria-hidden="true">* champs obligatoires !</p>

          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: '12px' }}
              aria-hidden="true"
              focusable="false"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <Link to="/forgot" className="forgot-password text-small">
            Mot de passe oublié ?
          </Link>
        </form>
      </div>
    </div>
  );
}