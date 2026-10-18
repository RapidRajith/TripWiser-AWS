import React from 'react';
import { Compass, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t-[2.5px] border-[#171717] bg-white px-4 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#D8FF3E] border-2 border-[#171717] flex items-center justify-center shadow-[2px_2px_0_#171717]">
              <Compass size={18} className="text-[#171717]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#171717] uppercase">
              TripWise
            </span>
          </div>
          <p className="text-sm text-gray-600 max-w-md font-medium">
            Smart travel planner engineered for the AWS Student Builder Group, VIT Chennai recruitment task.
          </p>
        </div>

        {/* Attribution Notices (Mandatory per blueprint) */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs font-semibold text-gray-700">
          <div>
            <span className="block uppercase text-gray-400 mb-1">Places & Geocoding</span>
            <a
              href="https://www.geoapify.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 text-[#171717]"
            >
              Geoapify Places API <ExternalLink size={12} />
            </a>
          </div>
          <div>
            <span className="block uppercase text-gray-400 mb-1">Weather Forecast</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 text-[#171717]"
            >
              Open-Meteo Weather <ExternalLink size={12} />
            </a>
          </div>
          <div>
            <span className="block uppercase text-gray-400 mb-1">Map Tiles</span>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 text-[#171717]"
            >
              © OpenStreetMap <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-medium">
        <p>© {new Date().getFullYear()} TripWise. Built with Neo-brutalist precision.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Designed with <Heart size={14} className="text-[#FF6B5E] fill-[#FF6B5E]" /> for wanderers and students.
        </p>
      </div>
    </footer>
  );
};
