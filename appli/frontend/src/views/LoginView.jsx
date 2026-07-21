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

  // Ref (et non un state) car elle doit survivre au double-appel de l'effet
  // fait par StrictMode en dev, qui sinon affiche ce toast deux fois avant
  // que le navigate(replace) ci-dessous n'ait vidé location.state.
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);
      localStorage.setItem('talis_token', response.token);
      localStorage.setItem('talis_user', JSON.stringify(response.user));
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
          <img src={talisLogoFull} alt="Talis Logo" className="logo" />
        </div>

        <div className="tabs-container">
            <AuthToggle />
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="custom-select-group">
            <label className="text-bold">Profil</label>
            <select name="role" className="custom-select" value={formData.role} onChange={handleChange}>
              <option value="etudiant">Etudiant</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>

          <InputField
            label="E-Mail"
            type="email"
            name="email"
            placeholder="vous@talis.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField 
            label="Mot de passe"
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
          />
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