import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'We encountered an issue fetching data. Please check your connection and try again.',
  onRetry
}) => {
  return (
    <div className="neo-card p-8 text-center max-w-lg mx-auto bg-[#FFFDF5] border-2 border-[#171717] my-8 shadow-[5px_5px_0_#FF6B5E]">
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl border-2 border-[#171717] bg-[#FF6B5E] text-white flex items-center justify-center shadow-[3px_3px_0_#171717]">
        <AlertTriangle size={30} />
      </div>
      <h3 className="text-xl font-black uppercase text-[#171717] mb-2">
        {title}
      </h3>
      <p className="text-gray-700 font-medium mb-6 text-sm">
        {message}
      </p>
      {onRetry && (
        <NeoButton variant="secondary" onClick={onRetry} size="sm">
          <RefreshCw size={16} />
          <span>Try Again</span>
        </NeoButton>
      )}
    </div>
  );
};
