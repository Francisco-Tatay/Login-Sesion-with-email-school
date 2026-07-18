# AGENTS.md — Login-Sesion-with-email-school

## Project structure

Two independent pnpm projects in a single repo:

- `Backend/` — Express v5 REST API (ESM, `"type": "module"`)
  - Entry: `src/server.js` (not `index.js` as `package.json` claims)
  - MySQL via `mysql2/promise` connection pool (DbSingleton pattern)
  - Table expected: `Users` (columns: id, email, password, role_id)
- `Frontend/` — Vue 3 SPA (Vite 7, Pinia 3, Vue Router 5)
  - Entry: `src/main.js`
  - `@` alias → `./src` (configured in both vite.config.js and jsconfig.json)

## Dev commands

**Backend** (`Backend/`):
- `pnpm run dev` — nodemon on port 3000

**Frontend** (`Frontend/`):
- `pnpm run dev` — Vite dev server (port 5173)
- `pnpm run build` — production build
- `pnpm run lint` — sequential: oxlint → eslint (`run-s lint:*`)
- `pnpm run format` — prettier (semicolons, double quotes, 100 width)

## Setup

```bash
cd Backend && pnpm install
cd ../Frontend && pnpm install
```

Frontend `.env` at `Frontend/src/.env` (VITE\_ prefix). Backend `.env` at `Backend/.env`.

MySQL must already exist with database `test01` (configurable via env). No migration files — schema is assumed.

## Known broken code (fix before assuming app works)

1. `Backend/src/Controller/UserController.js:4` — `'../src/Model/User.js'` should be `'../Model/User.js'`
2. `Frontend/src/main.js:13-19` — `createAuth0` not imported; `app.use({ createAuth0(...) })` is invalid
3. `Frontend/src/services/AuthService.js` — stub importing Node `http2` instead of Axios
4. `Frontend/src/main.js:7-8` — `dotenv` import is unnecessary (Vite handles `.env` natively)

## API routes (Backend)

| Method | Path | Auth |
|--------|------|------|
| POST | `/register` | No |
| POST | `/login` | No |
| POST | `/users/resetPassword` | No |
| GET | `/users/all` | JWT Bearer token |
| DELETE | `/users/delete` | JWT Bearer token |

Frontend hits `http://localhost:3000` directly (no Vite proxy).

## Notable quirks

- Express v5 — some Express 4 middleware patterns may not work
- JWT token stored/returned on login, sent as `Authorization: Bearer <token>`
- Email config has fallback keys: `EMAIL_USER`/`email`, `EMAIL_PASSWORD`/`emailpassword`
- No tests exist (both `test` scripts are placeholders)
- Product model/controller defined but not wired to any route
- `AuthService.js` is a stub — use `userService.js` instead
