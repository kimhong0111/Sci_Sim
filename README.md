Science Simulation — Monorepo

React + Node/Express + MySQL monorepo.


## Setup

### 1. Database
```bash
mysql -u root -p < apps/api/src/config/schema.sql
```

### 2. Environment
```bash
cp apps/api/.env.example apps/api/.env
# Fill in your DB credentials and JWT_SECRET
```

### 3. Install & Run
```bash
npm install        # installs all workspaces
npm run dev        # starts api (port 3000) and web (port 5173)
```

## API Endpoints

### Public
| Method | Path               | Description       |
|--------|--------------------|-------------------|
| GET    | /api/health        | Health check      |
| GET    | /api/simulations   | List all          |
| GET    | /api/simulations/:id | Get one         |
| POST   | /api/auth/login    | Admin login       |
| POST   | /api/auth/register | Register admin    |

### Protected (requires `Authorization: Bearer <token>`)
| Method | Path                 | Description     |
|--------|----------------------|-----------------|
| POST   | /api/simulations     | Create          |
| PUT    | /api/simulations/:id | Update          |
| DELETE | /api/simulations/:id | Delete          |
