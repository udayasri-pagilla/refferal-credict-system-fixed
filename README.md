# Referral Credit System

Simple referral + credits demo app (Express + TypeScript backend, Next.js frontend).

## Features
- User register/login (JWT)
- Referral codes and referral tracking (`pending` → `converted`)
- Default 10 credits on new users
- Simulated product purchase (deduct credits)
- First-purchase referral bonus: **referrer and referred each earn +2 credits once**

## Repo structure
- `backend/` — Express + TypeScript API
- `frontend/` — Next.js frontend

## Quick start (local)
Prerequisites: Node 16+, npm, MongoDB (local)

1. Start MongoDB (local):
   - Example: `mongod --dbpath /path/to/db` (or use MongoDB Desktop/Atlas)

2. Backend

```powershell
cd backend
cp .env.example .env  # edit if needed
npm install
npm run dev
```

Backend runs on `http://localhost:4000` by default.

3. Frontend

```powershell
cd frontend
copy .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables
- `backend/.env`:
  - `MONGO_URI` (e.g. `mongodb://localhost:27017/referral_credit`)
  - `PORT` (default `4000`)
  - `JWT_SECRET` and `JWT_EXPIRES_IN`
- `frontend/.env.local`:
  - `NEXT_PUBLIC_API_BASE` (default `http://localhost:4000`)

## Important notes
- The backend purchase route avoids MongoDB transactions to support standalone local MongoDB instances. If you run a replica set and want transactions, the code can be adapted.
- The referral bonus is applied only once (the `credited` flag prevents double-crediting).

## Running tests / CI
A simple GitHub Actions workflow builds both backend and frontend on push to `main`.

## Deploy
- Frontend: Render
- Backend: Render / Railway / Heroku (set env vars and MONGO_URI)

## Development tips
- Check browser LocalStorage for `auth_token` and `auth_user` when debugging auth state.
- Default credits for new users: `10`.

---
If you want, I can add a Postman collection or Swagger docs next. Let me know.