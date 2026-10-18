# TripWise --- Smart Travel Planner

## Full-Stack Build Specification, Product Roadmap & Vercel Deployment Guide

> **Project basis:** AWS Student Builder Group, VIT Chennai --- Web
> Development Recruitment Task, "TripWise: Smart Travel Planner".
>
> **Goal:** Build a genuinely functional, polished travel-planning web
> application from scratch. Preserve every mandatory requirement in the
> supplied task, then extend it with carefully scoped features inspired
> by mature travel products. The visual system must use neo-brutalism
> consistently across every screen.
>
> **Important:** This document is the implementation blueprint, not a
> claim that the application has already been coded, tested, or
> deployed.

------------------------------------------------------------------------

## 1. Product vision

TripWise helps a traveller discover places, understand the destination,
build a day-wise itinerary, estimate trip costs, check weather, and keep
the plan available when they return.

### Product principles

1.  **Useful before flashy:** every visual component must support a real
    user task.
2.  **One coherent trip workspace:** discovery, destination details, and
    itinerary should connect naturally.
3.  **Honest data:** label estimates and third-party data; do not invent
    opening hours, prices, reviews, or availability.
4.  **Responsive by design:** mobile is a first-class experience, not a
    shrunken desktop layout.
5.  **Safe by default:** never commit secret keys, and protect each
    user's saved trips.
6.  **Graceful degradation:** a weather or map API failure should not
    break discovery or itinerary editing.

### Target users

-   Students planning affordable weekend trips.
-   Friends coordinating a shared holiday.
-   Solo travellers collecting places before a trip.
-   Travellers who want a clear itinerary instead of juggling multiple
    tabs.

### Main user journey

1.  Open TripWise and enter a city, region, or landmark.
2.  Browse places and filter by category, distance, budget, or
    accessibility where the data supports it.
3.  Open a place to view its details, location, available information,
    and weather context.
4.  Add it to a trip and assign it to a day.
5.  Reorder stops, add notes, and estimate expenses.
6.  Save the trip, return later, and optionally share a read-only link.
7.  Review the plan on mobile and use external map directions when
    travelling.

------------------------------------------------------------------------

## 2. Scope: mandatory requirements versus enhancements

The supplied task makes the following capabilities mandatory for the
full-stack track:

-   Discover destinations using at least one real external API.
-   Search, filter, and sort results.
-   Display destination details.
-   Add, view, and remove itinerary items.
-   Persist itinerary data in a database.
-   Connect frontend and backend APIs.
-   Handle loading, empty, invalid, and failed-request states.
-   Provide a clear responsive user experience.
-   Submit a public GitHub repository, live deployment URL, README, and
    screenshots/PDF of major views and key states.

### Recommended delivery strategy

**Phase A --- Recruitment-task complete:** implement every mandatory
requirement end to end before building advanced features.

**Phase B --- Product polish:** add maps, weather, day-wise planning,
budget estimates, favorites, accessibility information, and a shareable
itinerary.

**Phase C --- Stretch features:** collaborative planning,
offline-friendly access, export, route optimization, and smart
recommendations. Only retain features that can be implemented and tested
properly.

Do not ship buttons that do nothing. Hide unfinished features or clearly
mark them as planned.

------------------------------------------------------------------------

## 3. Recommended technology stack

Choose a stack that is practical for a student project, works well on
Vercel, and can grow without unnecessary infrastructure.

  -----------------------------------------------------------------------
  Layer                   Recommended choice      Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React + TypeScript +    Component-based, typed
                          Vite                    UI

  Styling                 Tailwind CSS + custom   Fast styling with a
                          CSS variables           consistent
                                                  neo-brutalist design
                                                  system

  UI primitives           Accessible headless     Keyboard navigation and
                          components where needed semantics

  Icons                   Lucide React            Consistent interface
                                                  icons

  Routing                 React Router            Explore, destination,
                                                  trip, and settings
                                                  routes

  Server-state/data       TanStack Query or a     Loading, caching,
  fetching                small typed fetch layer retry, and invalidation

  Forms and validation    React Hook Form + Zod   Reliable form
                          (optional)              validation

  Backend                 Vercel Functions using  Server endpoints and
                          TypeScript              protected API calls

  Database                Supabase Postgres       Persistent trips and
                                                  itinerary stops

  Authentication          Supabase Auth           Optional account
                                                  sign-up/login and
                                                  per-user data

  Maps                    Leaflet + OpenStreetMap Place markers and map
                          tiles, or Geoapify map  view
                          tiles                   

  Weather                 Open-Meteo              Weather forecasts by
                                                  coordinates

  Testing                 Vitest + React Testing  Unit, component, and
                          Library + Playwright    browser-level tests

  Hosting                 Vercel                  Frontend and serverless
                                                  API deployment

  Version control         Git + public GitHub     Source history and
                          repository              submission
  -----------------------------------------------------------------------

### Why this stack?

-   React + Vite is a straightforward way to build a fast client-side
    application on Vercel.
-   Vercel Functions can host small API routes alongside the frontend.
-   Supabase supplies a managed Postgres database and authentication
    without needing to operate a server.
-   The app can start as a single deployable repository rather than
    multiple services.
-   TypeScript makes API response handling and itinerary models easier
    to maintain.

