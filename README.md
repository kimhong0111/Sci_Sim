# Science Simulation — Monorepo

React + Node/Express + MySQL monorepo for interactive science simulations.

## Project Structure

```
Sci_Sim/
├── apps/
│   ├── api/          # Express.js backend
│   │   ├── src/
│   │   │   ├── config/      # DB schema, env config
│   │   │   ├── controllers/ # Request handlers
│   │   │   ├── middleware/  # Auth, validation
│   │   │   ├── models/      # Sequelize models
│   │   │   ├── repository/  # Data access layer
│   │   │   ├── routes/      # API routes
│   │   │   └── index.js     # Entry point
│   │   └── scripts/         # Backup, cron, seed
│   └── web/          # React + Vite frontend
│       ├── public/          # Static assets
│       └── src/
│           ├── components/  # UI components
│           ├── pages/       # Page views
│           ├── services/    # API client & cache
│           ├── sketches/    # p5.js simulations
│           └── hooks/       # React hooks
```

## Quick Start

### 1. Database Setup
```bash
mysql -u root -p < apps/api/src/config/schema.sql
```

### 2. Environment Variables
```bash
# API
cp apps/api/.env.example apps/api/.env
# Fill in: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

# Web (optional, for custom API URL)
echo "VITE_API_URL=/api" > apps/web/.env
```

### 3. Install & Run (Development)
```bash
npm install        # installs all workspaces
npm run dev        # starts api (port 3000) and web (port 5173)
```

## NPM Scripts

### API (`apps/api`)
| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nodemon src/index.js` | Development server with hot reload |
| `start` | `node src/index.js` | Production server |
| `seed` | `node src/seed.js` | Create admin user from .env |
| `migrate` | `node src/migrate.js` | Run schema migrations |
| `backup` | `node scripts/backup.js` | Backup database to SQL file |
| `setup-cron` | `bash scripts/setup-cron.sh` | Enable daily 2AM backups |
| `deploy` | `migrate + seed + start` | Full deployment command |

### Web (`apps/web`)
| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Development server |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production build |

### Root
| Script | Description |
|--------|-------------|
| `npm run dev` | Starts both API and Web |
| `npm run build` | Builds web for production |

## Deployment

### Fresh Server Setup
```bash
# 1. Clone and install
git clone <repo-url>
cd Sci_Sim
npm install

# 2. Configure environment
# Edit apps/api/.env with production DB credentials

# 3. Deploy (migrate + seed + start server)
cd apps/api
npm run deploy

# 4. Set up automatic daily backups
npm run setup-cron
```

### Frontend Deployment
```bash
cd apps/web
npm run build
# Deploy dist/ to your static hosting (Nginx, Vercel, Netlify)
```

### Environment Variables

#### API (`apps/api/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `CORS_ORIGIN` | Allowed frontend origin | `https://yourdomain.com` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `secret` |
| `DB_NAME` | Database name | `science_sim` |
| `EMAIL` | Seed admin email | `admin@sci-sim.com` |
| `PASSWORD` | Seed admin password | `admin12345` |
| `NAME` | Seed admin name | `Main Admin` |

#### Web (`apps/web/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | `/api` or `https://api.domain.com/api` |

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/simulations` | List all simulations |
| GET | `/api/simulations/:id` | Get one simulation |
| GET | `/api/subjects` | List all subjects |
| GET | `/api/topics` | List all topics |
| POST | `/api/auth/login` | Admin login |

### Protected (requires `Authorization: Bearer <token>`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/simulations` | Create simulation |
| PUT | `/api/simulations/:id` | Update simulation |
| DELETE | `/api/simulations/:id` | Delete simulation |
| POST | `/api/subjects` | Create subject |
| POST | `/api/topics` | Create topic |
| POST | `/api/auth/register` | Register new admin (auth required) |
| GET | `/api/auth/me` | Current admin info |
| GET | `/api/auth/users` | List all admins (super-admin only) |
| PUT | `/api/auth/password` | Change own password |
| DELETE | `/api/auth/:id` | Delete admin (super-admin only) |

## Database Schema

```
admin (1) ──< subjects
admin (1) ──< topics
admin (1) ──< simulations
subjects (1) ──< topics
subjects (1) ──< simulations
topics (1) ──< simulations
simulations (1) ── (1) sim_config
```

## Backup & Recovery

### Manual Backup
```bash
cd apps/api
npm run backup
# Saves to scripts/backups/science_sim_backup_YYYY-MM-DD_HH-MM-SS.sql
```

### Automatic Backups
```bash
npm run setup-cron
# Adds daily 2AM backup cron job
# Logs saved to scripts/logs/backup.log
```

### Recovery
```bash
mysql -u root -p science_sim < apps/api/scripts/backups/<filename>.sql
```

## Access Control

| Role | Permissions |
|------|-------------|
| Super-Admin (id=1) | Manage admins, change passwords, delete admins |
| Admin | CRUD on subjects, topics, simulations |
| Public | Read-only access to simulations |

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS, p5.js, Axios
- **Backend:** Node.js, Express, Sequelize, MySQL
- **Auth:** JWT + bcrypt
- **Storage:** Cloudinary (thumbnails), Local cache (API responses)
