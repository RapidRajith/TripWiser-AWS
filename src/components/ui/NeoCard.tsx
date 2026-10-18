import React from 'react';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'lime' | 'sky' | 'lavender';
  hoverable?: boolean;
  children: React.ReactNode;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  variant = 'white',
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  const variantClass = {
    white: 'bg-white',
    lime: 'neo-card-lime',
    sky: 'neo-card-sky',
    lavender: 'neo-card-lavender'
  }[variant];

  return (
    <div
      className={`neo-card ${variantClass} ${hoverable ? 'neo-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
