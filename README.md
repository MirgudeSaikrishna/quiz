## Gold Finance (Next.js + MongoDB)

Single-user finance app to track gold-backed loans taken and given, and view P&L.

### Setup

1. Create env file:

```bash
cp .env.example .env.local
# edit .env.local and set MONGODB_URI and MONGODB_DB
```

2. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Features
- Create and list loans (type: taken or given)
- Fields: principal, monthly interest %, term months, months remaining, start date, gold quantity, counterparty, notes
- Profile: income (given), expenses (taken), total P&L (simple interest), gold totals
- MongoDB official driver, single `loans` collection

### Notes
- P&L uses simple interest: `principal * monthlyRate * elapsedMonths` capped by term
- You can edit or extend fields and calculations in `lib/pnl.ts`