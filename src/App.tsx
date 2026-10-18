import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ExplorePage } from './pages/ExplorePage';
import { PlaceDetailsPage } from './pages/PlaceDetailsPage';
import { TripsPage } from './pages/TripsPage';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SharedTripPage } from './pages/SharedTripPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#FFFDF5] text-[#171717] selection:bg-[#D8FF3E]">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/places/:placeId" element={<PlaceDetailsPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/:tripId" element={<TripDetailsPage />} />
            <Route path="/shared/:tripId" element={<SharedTripPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};


export default App;
