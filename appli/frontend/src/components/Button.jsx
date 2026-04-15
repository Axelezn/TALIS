import React from 'react';
import '../styles/Button.scss'; // On pointe vers le dossier styles

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false 
}) => {
  
  // On génère dynamiquement les classes (ex: "btn btn--status btn--md")
  const className = `btn btn--${variant} btn--${size}`;

  return (
    <button 
      type={type} 
      className={className} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;