# Science Simulation — Monorepo

React + Node/Express + MySQL monorepo.

```
science-sim/
├── api/                    # Express backend
│   └── src/
│       ├── config/
│       │   ├── db.js       # MySQL connection pool
│       │   └── schema.sql  # DB schema + seed
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── index.js        # Express entry point
├── web/                    # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/       # Axios API layer
│       └── App.jsx
└── package.json            # Workspace root
```

## Setup

### 1. Database
```bash
mysql -u root -p < api/src/config/schema.sql
```

### 2. Environment
```bash
cp api/.env.example api/.env
# Edit api/.env with your DB credentials
```

### 3. Install & Run
```bash
npm install        # installs all workspaces
npm run dev        # starts both api (3000) and web (5173)
```

Or run individually:
```bash
npm run dev:api
npm run dev:web
```

## API Endpoints

| Method | Path                    | Description        |
|--------|-------------------------|--------------------|
| GET    | /api/simulations        | List all           |
| GET    | /api/simulations/:id    | Get one            |
| POST   | /api/simulations        | Create             |
| PUT    | /api/simulations/:id    | Update             |
| DELETE | /api/simulations/:id    | Delete             |
| GET    | /api/health             | Health check       |
