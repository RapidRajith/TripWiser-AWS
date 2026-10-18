import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NeoButton } from '../components/ui/NeoButton';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="neo-card p-10 text-center max-w-md bg-white border-[3px] border-[#171717] shadow-[6px_6px_0_#171717]">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#FF6B5E] text-white flex items-center justify-center font-black text-2xl border-2 border-[#171717] shadow-[3px_3px_0_#171717]">
          404
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight text-[#171717] mb-2">
          Lost Your Way?
        </h2>
        <p className="text-gray-600 font-medium mb-6 text-sm">
          The page or itinerary you are seeking doesn't exist on this map.
        </p>
        <Link to="/">
          <NeoButton variant="primary">
            <ArrowLeft size={16} /> Back to Civilization
          </NeoButton>
        </Link>
      </div>
    </div>
  );
};
