# 🗺️ TripWise — Smart Travel Planner

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

### 3. Comprehensive Itinerary Management
- **Day-Wise Planning:** Structure visits across multiple days (Day 1, Day 2, Day 3, etc.).
- **Accessible Stop Reordering:** Move stops up or down with keyboard-accessible controls and persistent sequence order.
- **Personal Notes & Tips:** Attach customized notes and timing hints to individual stops.
- **Budget Estimator:** Enter estimated expenses per stop to compute automatic day-wise and total trip expenditure.
- **Delete & Confirm:** Safe stop removal with clear visual feedback.

### 4. Saved Favorites & Bookmarking
- Bookmark places with one-click heart controls.
- Dedicated `/favorites` page with direct "Add to Itinerary" shortcuts.

### 5. Multi-Layer Persistence (Supabase + Resilient Local Fallback)
- **Supabase PostgreSQL & Auth:** Full-stack migration script with **Row Level Security (RLS)** ensuring users only access their own records.
- **Resilient Offline/Preview Fallback:** Automatically operates seamlessly out of the box with zero runtime breakages even before cloud keys are configured.

### 6. Design System: Editorial Neo-Brutalism
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
| **Routing** | React Router v7 | Client-side routing with SPA fallback |
| **Mapping** | Leaflet + OpenStreetMap | Interactive place markers and bounds fitting |
| **Weather** | Open-Meteo REST API | Free, zero-auth weather forecast service |
| **Places API** | Geoapify Places API | Verified POI discovery and geocoding |
| **Database** | Supabase (PostgreSQL) | Relational persistence with RLS security |
| **Testing** | Vitest | Unit testing suite for weather and budget logic |
| **Deployment** | Vercel Serverless | Edge deployment with SPA rewrite rules |

---

## 📁 Repository Structure

```text
tripwise/
├── api/                       # Vercel serverless functions
│   ├── health.ts              # API health check endpoint
│   ├── places/index.ts        # Geoapify places search with Zod validation
│   └── weather.ts             # Open-Meteo forecast endpoint
├── src/
│   ├── components/
│   │   ├── feedback/          # EmptyState, ErrorState
│   │   ├── layout/            # Header (responsive), Footer (attributions)
│   │   ├── places/            # SearchBar, CategoryFilter, PlaceCard, MapView, WeatherWidget
│   │   ├── trips/             # TripCard, StopCard, BudgetSummary, AddToTripModal, CreateTripModal
│   │   └── ui/                # NeoButton, NeoCard, NeoBadge, NeoInput, NeoModal, LoadingSkeleton
│   ├── pages/
│   │   ├── ExplorePage.tsx    # Destination discovery & interactive map
│   │   ├── PlaceDetailsPage.tsx # Single place info + live weather widget
│   │   ├── TripsPage.tsx      # My Trips hub & trip creation
│   │   ├── TripDetailsPage.tsx # Day-wise workspace, stop reordering & budget
│   │   ├── FavoritesPage.tsx  # Bookmarked destinations
│   │   └── NotFoundPage.tsx   # Neo-brutalist 404 page
│   ├── services/
│   │   ├── places.ts          # Place search, geocoding & curated fallbacks
│   │   ├── weather.ts         # Weather decoding, rain warnings & forecasts
│   │   ├── trips.ts           # Itinerary CRUD, reordering & budget math
│   │   └── favorites.ts       # Bookmark persistence
│   ├── types/index.ts         # Central TypeScript interfaces
│   ├── App.tsx                # Master router
│   ├── index.css              # Neo-brutalism design tokens & utility classes
│   └── main.tsx
├── supabase/
│   └── migrations/
│       └── 20261018_initial_schema.sql # Database DDL & RLS policies
├── .env.example               # Safe environment variable template
├── .gitignore                 # Strict ignore rules (no secrets committed)
├── vercel.json                # Vercel SPA rewrite & framework configuration
└── package.json
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 2. Clone and Install
```bash
cd tripwise
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your API credentials (optional for initial preview due to resilient built-in fallbacks):
```dotenv
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Geoapify (Places API)
GEOAPIFY_API_KEY=your_geoapify_server_key
VITE_GEOAPIFY_API_KEY=your_geoapify_client_key_optional
```

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

## 🗄️ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`supabase/migrations/20261018_initial_schema.sql`](./supabase/migrations/20261018_initial_schema.sql).
4. The migration automatically:
   - Sets up `profiles`, `trips`, `trip_stops`, and `favorites` tables.
   - Applies primary keys, foreign keys, cascade deletes, and check constraints (`end_date >= start_date`, `day_number > 0`).
   - Enforces **Row Level Security (RLS)** policies so each authenticated user only accesses their private itineraries.

---

## 🚀 Deployment to Vercel

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com/):
   - Import the repository.
   - Framework preset: **Vite**.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
3. Under **Project Settings > Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEOAPIFY_API_KEY`
4. Deploy! The included `vercel.json` ensures all nested SPA routes (`/trips/:id`, `/places/:id`) resolve smoothly without 404s.

---

## 📋 Definition of Done Checklist

- [x] Real external places discovery with geocoding & categories
- [x] Search, category filtering, and list/map toggle
- [x] Destination details with interactive Leaflet map
- [x] Real-time Open-Meteo weather with precipitation hints
- [x] Add, view, reorder, and remove itinerary stops
- [x] Day-wise trip organizer with budget calculations
- [x] Supabase Postgres schema migration with RLS
- [x] Resilient graceful degradation for loading, empty, and offline states
- [x] Responsive editorial Neo-Brutalist design across all screen sizes
- [x] Automated unit test suite passing with Vitest
- [x] Clean production build with zero errors
- [x] Zero secrets in git history

---

## ⚖️ Attribution & Licensing

- Place data provided via **Geoapify Places API** & **OpenStreetMap Contributors**.
- Weather forecast data provided via **Open-Meteo** (under CC BY 4.0).
- Map tiles provided via **© OpenStreetMap contributors**.
