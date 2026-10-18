import React, { useEffect, useState } from 'react';
import type { WeatherData } from '../../types';
import { fetchWeather } from '../../services/weather';
import { CloudRain, Wind, Umbrella, Sun, AlertCircle } from 'lucide-react';
import { NeoCard } from '../ui/NeoCard';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  cityName?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  latitude,
  longitude,
  cityName
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchWeather(latitude, longitude)
      .then(data => {
        if (isMounted) {
          setWeather(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Weather forecast unavailable');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  if (isLoading) {
    return (
      <NeoCard className="p-5 bg-white">
        <LoadingSkeleton className="h-6 w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <LoadingSkeleton className="h-16 w-full" />
          <LoadingSkeleton className="h-16 w-full" />
        </div>
      </NeoCard>
    );
  }

  if (error || !weather) {
    return (
      <NeoCard className="p-4 bg-gray-50 border-gray-400">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <AlertCircle size={16} />
          <span>Local weather forecast temporarily unavailable.</span>
        </div>
      </NeoCard>
    );
  }

  const isRainExpected = weather.current.condition.isRainy || weather.daily.some(d => d.precipitationProb > 40);

  return (
    <NeoCard className="p-5 bg-[#FFFDF5] border-[2.5px] border-[#171717] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#171717]/15">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 block">
            Destination Climate
          </span>
          <h4 className="text-lg font-black text-[#171717]">
            {cityName ? `Weather in ${cityName}` : 'Local Forecast'}
          </h4>
        </div>
        <div className="text-3xl font-extrabold">
          {weather.current.condition.icon}
        </div>
      </div>

      {/* Current Conditions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-white p-3 rounded-lg border-2 border-[#171717] shadow-[2px_2px_0_#171717]">
          <span className="text-[11px] font-bold uppercase text-gray-500 block">Temperature</span>
          <span className="text-2xl font-black text-[#171717]">
            {weather.current.temperature}°C
          </span>
        </div>

        <div className="bg-white p-3 rounded-lg border-2 border-[#171717] shadow-[2px_2px_0_#171717]">
          <span className="text-[11px] font-bold uppercase text-gray-500 block">Condition</span>
          <span className="text-sm font-extrabold text-[#171717] flex items-center gap-1 mt-1">
            {weather.current.condition.label}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-3 rounded-lg border-2 border-[#171717] shadow-[2px_2px_0_#171717]">
          <span className="text-[11px] font-bold uppercase text-gray-500 block">Wind Speed</span>
          <span className="text-base font-black text-[#171717] flex items-center gap-1 mt-1">
            <Wind size={16} /> {weather.current.windspeed} km/h
          </span>
        </div>
      </div>

      {/* Weather-Aware Trip Hints (Feature from Blueprint Section 5.2) */}
      {isRainExpected ? (
        <div className="mb-4 p-3 rounded-lg bg-[#FF6B5E]/15 border-2 border-[#FF6B5E] text-[#171717] flex items-start gap-2.5">
          <Umbrella size={20} className="text-[#FF6B5E] shrink-0 mt-0.5" />
          <div className="text-xs font-semibold">
            <span className="font-extrabold block uppercase tracking-wide text-[#FF6B5E]">
              Travel Advisory: Rain Anticipated
            </span>
            Showers predicted during your trip window. Carry rain gear or prioritize indoor heritage museums & cafes.
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 rounded-lg bg-[#D8FF3E]/30 border-2 border-[#171717] text-[#171717] flex items-start gap-2.5">
          <Sun size={20} className="text-[#171717] shrink-0 mt-0.5" />
          <div className="text-xs font-semibold">
            <span className="font-extrabold block uppercase tracking-wide">
              Great Sightseeing Weather
            </span>
            Clear conditions expected. Excellent for waterfront walks, outdoor monuments, and park strolls!
          </div>
        </div>
      )}

      {/* 5-Day Outlook */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 block">
          5-Day Forecast
        </span>
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {weather.daily.map((day) => {
            const dateObj = new Date(day.date);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div
                key={day.date}
                className="bg-white p-2 rounded-md border-1.5 border-[#171717] shadow-[1.5px_1.5px_0_#171717]"
              >
                <span className="text-[10px] font-extrabold uppercase text-gray-500 block">
                  {dayName}
                </span>
                <span className="text-lg my-1 block">{day.condition.icon}</span>
                <span className="text-xs font-black text-[#171717] block">
                  {day.tempMax}°
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {day.tempMin}°
                </span>
                {day.precipitationProb > 20 && (
                  <span className="text-[9px] font-bold text-blue-600 flex items-center justify-center gap-0.5 mt-1">
                    <CloudRain size={10} /> {day.precipitationProb}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </NeoCard>
  );
};
