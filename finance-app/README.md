# Finance App

A simple single-user finance application for managing gold loans, built with **Next.js**, **TypeScript**, and **MongoDB**.

## Features

- Record loans **taken** (expenses) and loans **given** (income)
- Store details such as principal, interest rate, date, months remaining, and gold quantity
- Profile page displaying:
  - Total interest expenses from loans taken
  - Total interest income from loans given
  - Net Profit & Loss (P&L)
- Data persisted in MongoDB using Mongoose

## Getting Started

1. **Clone the repository** (if you haven't already) and install dependencies:

```bash
cd finance-app
npm install
```

2. **Set up environment variables**:

Copy `.env.example` to `.env.local` and update `MONGODB_URI` with your connection string.

```bash
cp .env.example .env.local
# then edit .env.local
```

3. **Run the development server**:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to see the application.

## Production Build

```bash
npm run build
npm start
```

## License

MIT