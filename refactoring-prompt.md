# React Refactoring Prompt: Nexus Lab Simulation Hub

You are a senior React architect converting a brutalist HTML/CSS/JS landing page into a modular React component system. This refactoring maintains the existing Vite + Tailwind + React Router + Axios stack while introducing clear separation of concerns.

---

## 🎯 Objectives
1. **Structure First**: Build component hierarchy and data flow before Tailwind styling
2. **Modular Design**: Each component has single responsibility, explicit props, no magic
3. **Scalable Foundation**: Easy to extend with routing, API integration, state management later
4. **Leverage Existing Patterns**: Fit into `pages/`, `components/`, `services/` directory structure
5. **Production-Ready Code**: Clean, readable, maintainable—no shortcuts

---

## 📊 Component Architecture

### Page-Level Components (`src/pages/`)

#### `SimulationHub.jsx`
- **Role**: Root page container for the simulation browsing experience
- **State**: 
  - `activeFilter` (string: 'all' | 'physics' | 'chemistry' | 'biology')
  - `activeSubFilter` (string | null: e.g., 'Quantum', 'Covalent', 'Cellular')
  - `detailOpen` (boolean)
  - `selectedSimulation` (Simulation | null)
  - `simulations` (array from API)
  - `loading` (boolean)
  - `error` (string | null)

- **Props**: None (page-level component)

- **Responsibilities**:
  - Fetch simulations from API on mount
  - Manage filter state changes
  - Open/close detail overlay
  - Pass filtered simulations to child components
  - Manage body scroll lock when overlay is open

- **Children**: 
  - `<Navigation />`
  - `<Hero />`
  - `<SimulationHub.Main />`
  - `<Footer />`
  - `<DetailOverlay />`

---

### Layout Components (`src/components/layout/`)

#### `Navigation.jsx`
- **Props**:
  - `onPhysicsClick: (topic: string | null) => void`
  - `onChemistryClick: (topic: string | null) => void`
  - `onBiologyClick: (topic: string | null) => void`
  - `activeFilter: string`
  - `activeSubFilter: string | null`

- **Structure**:
  - Logo + "Nexus Lab" text (clickable—scroll to top)
  - Desktop nav items (Physics, Chemistry, Biology) with dropdowns
  - Search input (placeholder only for now)
  - Settings + Account icons

- **Children**:
  - `<NavDropdown />` (3x)
  - `<SearchInput />`
  - `<IconButton />` (2x)

---

#### `Hero.jsx`
- **Props**:
  - `onExploreClick: () => void`

- **Structure**:
  - System status badge (top-left)
  - Large headline with red accent
  - Body copy
  - "Explore Simulations" CTA button

- **Children**:
  - `<Badge />`
  - `<Button />`

---

#### `SimulationGrid.jsx`
- **Props**:
  - `simulations: Simulation[]`
  - `onSimulationSelect: (sim: Simulation) => void`
  - `activeFilter: string`
  - `activeSubFilter: string | null`
  - `onFilterChange: (filter: string, subFilter?: string | null) => void`

- **Structure**:
  - Filter bar (chips + active filter label)
  - Grid of simulation cards
  - Load more button (placeholder)

- **Children**:
  - `<FilterBar />`
  - `<SimulationCard />` (repeating)
  - `<Button />`

---

#### `DetailOverlay.jsx`
- **Props**:
  - `isOpen: boolean`
  - `simulation: Simulation | null`
  - `onClose: () => void`

- **Structure**:
  - Fixed full-screen overlay (hidden when not open)
  - Left side: image + back button
  - Right side: details panel
  - Escape key closes modal
  - Body scroll locked when open

- **Children**:
  - `<DetailImage />`
  - `<DetailPanel />`

---

### Feature Components (`src/components/features/`)

#### `FilterBar.jsx`
- **Props**:
  - `onFilterChange: (filter: string) => void`
  - `activeFilter: string`

- **Structure**:
  - Header: "Available Modules" + active filter display
  - Filter chips: ALL, PHYSICS, CHEMISTRY, BIOLOGY
  - Chip states: active (red bg, white text) vs inactive (white bg, black text)

- **Children**:
  - `<FilterChip />` (4x)

---

#### `NavDropdown.jsx`
- **Props**:
  - `label: string` (e.g., "Physics")
  - `items: Array<{label: string, topic: string, onClick: () => void}>`
  - `isActive: boolean`

- **Structure**:
  - Button label
  - Hidden dropdown menu (appears on parent hover)
  - List of clickable items

- **Children**:
  - `<NavDropdownItem />` (repeating)

---

#### `SimulationCard.jsx`
- **Props**:
  - `simulation: Simulation`
  - `onOpen: (sim: Simulation) => void`

