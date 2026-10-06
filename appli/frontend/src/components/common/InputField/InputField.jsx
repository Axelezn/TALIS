// src/components/common/InputField.jsx
import { useState, useId } from 'react';
import './InputField.scss';

export default function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  required = false,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const reactGeneratedId = useId();
  const inputId = id || name || reactGeneratedId;
  const errorId = `${inputId}-error`;

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="input-field-container">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && (
            <span
              className="required-asterisk"
              aria-hidden="true"
              style={{ color: '#E84118', marginLeft: '4px', fontWeight: 'bold' }}
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="input-wrapper">
        <input
          id={inputId}
          className={`custom-input ${error ? 'input-error' : ''}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          aria-required={required ? 'true' : undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            aria-pressed={showPassword}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <span
          id={errorId}
          role="alert"
          aria-live="polite"
          className="field-error-message"
          style={{
            color: '#D63031',
            fontSize: '12px',
            marginTop: '4px',
            display: 'block',
            fontWeight: '500',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}