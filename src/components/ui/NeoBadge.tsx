import React from 'react';

interface NeoBadgeProps {
  label: string;
  variant?: 'lime' | 'sky' | 'coral' | 'lavender' | 'lemon' | 'white';
  icon?: React.ReactNode;
  className?: string;
}

export const NeoBadge: React.FC<NeoBadgeProps> = ({
  label,
  variant = 'lime',
  icon,
  className = ''
}) => {
  const bgClasses = {
    lime: 'bg-[#D8FF3E] text-[#171717]',
    sky: 'bg-[#76D7FF] text-[#171717]',
    coral: 'bg-[#FF6B5E] text-white',
    lavender: 'bg-[#C8B6FF] text-[#171717]',
    lemon: 'bg-[#FFE600] text-[#171717]',
    white: 'bg-white text-[#171717]'
  }[variant];

  return (
    <span className={`neo-badge ${bgClasses} ${className}`}>
      {icon && <span className="inline-flex items-center">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
