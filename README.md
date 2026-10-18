# 🗺️ TripWise — Smart Travel Planner

🔗 **Live Website:** [https://trip-wiser-aws.vercel.app/](https://trip-wiser-aws.vercel.app/)

> **AWS Student Builder Group, VIT Chennai — Web Development Recruitment Task**  
> **Track:** Full-Stack Web Development  
> **Aesthetic Direction:** Editorial Neo-Brutalism  
> **Status:** Fully Functional & Production-Ready  

---

## 🌟 Overview

**TripWise** is a modern, high-contrast travel planning web application that eliminates the chaos of juggling multiple tabs. Travellers can effortlessly discover destinations across the globe, inspect live weather forecasts, organize day-by-day itineraries, estimate travel expenses, and manage saved bookmarks.

---

## 🚀 Key Features

### 1. Destination Discovery (Real External Data)
- **Live Search & Geocoding:** Search destinations worldwide (e.g., Chennai, Paris, Tokyo, Rome, New York).
- **Category Filtering:** Filter places by Attractions, Food & Dining, Nature & Parks, Entertainment, and Accommodations.
- **Dual View Modes:** Seamlessly switch between a high-contrast **Card Grid** and an interactive **OpenStreetMap** with custom place popups.
- **Honest Attribution:** Attribution clearly displayed for Geoapify Places and OpenStreetMap contributors.

### 2. Destination Details & Weather Intelligence
- **Place Dossier:** Detailed view with name, category badge, address, coordinates, and visiting hours.
- **Real-Time Climate Widget:** Live temperature, wind speed, weather conditions, and a 5-day outlook powered by the **Open-Meteo API**.
- **Weather-Aware Travel Hints:** Automatically detects rainfall probabilities (>40%) and advises travellers to pack an umbrella or pivot to indoor museums and cafes.
- **External Map Directions:** Direct integration with Google Maps route directions.

### 3. Comprehensive Itinerary Management & Transit Intelligence
- **Day-Wise Planning:** Structure visits across multiple days (Day 1, Day 2, Day 3, etc.).
- **Smart Stop-to-Stop Transit Connectors:** Computes exact geographic distance (Haversine formula), estimated driving duration, walking time, and gives a 1-click Google Maps route link between consecutive stops on each day.
- **Accessible Stop Reordering:** Move stops up or down with keyboard-accessible controls and persistent sequence order.
- **Personal Notes & Tips:** Attach customized notes and timing hints to individual stops.
- **Budget Estimator:** Enter estimated expenses per stop to compute automatic day-wise and total trip expenditure.
- **Delete & Confirm:** Safe stop removal with clear visual feedback.

### 4. Weather-Aware Smart Packing Assistant
- Dynamically analyzes destination climate and itinerary duration.
- Generates categorized checklist items (*Weather Essentials, Travel Documents, Tech Gear, Apparel*).
- Interactive packing progress bar with real-time percentage indicators and custom item addition.

### 5. Curated 1-Click Expeditions (Trip Templates)
- Instant multi-day itineraries for top destinations (e.g., Chennai Heritage Trail, Paris Art & Cafes).
- Clone complete day-by-day itineraries with pre-filled costs, coordinates, and notes in one click.

### 6. Multi-Format Itinerary Export (CSV, JSON & Print)
- One-click **CSV export** for spreadsheet planning.
- Full **JSON dossier export** for backup and data portability.
- Styled, print-friendly browser print layout.

### 7. Saved Favorites & Bookmarking
- Bookmark places with one-click heart controls.
- Dedicated `/favorites` page with direct "Add to Itinerary" shortcuts.

### 8. Data Persistence & Resilient Offline Support
- **Automatic Local & Cloud Persistence:** Safely stores your itineraries, stops, and saved destinations.
- **Resilient Offline/Preview Fallback:** Operates seamlessly out of the box with zero setup hurdles or runtime errors.

### 9. Design System: Editorial Neo-Brutalism
- **Tokens:** High-contrast palette (`#171717` Ink, `#FFFDF5` Paper, `#D8FF3E` Electric Lime, `#76D7FF` Sky Blue, `#FF6B5E` Hot Coral, `#FFE600` Lemon).
- **Tactile Depth:** 2.5px solid black borders, hard offset drop shadows (`4px 4px 0 #171717`), press animations (`active:translate-x-1 active:translate-y-1`).
- **Typography:** `Space Grotesk` (bold editorial titles) paired with `Plus Jakarta Sans` (legible body).
- **Responsive:** Mobile-first layout with accessible touch targets and focus rings.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript + Vite | Component-based, lightning-fast SPA |
| **Styling** | Tailwind CSS v4 + Custom Neo-Brutalist CSS tokens | Tactile editorial design system |
| **Icons** | Lucide React | High-clarity geometric icons |
| **Routing** | React Router v7 | Client-side routing with deep link support |
| **Mapping** | Leaflet + OpenStreetMap | Interactive place markers and bounds fitting |
| **Weather** | Open-Meteo REST API | Free, zero-auth live weather forecast service |
| **Places API** | Geoapify Places API | Verified POI discovery and geocoding |
| **Testing** | Vitest | Unit testing suite for weather and budget logic |

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 2. Clone and Install
```bash
git clone https://github.com/RapidRajith/TripWiser-AWS.git
cd TripWiser-AWS
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: add your Geoapify API key for custom search quotas; built-in fallbacks allow full immediate local testing).*

### 4. Start Local Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Run Unit Tests
```bash
npm test
```

### 6. Build for Production
```bash
npm run build
```

---

## 🌐 Live Website

The production application is live and hosted at:
👉 **[https://trip-wiser-aws.vercel.app/](https://trip-wiser-aws.vercel.app/)**

---

## 📋 Definition of Done Checklist

- [x] Real external places discovery with geocoding & categories
- [x] Search, category filtering, and list/map toggle
- [x] Destination details with interactive Leaflet map
- [x] Real-time Open-Meteo weather with precipitation hints
- [x] Add, view, reorder, and remove itinerary stops
- [x] Day-wise trip organizer with budget calculations
- [x] Multi-format export (CSV, JSON, styled print layout)
- [x] Weather-aware smart packing checklist generator
- [x] Resilient graceful degradation for loading, empty, and offline states
- [x] Responsive editorial Neo-Brutalist design across all screen sizes
- [x] Automated unit test suite passing with Vitest
- [x] Clean production build with zero errors

---

## ⚖️ Attribution & Licensing

- Place data provided via **Geoapify Places API** & **OpenStreetMap Contributors**.
- Weather forecast data provided via **Open-Meteo** (under CC BY 4.0).
- Map tiles provided via **© OpenStreetMap contributors**.
