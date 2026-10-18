
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Bookmark,
  Menu,
  X,
  Sparkles,
  Moon,
  Sun,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('tripwiser-theme') === 'dark'
  );

  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    );

    localStorage.setItem('tripwiser-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const navLinks = [
    { name: 'Explore', path: '/', icon: <Compass size={18} /> },
    { name: 'My Trips', path: '/trips', icon: <MapPin size={18} /> },
    { name: 'Favorites', path: '/favorites', icon: <Bookmark size={18} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleTheme = () => setIsDark((current) => !current);

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center justify-center gap-2 p-2.5 border-2 border-[#171717] rounded-lg bg-white text-[#171717] shadow-[2px_2px_0_#171717] hover:-translate-y-0.5 transition-transform"
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
      <span className="text-xs font-bold uppercase">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );

  return (
    <header
      className="sticky top-0 z-40 border-b-[2.5px] px-4 sm:px-8 py-3.5 shadow-sm"
      style={{
        backgroundColor: 'var(--color-paper)',
        borderColor: 'var(--color-ink)',
        color: 'var(--color-ink)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#D8FF3E] border-2 border-[#171717] flex items-center justify-center shadow-[3px_3px_0_#171717] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
            <Compass size={22} className="text-[#171717]" />
          </div>

          <span
            className="font-extrabold text-2xl tracking-tighter uppercase flex items-center gap-1"
            style={{ color: 'var(--color-ink)' }}
          >
            Trip
            <span className="bg-[#76D7FF] px-1.5 border border-[#171717] rounded shadow-[2px_2px_0_#171717]">
              Wise
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {navLinks.map((link) => {
            const active = isActive(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm uppercase rounded-lg border-2 transition-all ${
                  active
                    ? 'bg-[#171717] text-white border-[#171717] shadow-[3px_3px_0_#D8FF3E]'
                    : 'bg-white text-[#171717] border-[#171717] hover:bg-[#FFFDF5] hover:shadow-[3px_3px_0_#171717]'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {themeButton}

          <Link to="/trips" className="neo-btn neo-btn-primary neo-btn-sm">
            <Sparkles size={16} />
            <span>Plan New Trip</span>
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          {themeButton}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border-2 border-[#171717] rounded-lg bg-white text-[#171717] shadow-[2px_2px_0_#171717] cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t-2 border-[#171717] flex flex-col gap-2 pb-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 font-bold text-sm uppercase rounded-lg border-2 ${
                  active
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-[#171717] border-[#171717]'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}

          <Link
            to="/trips"
            onClick={() => setMobileMenuOpen(false)}
            className="neo-btn neo-btn-primary text-center mt-2"
          >
            <Sparkles size={16} />
            <span>Plan New Trip</span>
          </Link>
        </div>
      )}
    </header>
  );
};
