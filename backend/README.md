# Referral & Credit Backend

This is the Express + TypeScript backend for the Referral & Credit System assignment.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.

2. Install dependencies:

```powershell
cd backend
npm install
```

3. Run in development:

```powershell
npm run dev
```

API Endpoints (summary)

- `POST /api/auth/register` — body: `{ email, password, referralCode? }`
- `POST /api/auth/login` — body: `{ email, password }`
- `POST /api/purchase/buy` — headers: `Authorization: Bearer <token>` body: `{ amount }` — simulate a purchase; first purchase triggers referral crediting
- `GET /api/dashboard` — headers: `Authorization: Bearer <token>` — returns `{ totalReferred, converted, credits, referralCode }`

Notes

- The referral model records relationships and prevents double-crediting by checking the `credited` flag.
- The purchase flow uses a MongoDB session when available to try to keep updates atomic.
