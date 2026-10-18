import React from 'react';
import { Compass } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="neo-card p-10 text-center max-w-lg mx-auto bg-white my-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl border-2 border-[#171717] bg-[#FFE600] flex items-center justify-center shadow-[3px_3px_0_#171717]">
        {icon || <Compass size={32} className="text-[#171717]" />}
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tight text-[#171717] mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 font-medium">
        {description}
      </p>
      {actionLabel && onAction && (
        <NeoButton variant="primary" onClick={onAction}>
          {actionLabel}
        </NeoButton>
      )}
    </div>
  );
};