- **Structure**:
  - Image (grayscale, color on hover)
  - Topic badge (top-left of image)
  - Title
  - Description
  - Tags/specs row (bottom)

- **Children**:
  - `<Badge />`
  - `<Tag />`

---

#### `DetailImage.jsx`
- **Props**:
  - `imageUrl: string`
  - `onBack: () => void`

- **Structure**:
  - Full-height image on left
  - Positioned back button (top-left corner inside)

- **Children**:
  - `<Button />`

---

#### `DetailPanel.jsx`
- **Props**:
  - `simulation: Simulation`
  - `onInitialize: () => void` (placeholder handler)

- **Structure**:
  - Category badge
  - Large title
  - Description text
  - "System Parameters" section (2-column grid)
    - Complexity box
    - Runtime box
  - "Initialize Simulation" button

- **Children**:
  - `<Badge />`
  - `<ParameterBox />`
  - `<Button />`

---

### UI Components (`src/components/ui/`)

#### `Button.jsx`
- **Props**:
  - `children: ReactNode`
  - `variant?: 'primary' | 'secondary'` (default: 'primary')
  - `onClick?: () => void`
  - `className?: string` (for additional Tailwind classes)

- **Structure**: Simple button with conditional styling based on variant

---

#### `Badge.jsx`
- **Props**:
  - `label: string`
  - `variant?: 'category' | 'tag'` (different sizes/styles)

- **Structure**: Inline label with background color

---

#### `Tag.jsx`
- **Props**:
  - `label: string`

- **Structure**: Small bordered label

---

#### `FilterChip.jsx`
- **Props**:
  - `label: string`
  - `isActive: boolean`
  - `onClick: () => void`

- **Structure**: Clickable chip button with active state styling

---

#### `IconButton.jsx`
- **Props**:
  - `icon: string` (e.g., 'settings', 'account_circle')
  - `onClick?: () => void`

- **Structure**: Icon-only button with Material Symbols Outlined

---

#### `ParameterBox.jsx`
- **Props**:
  - `label: string`
  - `value: string`

- **Structure**: Small bordered info box with label + value

---

## 📦 Data Model (`src/types/index.ts`)

```typescript
export interface Simulation {
  id: string;
  title: string;
  description: string;
  category: 'physics' | 'chemistry' | 'biology';
  topic: string;
  imageUrl: string;
  tags: string[];
  complexity: string;
  runtime: string;
}

export interface FilterState {
  activeFilter: string;
  activeSubFilter: string | null;
}
```

---

