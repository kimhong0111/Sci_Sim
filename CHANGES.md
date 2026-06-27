# Frontend Refactoring Change Log

**Branch:** `feature/frontend-ui`  
**Base commit:** `b1dc062` — *Merge pull request #4: add new component (simulationCanvas, SimView)*  
**Date:** 2026-06-26  
**Build status:** ✅ `vite build` passes — 0 errors

---

## Summary

Refactored the React frontend from a flat, minimal component structure into a modular, layered component system following the `refactoring-prompt.md` architecture. All state is owned by the new `SimulationHub` page. The real backend API (`/api/simulations`) is used directly with no mock data. No backend code was touched.

---

## ✅ Build Validation

```
vite v5.4.21 building for development...
✓ 453 modules transformed.
dist/assets/index.css   20.54 kB │ gzip: 3.99 kB
dist/assets/index.js  1,349 kB   │ gzip: 402 kB
✓ built in 3.62s
```

> [!NOTE]
> The large JS bundle size is expected — it includes p5.js (~1MB). No action needed for development.

---

## 🗂️ File Changes

### New Files (Untracked)

#### `src/components/ui/` — 6 atomic UI components

| File | Purpose |
|---|---|
| `Button.jsx` | Primary / secondary button with variant prop |
| `Badge.jsx` | Category and tag label variants |
| `Tag.jsx` | Small bordered label |
| `FilterChip.jsx` | Active/inactive pill chip for filter bar |
| `IconButton.jsx` | Material Symbols icon-only button |
| `ParameterBox.jsx` | Label + value info box (kept, unused in current UI) |

#### `src/components/features/` — 6 feature components

| File | Purpose |
|---|---|
| `FilterBar.jsx` | ALL / PHYSICS / CHEMISTRY / BIOLOGY filter row |
| `NavDropdown.jsx` | Hover-triggered dropdown nav menu |
| `NavDropdownItem.jsx` | Individual item inside a NavDropdown |
| `SimulationCard.jsx` | Card tile — reads `subject_id`, `Subject.name`, `Topic.name` from real API |
| `DetailImage.jsx` | Left panel of detail overlay with back button |
| `DetailPanel.jsx` | Right panel — lesson-style info (subject, topic, description) |

#### `src/components/layout/` — 5 layout components

| File | Purpose |
|---|---|
| `Navigation.jsx` | Sticky top nav — logo, subject dropdowns, search bar |
| `Hero.jsx` | Full-width hero section with headline and CTA |
| `SimulationGrid.jsx` | FilterBar + responsive card grid + load more |
| `DetailOverlay.jsx` | Full-screen overlay — composes DetailImage + DetailPanel |
| `Footer.jsx` | Bottom footer bar |

#### `src/pages/SimulationHub.jsx` — New root page

Replaces `Home.jsx` at the `/` route. Owns all state:

```js
const [simulations, setSimulations]           // from useSimulations() hook
const [activeFilter, setActiveFilter]         // 'all' | 'physics' | 'chemistry' | 'biology'
const [activeSubFilter, setActiveSubFilter]   // Topic.name string | null
const [detailOpen, setDetailOpen]             // boolean
const [selectedSimulation, setSelectedSimulation]
```

Filtering maps `activeFilter` → `subject_id` (1=Physics, 2=Chemistry, 3=Biology) to match the real API schema. Sub-filter matches `sim.Topic?.name`.

---

### Modified Files

#### `apps/web/src/App.jsx`
- **Before:** Rendered `<Layout>` (with `<Nav>`) wrapping `<Home>` at `/`
- **After:** Renders `<SimulationHub>` directly at `/`. `SimView` at `/simulations/:id` is unchanged.

```diff
- import { Layout } from "./pages/Layout";
- import Home from "./pages/Home";
+ import SimulationHub from "./pages/SimulationHub";

- <Route path="/" element={<Layout />}>
-   <Route index element={<Home />} />
- </Route>
+ <Route path="/" element={<SimulationHub />} />
```

#### `apps/web/index.html`
- Updated `<title>` to `Nexus Lab — Science Simulation Hub`
- Added Google Material Symbols Outlined font for `IconButton`

#### `apps/web/src/index.css`
- All legacy styles preserved (`.page`, `.card`, `.grid`, `.params`, `.btn-danger`, `.error`) — used by `SimView`
- Added ~350 lines of new BEM-style component classes using Tailwind `@apply`:
  - `.navigation`, `.navigation__*`
  - `.nav-dropdown`, `.nav-dropdown__*`
  - `.hero`, `.hero__*`
  - `.badge`, `.badge--*`, `.tag`
  - `.btn`, `.btn--*`
  - `.filter-bar`, `.filter-bar__*`
  - `.filter-chip`, `.filter-chip--active`
  - `.simulation-grid`, `.simulation-grid__*`
  - `.simulation-card`, `.simulation-card__*`
  - `.detail-overlay`, `.detail-overlay__*`
  - `.detail-image`, `.detail-image__*`
  - `.detail-panel`, `.detail-panel__*`
  - `.lesson-card`, `.lesson-card__*`
  - `.lesson-meta`, `.lesson-meta__*`
  - `.footer`, `.footer__*`