**Deployment note:** this is a Vite SPA with Vercel serverless
functions, not a traditional always-running Express server. Put function
endpoints in the Vercel-supported `api/` directory and verify the
current Vercel runtime conventions when implementing them. If the
project later needs long-running jobs or persistent WebSockets, use a
suitable separate service rather than assuming a serverless function
remains alive.

------------------------------------------------------------------------

## 4. API providers: official links and free access

Use one primary places provider first. Add the other integrations only
after the basic flow works.

### API 1 --- Geoapify Places API (recommended primary provider)

-   **Website:** https://www.geoapify.com/
-   **Documentation:** https://apidocs.geoapify.com/docs/places/
-   **Dashboard / key creation:** https://myprojects.geoapify.com/
-   **Useful for:** nearby points of interest, place categories,
    location-based searches, and geocoding.
-   **Free access:** Geoapify documents a free plan with a daily credit
    allowance; the Places API documentation currently describes 3,000
    credits/day for the free plan. Credits depend on the request and
    result count, so check current limits before deployment.
-   **Key needed:** yes.
-   **Implementation:** use `GET https://api.geoapify.com/v2/places`
    with the required category/filter/bias parameters and `apiKey`.
-   **Attribution:** show required Geoapify/data-source attribution
    wherever its data or maps are used.

Recommended use cases: - Search for restaurants, attractions, museums,
parks, and other supported categories. - Search near coordinates or
within a geographic area. - Geocode a typed city/address into
coordinates when required.

### API 2 --- OpenTripMap (alternative or supplementary travel POI source)

-   **Website:** https://opentripmap.io/
-   **API documentation:** https://opentripmap.io/product
-   **API registration/key access:** https://opentripmap.io/
-   **Useful for:** tourist attractions, interesting places, and
    travel-oriented points of interest.
-   **Key needed:** yes for API use.
-   **Free access:** check the current plan, quotas, attribution, and
    permitted use shown during registration and in the current
    documentation; do not assume an old quota still applies.
-   **Implementation:** use its documented places endpoints for
    radius/list/details and request only fields the endpoint supports.

Use OpenTripMap if its tourism-oriented data better suits the desired
destination discovery experience. Avoid making two overlapping providers
mandatory on day one: choose one provider as the source of truth and
build a small adapter layer so another can be added later.

### API 3 --- Open-Meteo Weather API

-   **Website:** https://open-meteo.com/
-   **Forecast documentation:** https://open-meteo.com/en/docs
-   **Useful for:** forecast summaries, temperature, precipitation
    probability, wind, and weather-aware trip hints.
-   **Key needed:** no key for normal non-commercial use under the
    published free terms.
-   **Free access:** Open-Meteo currently documents free non-commercial
    usage subject to its limits and attribution requirements. Check
    current terms if the deployment's use becomes commercial or usage
    grows.
-   **Example endpoint:** `https://api.open-meteo.com/v1/forecast`
-   **Typical inputs:** latitude, longitude, `daily`, `hourly`,
    `timezone`, and requested weather variables.

Weather should be displayed as context, not as a guarantee. Forecast
availability and accuracy depend on location and date.

### Optional fourth provider --- OpenStreetMap

-   **Website:** https://www.openstreetmap.org/
-   **Tile usage policy:**
    https://operations.osmfoundation.org/policies/tiles/
-   **Useful for:** map display through Leaflet.
-   **Key needed:** not for the standard public tile endpoint, but
    public tile servers have usage policies and are not an unlimited
    production CDN.
-   **Important:** keep visible map attribution. For substantial
    production traffic, select a tile provider whose terms and capacity
    fit your usage.

### Optional geocoding alternative --- Nominatim

-   **Documentation / usage policy:**
    https://nominatim.org/release-docs/latest/api/Overview/
-   Public Nominatim has strict usage requirements and rate limits. Do
    not send autocomplete requests on every keystroke to the public
    service. For production-style autocomplete, use a provider designed
    for that purpose or host an appropriate service.

### Key and quota policy

-   Never commit real API keys in GitHub.
-   Add `.env` to `.gitignore`.
-   Create `.env.example` with placeholder values only.
-   Restrict browser-exposed provider keys by allowed origins/referrers
    if the provider supports it.
-   Place secret provider keys in Vercel environment variables and call
    those APIs through server functions when the key must remain
    private.
-   A variable prefixed with `VITE_` is bundled into browser code and is
    **not a secret**. Only expose a browser key when the provider
    expects a public client key and it is properly restricted.
-   Check current provider terms, attribution rules, free quotas, and
    caching rules before launch.
-   Implement debouncing, result limits, and a short-lived cache to
    avoid wasting quota.
-   Return friendly errors for quota exhaustion or upstream outages.

**Practical starting combination:** Geoapify for places + Open-Meteo for
weather. Keep OpenTripMap as an alternative data provider or a later
enhancement. The task requires at least one real API, not three keys.

------------------------------------------------------------------------

## 5. Product features

### 5.1 Mandatory core features

#### A. Destination discovery

-   Search places by city/area and category.
-   Display cards with name, category, locality/address when available,
    and coordinates when available.
-   Use real API data; do not silently substitute hard-coded mock places
    in production.
-   Provide a "Load more" or pagination pattern only if supported by the
    provider.
-   Show data-source attribution where required.

#### B. Search, filtering, and sorting

