
import React, { useEffect, useState } from 'react';
import { CloudSun, CloudRain, Cloud, Wind, AlertCircle } from 'lucide-react';
import type { WeatherData } from '../../types';
import { fetchWeather } from '../../services/weather';

interface WeatherBadgeProps {
  latitude: number;
  longitude: number;
}

export const WeatherBadge: React.FC<WeatherBadgeProps> = ({
  latitude,
  longitude,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    fetchWeather(latitude, longitude)
      .then((data) => {
        if (active) setWeather(data);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [latitude, longitude]);

  if (failed) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
        <AlertCircle size={13} />
        Weather unavailable
      </span>
    );
  }

  if (!weather) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500">
        <CloudSun size={15} />
        Loading weather…
      </span>
    );
  }

  const condition = weather.current.condition;
  const Icon = condition.isRainy
    ? CloudRain
    : condition.label.toLowerCase().includes('cloud') ||
        condition.label.toLowerCase().includes('overcast') ||
        condition.label.toLowerCase().includes('fog')
      ? Cloud
      : CloudSun;

  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg border-2 border-[#171717] bg-[#D8FF3E] px-2.5 py-1.5 text-[#171717] shadow-[2px_2px_0_#171717]"
      title={`Current weather: ${condition.label}, wind ${weather.current.windspeed} km/h`}
      aria-label={`Weather: ${weather.current.temperature} degrees Celsius, ${condition.label}`}
    >
      <Icon size={16} />
      <span className="text-sm font-black">
        {weather.current.temperature}°C
      </span>
      <span className="text-xs font-bold">
        {condition.label}
      </span>
      <Wind size={13} />
      <span className="text-xs font-bold">
        {weather.current.windspeed} km/h
      </span>
    </div>
  );
};