---

### Kept Untouched ✅

| File | Reason |
|---|---|
| `apps/web/src/services/api.js` | Existing `simulationService` reused as-is |
| `apps/web/src/hooks/useSimulations.js` | Reused directly in `SimulationHub` |
| `apps/web/src/components/SimView.jsx` | Existing simulation runner page |
| `apps/web/src/components/SimulationCanvas.jsx` | p5.js canvas — untouched |
| `apps/web/src/main.jsx` | Entry point unchanged |
| `apps/api/**` | **No backend files modified** |

### Deleted — Unused Files 🗑️

| File | Reason |
|---|---|
| `apps/web/src/pages/Home.jsx` | Replaced by `SimulationHub.jsx` — no longer imported |
| `apps/web/src/pages/Nav.jsx` | Replaced by `Navigation.jsx` in layout — no longer imported |
| `apps/web/src/pages/Layout.jsx` | Replaced by `SimulationHub` owning its own layout — no longer imported |
| `apps/web/src/components/SimulationCard.jsx` | Old flat card replaced by `features/SimulationCard.jsx` — no longer imported |

---

## 🔄 Data Flow (Real API)

```
SimulationHub mounts
  → useSimulations() → simulationService.getAll() → GET /api/simulations
  → API returns: { id, subject_id, topic_id, title, description, Subject, Topic, Simulation_Config }

User clicks filter chip
  → activeFilter = 'physics'
  → filteredSimulations = simulations.filter(s => s.subject_id === 1)
  → SimulationGrid re-renders with filtered cards

User clicks SimulationCard
  → selectedSimulation set, detailOpen = true
  → DetailOverlay renders with DetailPanel showing lesson info

User clicks "Start Simulation"
  → navigate(`/simulations/${simulation.id}`)
  → Existing SimView + SimulationCanvas renders
```

---

## 🎨 UI Decisions

| Decision | Rationale |
|---|---|
| No `imageUrl` in cards | Backend has no image field — placeholder icon used |
| `subject_id → category` mapping in frontend | Avoids backend change; clean mapping in `SimulationHub` |
| Lesson-style DetailPanel | Replaced raw parameter JSON with structured Subject / Topic / Description |
| Settings & profile icons removed | Per user request — search bar spans full right nav section |
| Hero centered | `items-center text-center` with `py-20` padding |
| Brand name "Science Simulation" | Per user request |

---

## 📋 Phase Checklist Status

### Phase 1 — Structure ✅ Complete
- [x] All UI components (6 files)
- [x] All feature components (6 files)
- [x] All layout components (5 files)
- [x] `SimulationHub.jsx` page with full state management
- [x] Filter flow wired and working
- [x] Detail overlay open/close wired
- [x] Escape key closes overlay
- [x] Body scroll locked when overlay open
- [x] Real API used (no mock data)

### Phase 2 — Styling ✅ Complete
- [x] BEM class names on all components
- [x] Layout defined in `index.css` with `@apply`
- [x] Responsive mobile/tablet testing and styles
- [x] Typography refinement and JetBrains Mono integration
- [x] Alignment of desktop subject dropdowns (touching vertically flush, border-matching)
- [x] Search input box in the middle of navigation on mobile responsive layouts
- [x] Auto-suggestions search list dropdown with vertical/horizontal pixel-perfect alignment
- [x] Flex transition fallback interpolation fixes (`transform: translate(0, 0)` & `box-shadow`)

### Phase 3 — Polish ⏳ Pending
- [ ] p5.js SimulationCanvas integration into overlay
- [ ] Real topic data from API for nav dropdowns
- [ ] Loading skeleton states
- [ ] Error handling UI
- [ ] Toast notifications

---

## 🎨 Phase 2 Styling & Polish Details

| Component/Feature | Updates Applied |
|---|---|
| **Brutalist Card Hover** | Restored smooth stepped hover states (`0.1s steps(2)`) on `.simulation-card`, `.filter-chip`, and `.navigation__mobile-item` by declaring default base fallbacks for `transform` and `box-shadow`. |
| **Desktop Dropdowns** | Moved horizontal padding from the `.nav-dropdown` flex items to `.nav-dropdown__trigger` button, and removed `display: flex` from the dropdown containers. This removes browser flex item layout bugs, making the dropdowns vertically flush (`top: 100%`) and horizontally aligned. |
| **Responsive Mobile Nav** | Relocated the search bar into the middle of the navigation header on mobile responsive screens. The logo section is on the left, the search bar is in the middle, and the hamburger button is on the far-right in its own border box. |
| **Search Suggestions** | Wrapped the search input and suggestion list in a relative wrapper (`.navigation__search-wrapper`). This forces the suggestion dropdown list to align exactly under the search input border vertically, and automatically matches the width of the input (`left: -2px; right: -2px; width: auto;`) on both desktop and mobile. |
| **Clean Typography** | Subject labels and suggestion titles occupy 100% of the suggestion list on responsive screen sizes by hiding the category badge on screens smaller than 1024px, avoiding text truncation. |