-   Search by text or destination.
-   Filter by supported categories such as attractions, food, museums,
    parks, or accommodation.
-   Sort by relevance or distance when the necessary data exists.
-   Include a clear-all control and visible active-filter chips.
-   Do not offer filters that the source data cannot actually support.

#### C. Destination details

-   Show name, category, address, map location, and external source
    details where available.
-   Show weather only when coordinates and a valid forecast response
    exist.
-   Provide "Add to trip" and "Open directions" actions.
-   Clearly indicate when details are unavailable rather than inventing
    them.

#### D. Itinerary management

-   Add and remove places.
-   Prevent accidental duplicate stops or ask whether the user wants to
    add another visit.
-   Assign stops to trip days.
-   Reorder stops with accessible move-up/move-down controls;
    drag-and-drop can be an enhancement.
-   Add a personal note to a stop.
-   Show an empty state with a useful path back to discovery.

#### E. Persistence

-   Full-stack track: save trip and stop records to Supabase Postgres.
-   Authenticated users can access only their own private trips unless a
    trip has deliberately been shared.
-   Keep UI state in sync after adding/removing/reordering stops.
-   Do not treat browser local storage as the only persistence layer for
    the full-stack track.

#### F. Reliability and accessibility

-   Loading skeletons or a clear loading indicator.
-   Empty search results with a reset suggestion.
-   API error state with retry.
-   Form validation and useful inline messages.
-   Keyboard access, visible focus, accessible labels, and semantic
    buttons/links.
-   Responsive layouts for narrow phones, tablets, and desktop.

### 5.2 High-value product enhancements

Build these only after the core is stable.

1.  **Day-wise trip builder:** multiple trip days, dates, and stops per
    day.
2.  **Budget estimator:** user-entered estimated cost per stop,
    transport, food, and miscellaneous expenses; total per day and trip.
3.  **Weather-aware hints:** suggest carrying rain gear or reviewing
    outdoor activities when the forecast indicates rain. Present this as
    a hint, not an automatic itinerary change.
4.  **Map/list toggle:** show discoverable places on a map and in a
    synchronized list.
5.  **Favorites / shortlist:** save places separately from a confirmed
    itinerary.
6.  **Trip notes:** destination-level and whole-trip notes.
7.  **Shareable read-only trip:** generate a random, revocable public
    token; never expose private database IDs as the only access control.
8.  **Export / print:** printable itinerary and downloadable CSV or
    print-friendly page. Add PDF generation only if it can be
    implemented and tested reliably.
9.  **External directions:** link to a supported map/directions URL
    rather than pretending the app itself provides live navigation.
10. **Accessible travel filters:** expose wheelchair/accessibility
    attributes only when the provider supplies trustworthy data; unknown
    must not be shown as "accessible".
11. **Trip status:** planning, upcoming, completed.
12. **Recently viewed places:** optionally stored locally, with a clear
    option to clear history.
13. **Responsive installability:** optional PWA manifest and offline
    shell. Clearly label stale cached information.
14. **Internationalization:** prepare text and date/currency formatting
    for later language support.
15. **Privacy controls:** delete a trip, revoke a share link, sign out,
    and delete an account where the authentication setup supports it.

### 5.3 Advanced stretch ideas

-   Collaborative trip editing with invitations and permissions.
-   Travel-time and route-order optimization using a provider with
    explicit routing terms.
-   Smart recommendations based on user-selected interests and trip
    constraints.
-   Import places from a supported URL or a CSV file.
-   A "rainy day alternatives" section based on categories and available
    data.
-   Budget breakdown charts.
-   Trip templates such as "one-day city walk" or "museum weekend".
-   Feedback/report-data issue action for incorrect place information.

**Do not make AI recommendations the foundation of the app.** A useful,
fast, dependable planner with clear data and a working itinerary is
stronger than a large collection of fragile demos.

------------------------------------------------------------------------

## 6. Neo-brutalist design system

### Visual direction

The interface should feel like a bold editorial travel journal: thick
outlines, high contrast, punchy color blocks, expressive type, tactile
buttons, and slightly playful card layouts. Apply the same system to
every route, modal, form, dropdown, empty state, and mobile view.

### Suggested palette

  -----------------------------------------------------------------------
  Token                   Suggested value         Usage
  ----------------------- ----------------------- -----------------------
  Ink                     `#171717`               Text, borders, icons

  Paper                   `#FFFDF5`               Main page background

  Electric lime           `#D8FF3E`               Primary accent and
                                                  active states

  Hot coral               `#FF6B5E`               Secondary accent and
                                                  alerts

  Sky blue                `#76D7FF`               Informational blocks

  Lavender                `#C8B6FF`               Decorative or secondary
                                                  cards

  White                   `#FFFFFF`               Card surfaces

  Muted                   `#686868`               Secondary text, only
                                                  where contrast remains
                                                  accessible
  -----------------------------------------------------------------------

These are starting tokens; validate text contrast before finalizing.

### Design rules

-   Use 2--3 px near-black borders on important components.
-   Use hard offset shadows, for example `4px 4px 0 #171717`; avoid soft
    blurred shadows as the default.
-   Use rounded corners sparingly and consistently; small radii fit the
    style better than pill-shaped everything.
-   Use a strong display font for headings and a legible sans-serif for
    body text.
-   Use large, clear page titles and compact uppercase labels for
    metadata.
