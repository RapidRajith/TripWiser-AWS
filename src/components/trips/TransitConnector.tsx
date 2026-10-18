import React from 'react';
import type { TripStop } from '../../types';
import { estimateTransitBetween } from '../../lib/geo';
import { Car, Footprints, ExternalLink } from 'lucide-react';

interface TransitConnectorProps {
  fromStop: TripStop;
  toStop: TripStop;
}

export const TransitConnector: React.FC<TransitConnectorProps> = ({ fromStop, toStop }) => {
  if (!fromStop.latitude || !fromStop.longitude || !toStop.latitude || !toStop.longitude) {
    return null;
  }

  const transit = estimateTransitBetween(
    Number(fromStop.latitude),
    Number(fromStop.longitude),
    Number(toStop.latitude),
    Number(toStop.longitude)
  );

  const googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromStop.latitude},${fromStop.longitude}&destination=${toStop.latitude},${toStop.longitude}`;

  return (
    <div className="flex items-center justify-center my-1.5 px-4">
      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border-1.5 border-dashed border-[#171717] bg-[#FFFDF5] text-xs font-bold text-[#171717] shadow-[1.5px_1.5px_0_#171717]">
        <div className="flex items-center gap-1 text-gray-700">
          <Car size={13} className="text-[#171717]" />
          <span>{transit.drivingFormatted}</span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1 text-gray-700">
          <Footprints size={13} className="text-[#171717]" />
          <span>{transit.walkingFormatted}</span>
        </div>
        <span className="text-gray-300">|</span>
        <span className="bg-[#FFE600] px-1.5 py-0.5 rounded text-[10px] font-black uppercase">
          {transit.distanceFormatted}
        </span>
        <a
          href={googleMapsRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center gap-0.5 ml-1"
          title="Open directions in Google Maps"
        >
          <span>Route</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};
