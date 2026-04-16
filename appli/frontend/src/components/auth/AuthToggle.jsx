import { NavLink } from 'react-router-dom';
import './AuthToggle.scss';

const AuthToggle = () => {
  return (
    <div className="auth-toggle">
      <NavLink 
        to="/login" 
        className={({ isActive }) => `auth-toggle__item ${isActive ? 'active' : ''}`}
      >
        Se connecter
      </NavLink>
      <NavLink 
        to="/register" 
        className={({ isActive }) => `auth-toggle__item ${isActive ? 'active' : ''}`}
      >
        S'inscrire
      </NavLink>
    </div>
  );
};

export default AuthToggle;