-   Use strong filled buttons with visible pressed states.
-   Give cards clear hover/focus behavior without making content jump
    unpredictably.
-   Reserve accent colors for hierarchy; do not make every element
    compete.
-   Use real destination images only where licensing and source
    attribution permit. Provide stable fallbacks if an image is missing.
-   Respect `prefers-reduced-motion`.
-   Use the same spacing, border, shadow, typography, and focus tokens
    across all pages.

### Example CSS tokens

``` css
:root {
  --color-ink: #171717;
  --color-paper: #fffdf5;
  --color-lime: #d8ff3e;
  --color-coral: #ff6b5e;
  --color-sky: #76d7ff;
  --color-lavender: #c8b6ff;
  --border-strong: 2px solid var(--color-ink);
  --shadow-hard: 4px 4px 0 var(--color-ink);
  --shadow-hard-small: 3px 3px 0 var(--color-ink);
  --radius-card: 10px;
  --radius-control: 7px;
}

body {
  color: var(--color-ink);
  background: var(--color-paper);
}

.neo-card {
  border: var(--border-strong);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-hard);
  background: #fff;
}

.neo-button {
  border: var(--border-strong);
  border-radius: var(--radius-control);
  box-shadow: var(--shadow-hard-small);
  font-weight: 800;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.neo-button:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 var(--color-ink);
}

:focus-visible {
  outline: 3px solid var(--color-sky);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### UI behavior requirements

-   Every button has a real action or is visibly disabled with a reason.
-   Loading states preserve layout to reduce visual shifts.
-   Modals trap focus, close predictably, and restore focus to the
    opener.
-   Toasts announce success/failure accessibly and do not replace inline
    validation.
-   On mobile, filters should open in a drawer/sheet with clear
    apply/reset controls.
-   Do not rely on color alone to communicate status.

------------------------------------------------------------------------

## 7. Pages and navigation

Use a small, coherent information architecture.

### `/` --- Explore

-   Top navigation with TripWise logo, Explore, My Trips, Favorites, and
    account controls.
-   Hero section with a bold title such as "Your next story starts
    here."
-   Search input for a destination or area.
-   Category chips and filters.
-   Results count and sort control.
-   Responsive place-card grid.
-   Optional map/list toggle.
-   Loading, error, empty, and no-location states.

### `/places/:placeId` --- Destination details

-   Place name and category.
-   Available address and location.
-   Map or coordinate view.
-   Weather widget when supported.
-   Data source and attribution.
-   Add-to-trip selector.
-   External directions link.
-   Graceful missing-data state.

### `/trips` --- My Trips

-   Saved trips and their dates/status.
-   Create-trip action.
-   Empty state with an Explore link.
-   Loading, error, and retry states.

### `/trips/:tripId` --- Trip workspace

-   Trip name, destination, dates, and notes.
-   Day tabs or day sections.
-   Stops with reorder/remove/edit actions.
-   Budget summary.
-   Map/list view of itinerary stops.
-   Share, print, or export actions only when implemented.
-   Clear confirmation before destructive deletion.

### `/favorites` --- Saved places

-   Favorite place cards.
-   Remove favorite and add to trip actions.
-   Empty state.

### `/settings` --- Account and preferences (if auth is implemented)

-   Profile and sign-out.
-   Preferred currency.
-   Units and display preferences.
-   Privacy and data deletion actions where supported.

### Global UI states

-   Offline/network issue banner where useful.
-   Toast notification region.
-   Not-found route.
-   Error boundary for unexpected UI failures.
-   Consistent navigation and focus handling.

------------------------------------------------------------------------

## 8. Data model

A practical initial database schema:

### `profiles`

-   `id` UUID, primary key, references the authenticated user.
-   `display_name` text, nullable.
-   `created_at` timestamp.

### `trips`

-   `id` UUID, primary key.
-   `user_id` UUID, owner.
-   `title` text, required.
-   `destination_label` text, nullable.
-   `start_date` date, nullable.
-   `end_date` date, nullable.
-   `currency` text, default such as `INR`.
-   `notes` text, nullable.
-   `status` text, constrained to supported values.
-   `share_token_hash` text, nullable if sharing is implemented.
-   `created_at`, `updated_at` timestamps.

### `trip_stops`

-   `id` UUID, primary key.
-   `trip_id` UUID, references `trips`.
-   `provider` text, e.g. `geoapify` or `opentripmap`.
-   `provider_place_id` text, nullable if unavailable.
-   `name` text, required.
-   `category` text, nullable.
-   `address` text, nullable.
-   `latitude`, `longitude` numeric, nullable.
-   `day_number` integer, positive.
-   `sort_order` integer, non-negative.
-   `estimated_cost` numeric, nullable.
-   `notes` text, nullable.
-   `created_at` timestamp.

### `favorites`

-   `id` UUID, primary key.
-   `user_id` UUID.
-   `provider` text.
-   `provider_place_id` text, nullable.
-   `place_snapshot` JSONB with only the fields needed to re-render the
    favorite.
-   `created_at` timestamp.
-   Add a uniqueness constraint appropriate to the chosen provider ID
    strategy.

### Database rules

-   Use foreign keys and indexes for `user_id`, `trip_id`, and
    list-order fields.
-   Validate `end_date >= start_date` when both dates are supplied.
-   Validate latitude and longitude ranges.
-   Validate positive day numbers and non-negative sort order/cost.
-   Add timestamps consistently.
-   Do not store full upstream API responses when a small normalized
    snapshot is enough.
-   Store provider attribution/source information where useful.
-   Use Supabase Row Level Security (RLS) policies so authenticated
    users can read/write only their own records.
-   If public sharing is implemented, expose a deliberately limited
    read-only view through a secure server endpoint. Do not disable RLS
    to make sharing easier.

A database migration should create tables, constraints, indexes, and RLS
policies. Keep it in the repository so the schema is reproducible.

------------------------------------------------------------------------

## 9. Backend API design

Use consistent JSON responses, input validation, status codes, and safe
error messages. Do not return raw provider keys or sensitive server
details.

Suggested routes:

  ------------------------------------------------------------------------------------
  Method                  Route                                Purpose
  ----------------------- ------------------------------------ -----------------------
  `GET`                   `/api/health`                        Simple deployment
                                                               health check

  `GET`                   `/api/places`                        Search upstream places
                                                               using validated query
                                                               parameters

  `GET`                   `/api/places/:id`                    Retrieve supported
                                                               place details

  `GET`                   `/api/weather`                       Get forecast for
                                                               validated coordinates

  `GET`                   `/api/trips`                         List the current user's
                                                               trips

  `POST`                  `/api/trips`                         Create a trip

  `GET`                   `/api/trips/:tripId`                 Read one authorized
                                                               trip and its stops

  `PATCH`                 `/api/trips/:tripId`                 Update trip metadata

  `DELETE`                `/api/trips/:tripId`                 Delete a trip after
                                                               authorization

  `POST`                  `/api/trips/:tripId/stops`           Add a stop

  `PATCH`                 `/api/trips/:tripId/stops/:stopId`   Edit
                                                               notes/day/cost/order

  `DELETE`                `/api/trips/:tripId/stops/:stopId`   Remove a stop

  `GET`                   `/api/favorites`                     List favorites

  `POST`                  `/api/favorites`                     Add favorite

  `DELETE`                `/api/favorites/:favoriteId`         Remove favorite
  ------------------------------------------------------------------------------------

Implement only the routes needed by the actual UI, but keep the
conventions consistent.

### Example place-search request

``` http
GET /api/places?text=Chennai&category=tourism&limit=20
```

Example response shape (illustrative, not a promise of any provider's
exact response):

``` json
{
  "data": [
    {
      "id": "provider-place-id",
      "provider": "geoapify",
      "name": "Example place",
      "category": "tourism",
      "address": "Example address",
      "latitude": 13.08,
      "longitude": 80.27
    }
  ],
  "meta": {
    "count": 1,
    "source": "geoapify"
  }
}
```

### Error response shape

``` json
{
  "error": {
    "code": "UPSTREAM_UNAVAILABLE",
    "message": "Places could not be loaded right now. Please try again."
  }
}
```

### API implementation requirements

-   Validate query parameters and request bodies with Zod or an
    equivalent schema.
-   Enforce maximum search lengths, result limits, and valid
    coordinates.
-   Return `400` for invalid input, `401` for missing authentication,
    `403` for unauthorized access, `404` for missing records, `429` for
    rate limits, and appropriate `5xx` codes for server/upstream
    failures.
-   Avoid revealing whether another user's private trip ID exists.
-   Apply authentication checks before database reads/writes.
-   Use request timeouts and bounded retries for transient upstream
    failures.
-   Do not retry every `4xx` response.
-   Normalize provider data in one adapter module so UI components do
    not depend on provider-specific field names.
-   Add basic rate limiting or other abuse protection for costly public
    endpoints.
-   Keep logs useful but do not log passwords, auth tokens, or API keys.

------------------------------------------------------------------------

## 10. Repository and folder structure

Suggested structure:

``` text
tripwise/
├── api/
│   ├── health.ts
│   ├── places/
│   │   ├── index.ts
│   │   └── [id].ts
│   ├── weather.ts
│   ├── trips/
│   │   ├── index.ts
│   │   └── [tripId]/
│   │       ├── index.ts
│   │       └── stops.ts
│   └── favorites.ts
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── places/
│   │   ├── trips/
│   │   └── feedback/
│   ├── pages/
│   │   ├── ExplorePage.tsx
│   │   ├── PlaceDetailsPage.tsx
│   │   ├── TripsPage.tsx
│   │   ├── TripDetailsPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── supabase.ts
│   │   ├── schemas.ts
│   │   └── formatters.ts
│   ├── services/
│   │   ├── places.ts
│   │   ├── weather.ts
│   │   ├── trips.ts
│   │   └── favorites.ts
│   ├── types/
│   ├── styles/
│   │   ├── tokens.css
│   │   └── globals.css
│   └── main.tsx
├── supabase/
│   └── migrations/
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── README.md
```

Adapt the file names to the actual Vercel function conventions and
framework setup you choose. Keep business logic in services, not inside
large page components.

------------------------------------------------------------------------

## 11. Environment configuration and security

Create `.env.example` with placeholders:

``` dotenv
# Client-side only when using a deliberately public/restricted key
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Server-side provider key; never prefix with VITE_
GEOAPIFY_API_KEY=

