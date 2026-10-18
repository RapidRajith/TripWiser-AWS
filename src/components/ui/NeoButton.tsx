import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'sky' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'neo-btn-primary',
    secondary: 'neo-btn-secondary',
    sky: 'neo-btn-sky',
    danger: 'neo-btn-danger',
    ghost: 'bg-transparent border-transparent shadow-none hover:bg-black/5 hover:shadow-none'
  }[variant];

  const sizeClasses = {
    sm: 'neo-btn-sm',
    md: '',
    lg: 'text-lg px-6 py-3.5'
  }[size];

  return (
    <button
      className={`neo-btn ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
