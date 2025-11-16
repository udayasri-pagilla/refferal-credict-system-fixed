# Referral & Credit Frontend

This is a minimal Next.js + TypeScript + Tailwind frontend for the Referral & Credit assignment.

Setup

1. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE` to your backend API (e.g. `http://localhost:4000/api`).

2. Install dependencies:

```powershell
cd frontend
npm install
```

3. Run the dev server:

```powershell
npm run dev
```

Pages

- `/register` - register with optional `referralCode`
- `/login` - login
- `/dashboard` - shows referred counts, converted, credits and copy referral link
- `/product` - simulated product page with "Buy Product" button

Notes

- This frontend is minimal and focuses on requirements: Next.js + TypeScript + Tailwind + Zustand for auth state.
- No styling libraries or prebuilt UI kits are used.