# Server-side Supabase service role key, only if genuinely required
SUPABASE_SERVICE_ROLE_KEY=
```

If the chosen Supabase client architecture uses the publishable/anon key
with RLS, prefer that for normal user-scoped requests. **Never expose
the Supabase service-role key to the browser.** Do not add a secret
simply because it is listed above; only configure variables the code
actually uses.

### `.gitignore` essentials

``` gitignore
node_modules/
dist/
.env
.env.*
!.env.example
.vercel/
coverage/
playwright-report/
test-results/
```

Check your ignore rules if you intentionally use a different
environment-file naming pattern.

### Security checklist

-   Keep `.env` out of Git.
-   Use separate development and production credentials where practical.
-   Rotate a key immediately if it was accidentally committed.
-   Restrict browser keys by origin/referrer when supported.
-   Enforce RLS and test it with two different users.
-   Validate every server request; client-side validation alone is not
    security.
-   Do not trust a `user_id` sent by the browser. Derive the user from
    the verified session.
-   Protect share links with high-entropy random tokens; store a hash
    when practical, support revocation, and expose read-only fields
    only.
-   Add reasonable request limits and handle upstream quota failures.
-   Review dependency updates and avoid unnecessary packages.

------------------------------------------------------------------------

## 12. Build from scratch: implementation phases

### Phase 0 --- Prepare the project

1.  Install a current supported Node.js LTS version.
2.  Create a React + TypeScript + Vite project.
3.  Initialize Git and create a public GitHub repository.
4.  Add the basic routes and the global neo-brutalist tokens.
5.  Add `.gitignore` and `.env.example` before adding any keys.
6.  Create the Vercel project only after the local skeleton builds
    successfully.

Example commands:

``` bash
npm create vite@latest tripwise -- --template react-ts
cd tripwise
npm install
npm install react-router-dom @supabase/supabase-js lucide-react
npm install @tanstack/react-query zod
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm run dev
```

Install Tailwind CSS according to the current official guide for the
selected Vite/Tailwind versions; the setup instructions can differ
between major versions. Add Leaflet and its type definitions only when
implementing the map.

**Exit criteria:** the app starts locally, routes render,
TypeScript/build checks pass, and the base theme works on mobile and
desktop.

### Phase 1 --- Build the interface shell

Implement: - Header/navigation. - Explore hero and search bar. - Filter
panel/chips. - Responsive place-card grid. - Reusable buttons, inputs,
cards, badges, skeletons, toast region, and empty/error states. -
Not-found page.

Use temporary local fixtures only while laying out the UI. Clearly
separate them from the real API service and remove them as the
production data source before acceptance testing.

**Exit criteria:** no broken navigation, consistent visual system,
keyboard focus visible, and layouts work at narrow widths.

### Phase 2 --- Connect real place data

1.  Register with Geoapify or OpenTripMap.
2.  Create a development key and configure it locally.
3.  Implement a server endpoint or an explicitly safe
    restricted-browser-key flow.
4.  Normalize the provider response into a stable internal `Place` type.
5.  Add search, category filtering, and supported sorting.
6.  Add debouncing, result limits, request cancellation where
    appropriate, and error states.
7.  Add source attribution.

**Exit criteria:** searches return live provider data; filters change
results; invalid queries are handled; loading, no-result,
network-failure, and quota-failure states work.

### Phase 3 --- Destination details and weather

1.  Implement the details route.
2.  Show available fields and clear fallbacks.
3.  Add a map or location panel using coordinates.
4.  Request weather from Open-Meteo only when coordinates are valid.
5.  Display the forecast timestamp/timezone and appropriate units.
6.  Handle missing coordinates and weather API failure without breaking
    the rest of the page.

**Exit criteria:** a result can be opened, its available information is
shown accurately, and weather/map failure is isolated.

### Phase 4 --- Database and authentication

1.  Create a Supabase project.
2.  Apply migrations for profiles, trips, stops, and favorites as
    needed.
3.  Enable RLS before storing user data.
4.  Add sign-up/sign-in if accounts are part of the chosen scope.
5.  Verify user identity in protected server routes or use Supabase's
    secure user-scoped client pattern.
6.  Test access with two accounts.
7.  Add clear sign-out and unauthorized states.

For a full-stack submission, database persistence is required by the
task. Browser storage alone is not sufficient.

**Exit criteria:** trip records survive refresh and a new session; a
user cannot read or edit another user's private trips.

### Phase 5 --- Complete the itinerary

1.  Create a trip.
2.  Add a place to a trip and day.
3.  View all stops for the trip.
4.  Remove a stop with appropriate feedback.
5.  Reorder stops and persist the new order.
6.  Edit day, notes, and estimated cost if those features are enabled.
7.  Calculate totals from saved estimates.
8.  Add delete-trip confirmation and an empty-trip state.

**Exit criteria:** every itinerary action persists in the database and
the UI updates consistently after success/failure.

### Phase 6 --- Add polish and one or two differentiators

Recommended order: 1. Favorites. 2. Day-wise planner and budget summary.
3. Map/list toggle. 4. Weather-aware hints. 5. Print/share/export if
time allows.

Do not attempt every stretch feature before the required journey is
reliable.

**Exit criteria:** each added feature has a real end-to-end workflow,
validation, and failure state.

### Phase 7 --- Test and prepare the submission

1.  Run lint, type-check, unit tests, and production build.
2.  Test mobile, tablet, and desktop breakpoints.
3.  Test keyboard-only navigation and visible focus.
4.  Test no results, failed requests, expired session, invalid input,
    and unauthorized record access.
5.  Verify a clean install from the repository.
6.  Capture required screenshots and assemble the PDF.
7.  Complete the README and submission links.

**Exit criteria:** another person can clone the repository, follow the
README, configure environment variables, and run the project without
undocumented steps.

------------------------------------------------------------------------

## 13. Deploy to Vercel

### A. Prepare the repository

``` bash
npm run build
git add .
git commit -m "Build TripWise travel planner"
git push origin main
```

Confirm that no `.env` file, secret key, or service-role credential is
tracked:

``` bash
git status
git ls-files
```

If a secret was ever committed, deleting it from the latest commit is
not enough; rotate the exposed credential.

### B. Create the Vercel deployment

1.  Open https://vercel.com/ and sign in.
2.  Import the public GitHub repository.
3.  Select the Vite framework preset if it is not detected
    automatically.
4.  Confirm the build command is `npm run build` and output directory is
    `dist` for the standard Vite setup.
5.  Add only the environment variables the app uses under Project
    Settings → Environment Variables.
6.  Deploy a preview and test it before relying on the production URL.
7.  Promote/deploy the production branch when the preview passes.

Official Vercel references: - Vite deployment:
https://vercel.com/docs/frameworks/frontend/vite - Environment
variables: https://vercel.com/docs/environment-variables - Deployment
environments: https://vercel.com/docs/deployments/environments

### C. SPA routing

If refreshing a nested route such as `/trips/abc` returns a 404,
configure a Vercel rewrite for the client-side SPA while ensuring API
routes are not rewritten to `index.html`. Verify the exact routing
configuration against the current Vercel docs and the actual function
layout before deploying.

A minimal SPA fallback may look like this in `vercel.json` for a
conventional Vite SPA with Vercel functions:

``` json
{
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/"
    }
  ]
}
```

Check that this pattern is accepted by the current Vercel routing system
and does not shadow API/function routes in your final project. Do not
blindly add it if the framework configuration already handles SPA
routes.

### D. Configure the production domain and variables

-   Add production API keys in Vercel, not in source code.
-   Restrict provider keys to the deployed domain if supported.
-   Keep development and production values separate where possible.
-   Redeploy after changing environment variables; changes do not update
    an already-built deployment retroactively.
-   Test the live site on a fresh browser session.
-   Check the browser console and Vercel function logs for errors.
-   Confirm API requests use HTTPS and no secret is visible in client
    bundles.

### E. Deployment acceptance checklist

-   [ ] Homepage loads over HTTPS.
-   [ ] Nested routes work when opened directly and refreshed.
-   [ ] Place search works on the deployed site.
-   [ ] Provider attribution is visible.
-   [ ] Destination detail route works.
-   [ ] Weather displays for valid coordinates and fails gracefully
    otherwise.
-   [ ] Auth works if implemented.
-   [ ] Trips persist in the database.
-   [ ] Private trips are inaccessible to other users.
-   [ ] Add/remove/reorder actions work.
-   [ ] Mobile navigation and cards work.
-   [ ] Environment variables exist in the correct Vercel environments.
-   [ ] No secret key is present in Git history or browser bundles.
-   [ ] README contains the live URL and setup instructions.

------------------------------------------------------------------------

## 14. Testing strategy

### Unit tests

-   Place response normalization.
-   Query validation.
-   Currency and date formatting.
-   Budget total calculation.
-   Itinerary sorting/reordering logic.
-   Error-response normalization.

### Component tests

-   Search input and submit.
-   Filters and clear-all.
-   Loading skeletons.
-   Empty result state.
-   Place card actions.
-   Add/remove stop interactions.
-   Form validation and confirmation dialog.

### Integration tests

-   Place endpoint returns normalized results.
-   Weather endpoint rejects invalid coordinates.
-   Trip creation and stop insertion persist.
-   Unauthorized requests are rejected.
-   RLS prevents cross-user access.

### Browser / end-to-end tests

-   Discover → open details → add to trip → refresh → see the saved
    stop.
-   Create trip → add two stops → reorder → refresh → order remains
    correct.
-   Search with no matches → reset filters → results return.
-   Simulate an upstream failure → error message and retry appear.
-   Test a small mobile viewport.
-   Open a nested URL directly.

Use mocked provider responses in automated tests to make them
deterministic. Also manually smoke-test real API integrations with your
development keys.

------------------------------------------------------------------------

## 15. Performance, resilience, and product quality

-   Debounce search input to reduce request volume.
-   Cancel stale in-flight searches where possible.
-   Limit result counts and avoid loading every detail eagerly.
-   Cache safe, non-personal search responses briefly where allowed by
    provider terms.
-   Lazy-load destination images and map code.
-   Keep image dimensions reserved to prevent layout shifts.
-   Provide image fallbacks and alt text.
-   Retry transient network failures sparingly.
-   Avoid retry loops for invalid API keys, bad requests, or exhausted
    quotas.
-   Keep itinerary interactions responsive and provide clear save
    status.
-   Do not cache private user trip data in shared server caches.
-   Respect provider caching/attribution policies.
-   Monitor Vercel function failures and provider usage dashboards.
-   Use a friendly fallback if a provider is temporarily unavailable.

------------------------------------------------------------------------

## 16. Accessibility checklist

-   [ ] Semantic page headings in logical order.
-   [ ] All inputs have labels.
-   [ ] Buttons and links have clear accessible names.
-   [ ] All workflows are possible with a keyboard.
-   [ ] Focus indicators are visible against all theme colors.
-   [ ] Dialog focus is managed correctly.
-   [ ] Status updates are announced to screen readers where
    appropriate.
-   [ ] Text contrast is checked.
-   [ ] Images have useful alt text or empty alt text when decorative.
-   [ ] Map functionality has an equivalent list view.
-   [ ] Color is not the only indicator of error/success.
-   [ ] Reduced-motion preferences are respected.
-   [ ] Touch targets are comfortably usable on mobile.

------------------------------------------------------------------------

## 17. Submission deliverables

The supplied task asks for a public GitHub repository, a live deployment
link, a README, and a PDF containing screenshots of the major views and
key states.

Prepare:

1.  **Public GitHub repository** with source code and migration files.
2.  **Live Vercel URL** that can be accessed without developer
    credentials.
3.  **README** with:
    -   project overview and chosen track;
    -   features implemented;
    -   technology stack;
    -   API providers and attribution;
    -   local setup commands;
    -   environment-variable names, without actual secrets;
    -   database setup/migration steps;
    -   tests and build commands;
    -   deployment link;
    -   known limitations.
4.  **Screenshots/PDF** including:
    -   Explore page;
    -   destination details;
    -   My Trips with a populated itinerary;
    -   empty itinerary state;
    -   search/filter results;
    -   mobile Explore view;
    -   mobile trip view;
    -   map/weather view if implemented;
    -   backend/API testing and database evidence where useful.
5.  **Repository hygiene:** no committed secrets, no broken links, no
    unused placeholder controls.

Use the exact filename format requested by the task:
`<register no>_<Track>` (for example, `25BCE5040_fullstack` if that is
your selected track and the format is accepted by the organizer).
Confirm the required register number and exact track naming before
submission.

The task deadline shown in the supplied document is **18 October 2026**.
Confirm submission status and any organizer updates rather than assuming
the deadline has changed.

------------------------------------------------------------------------

## 18. Definition of done

TripWise is ready for submission when:

-   [ ] All mandatory full-stack features in the task work end to end.
-   [ ] At least one real external place API is connected.
-   [ ] Search, supported filters, and sorting change the actual
    results.
-   [ ] A user can inspect a place and add it to a trip.
-   [ ] Itinerary items can be viewed and removed.
-   [ ] Saved trips persist in the database across refresh/session
    changes.
-   [ ] Loading, empty, invalid, and network-failure states are handled.
-   [ ] The neo-brutalist visual language is consistent on all pages.
-   [ ] The website is responsive and keyboard-usable.
-   [ ] Database access is correctly protected.
-   [ ] No API secret is committed or exposed accidentally.
-   [ ] Tests and production build pass.
-   [ ] The deployed Vercel site has been smoke-tested.
-   [ ] README, screenshots/PDF, public repository, and live link are
    ready.

------------------------------------------------------------------------

## 19. Recommended priority if time is limited

**Build in this order:**

1.  Responsive neo-brutalist layout and navigation.
2.  Live place search with one provider.
3.  Filters and sorting.
4.  Destination detail view.
5.  Supabase schema and security.
6.  Create trip, add stop, list stops, remove stop.
7.  Persist itinerary changes and verify access control.
8.  Loading/error/empty states.
9.  Weather and map.
10. Budget, favorites, sharing, and export only if the core is already
    stable.
11. Test, deploy, document, capture screenshots.

A smaller, reliable product is stronger than a flashy product with
non-working controls.

------------------------------------------------------------------------

## 20. Official references

-   TripWise assignment source: supplied PDF, *Web Development
    Recruitment Task --- TripWise Smart Travel Planner*, AWS Student
    Builder Group, VIT Chennai.
-   Geoapify Places API: https://apidocs.geoapify.com/docs/places/
-   Geoapify dashboard: https://myprojects.geoapify.com/
-   Geoapify pricing: https://www.geoapify.com/pricing/
-   OpenTripMap: https://opentripmap.io/
-   OpenTripMap API/product page: https://opentripmap.io/product
-   Open-Meteo: https://open-meteo.com/
-   Open-Meteo forecast docs: https://open-meteo.com/en/docs
-   Supabase: https://supabase.com/
-   Supabase Auth docs: https://supabase.com/docs/guides/auth
-   Supabase billing/free plan:
    https://supabase.com/docs/guides/platform/billing-on-supabase
-   Vercel Vite docs: https://vercel.com/docs/frameworks/frontend/vite
-   Vercel environment variables:
    https://vercel.com/docs/environment-variables
-   Vercel deployment environments:
    https://vercel.com/docs/deployments/environments
-   OpenStreetMap: https://www.openstreetmap.org/
-   OpenStreetMap tile usage policy:
    https://operations.osmfoundation.org/policies/tiles/
-   Nominatim usage documentation:
    https://nominatim.org/release-docs/latest/api/Overview/

**Final note:** provider plans and limits can change. Verify API terms,
key setup, attribution, and usage quotas directly on the official pages
when implementing. Do not place real keys in this Markdown file or in a
public repository.
