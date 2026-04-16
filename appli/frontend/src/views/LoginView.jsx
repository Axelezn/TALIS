import { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../components/InputField';
import talisLogoFull from '../assets/talis_logo_full.png';
import '../styles/Auth.scss';

export default function LoginView() {
  const [formData, setFormData] = useState({
    email: 'test@test.com',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Connexion avec :", formData);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <img src={talisLogoFull} alt="Talis Logo" className="logo" />
        </div>

        <div className="tabs-container">
          <Link to="/login" className="tab active">Se connecter</Link>
          <Link to="/register" className="tab">S'inscrire</Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <InputField 
            label="E-Mail"
            type="email"
            name="email"
            placeholder="test@test.com"
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
          <button type="submit" className="btn btn--primary">
            Se connecter
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