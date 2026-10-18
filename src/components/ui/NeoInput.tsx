import React from 'react';

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const NeoInput: React.FC<NeoInputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold uppercase tracking-wider mb-1.5 text-[#171717]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 pointer-events-none text-[#171717]">
            {icon}
          </div>
        )}
        <input
          className={`neo-input ${icon ? 'pl-11' : ''} ${error ? 'border-[#FF6B5E]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs font-bold text-[#FF6B5E]">{error}</p>
      )}
    </div>
  );
};
