// src/components/common/InputField.jsx
import { useState } from 'react';
import './InputField.scss';

export default function InputField({ label, type, placeholder, value, onChange, name, required = false, error }) {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="input-field-container">
      {label && (
        <label className="input-label">
          {label} {required && <span className="required-asterisk" style={{ color: '#E84118', marginLeft: '4px', fontWeight: 'bold' }}>*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        <input
          className={`custom-input ${error ? 'input-error' : ''}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
        />
        
        {isPassword && (
          <button 
            type="button" 
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {/* Icône Œil SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        )}
      </div>
      {error && (
        <span className="field-error-message" style={{ color: '#E84118', fontSize: '12px', marginTop: '4px', display: 'block', fontWeight: '500' }}>
          {error}
        </span>
      )}
    </div>
  );
}