## 🗂️ Updated Directory Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navigation.jsx
│   │   ├── Hero.jsx
│   │   ├── SimulationGrid.jsx
│   │   ├── DetailOverlay.jsx
│   │   └── Footer.jsx
│   ├── features/
│   │   ├── FilterBar.jsx
│   │   ├── NavDropdown.jsx
│   │   ├── NavDropdownItem.jsx
│   │   ├── SimulationCard.jsx
│   │   ├── DetailImage.jsx
│   │   └── DetailPanel.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Badge.jsx
│       ├── Tag.jsx
│       ├── FilterChip.jsx
│       ├── IconButton.jsx
│       └── ParameterBox.jsx
├── pages/
│   ├── SimulationHub.jsx
│   ├── Layout.jsx
│   └── Nav.jsx (keep existing)
├── services/
│   ├── api.js (existing)
│   └── simulationService.js (new—wraps API calls)
├── types/
│   └── index.ts
├── data/
│   └── mockSimulations.js (mock data for structure testing)
├── App.jsx
└── main.jsx
```

---

## 🔄 Data Flow

### Initialization
1. `SimulationHub` mounts → calls `simulationService.getSimulations()` via `useEffect`
2. Results stored in state: `setSimulations(data)`
3. Pass `simulations` + filter handlers to children

### Filter Flow
1. User clicks filter chip in `FilterBar`
2. → calls `onFilterChange('physics')`
3. → `SimulationHub` updates `activeFilter` state
4. → Filters array: `simulations.filter(s => s.category === activeFilter)`
5. → Passes filtered array to `SimulationGrid`
6. → `SimulationCard` renders filtered items

### Detail Overlay Flow
1. User clicks `SimulationCard`
2. → calls `onOpen(simulation)`
3. → `SimulationHub` sets `selectedSimulation` + `detailOpen = true`
4. → `DetailOverlay` receives props, renders
5. User clicks back button
6. → calls `onClose()`
7. → `SimulationHub` resets state

---

## 💾 State Management (No Context Yet)

All state lives in `SimulationHub.jsx`:

```javascript
const [simulations, setSimulations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [activeFilter, setActiveFilter] = useState('all');
const [activeSubFilter, setActiveSubFilter] = useState(null);
const [detailOpen, setDetailOpen] = useState(false);
const [selectedSimulation, setSelectedSimulation] = useState(null);

// Computed filtered list
const filteredSimulations = useMemo(() => {
  return simulations.filter(sim => {
    let matchesCategory = activeFilter === 'all' || sim.category === activeFilter;
    let matchesTopic = !activeSubFilter || sim.topic === activeSubFilter;
    return matchesCategory && matchesTopic;
  });
}, [simulations, activeFilter, activeSubFilter]);

// Handlers
const handleFilterChange = (filter, subFilter = null) => {
  setActiveFilter(filter);
  setActiveSubFilter(subFilter);
};

const handleSimulationSelect = (simulation) => {
  setSelectedSimulation(simulation);
  setDetailOpen(true);
};

const handleCloseDetail = () => {
  setDetailOpen(false);
  setSelectedSimulation(null);
};

// Lock body scroll when overlay open
useEffect(() => {
  document.body.style.overflow = detailOpen ? 'hidden' : 'auto';
  
  const handleEsc = (e) => {
    if (e.key === 'Escape' && detailOpen) {
      handleCloseDetail();
    }
  };
  
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, [detailOpen]);
```

---

## 🎨 Tailwind Classes (Structure-Only Phase)

Use semantic class names without finalizing spacing/colors yet:

```javascript
// Don't worry about exact values—focus on structure:
<div className="navigation">
  <div className="navigation__logo-section">
    {/* logo + text */}
  </div>
  <div className="navigation__menu">
    {/* nav items */}
  </div>
  <div className="navigation__search-actions">
    {/* search + icons */}
  </div>
</div>
```

Then in `index.css`, define the grid/flex layout:

```css
.navigation {
  @apply flex justify-between items-center h-16 border-2 border-black sticky top-4 z-50 bg-white;
}

.navigation__logo-section {
  @apply flex items-center gap-2 border-r-2 border-black pr-4 h-full cursor-pointer;
}
```

**Key Rule**: Components define structure (JSX), global CSS defines layout (Tailwind + custom).

---

## 📋 Implementation Checklist

### Phase 1: Structure (No Styling)
- [ ] Define `Simulation` type
- [ ] Create mock data in `mockSimulations.js`
- [ ] Build all UI components (10 files)
- [ ] Build feature components (6 files)
- [ ] Build layout components (5 files)
- [ ] Build `SimulationHub.jsx` page
- [ ] Wire up handlers + state
- [ ] Test filter flow in browser (unstyled)
- [ ] Test detail overlay open/close

### Phase 2: Styling (After Structure)
- [ ] Add Tailwind classes to each component
- [ ] Define layout in `index.css` using `@apply`
- [ ] Fine-tune spacing, colors, typography
- [ ] Test responsive behavior (mobile, tablet, desktop)

### Phase 3: Polish & Extensions
- [ ] Add p5.js canvas integration (SimulationCanvas)
- [ ] Connect to real API endpoints
- [ ] Add error handling UI
- [ ] Loading states
- [ ] Toast notifications

---

## 🚀 Component Template

Every component follows this structure:

```jsx
// src/components/[category]/ComponentName.jsx

import React from 'react';

export function ComponentName({ 
  prop1, 
  prop2, 
  onAction 
}) {
  
  const handleClick = () => {
    onAction();
  };

  return (
    <div className="component-name">
      <h2 className="component-name__title">{prop1}</h2>
      <p className="component-name__description">{prop2}</p>
      <button onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
}
```

---

## 🎓 Senior Developer Practices

1. **Explicit Over Implicit**: Every prop passed explicitly—no context shortcuts
2. **Single Responsibility**: Each component does one thing well
3. **Testability**: Components accept data/handlers as props, not fetching internally
4. **Readability**: Variable names describe intent (`selectedSimulation` not `detail`)
5. **Composition**: Build complexity from simple, predictable pieces
6. **No Surprises**: Props contract is the API—document what each component expects
7. **Future-Proof**: Easy to refactor to custom hooks, context, or state management later

---

## 📝 Notes

- **Styling comes later**: Focus on JSX structure, component contracts, data flow
- **No p5.js yet**: Keep `SimulationCanvas` separate—integrate after structure is solid
- **Axios already configured**: Use existing `api.js` via `simulationService`
- **React Router exists**: Page-level routing unchanged—this refactoring is component-level
- **Tailwind available**: Use utility classes; no CSS-in-JS needed
- **Keep existing patterns**: `services/`, `pages/`, `components/` directories match your setup

---

## ✅ Success Criteria

- [ ] All components render without styling
- [ ] Filter buttons change state
- [ ] Detail overlay opens/closes on card click
- [ ] Escape key closes overlay
- [ ] Body scroll locked when overlay open
- [ ] Props are explicit and clearly named
- [ ] No prop drilling needed yet
- [ ] Code is readable by a junior dev
- [ ] Easy to add Tailwind classes later
