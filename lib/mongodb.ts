import { MongoClient, Db } from 'mongodb';

let cachedClientPromise: Promise<MongoClient> | undefined;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getOrCreateClientPromise(uri: string): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }
  if (!cachedClientPromise) {
    const client = new MongoClient(uri);
    cachedClientPromise = client.connect();
  }
  return cachedClientPromise;
}

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment');
  }
  const client = await getOrCreateClientPromise(uri);
  const dbName = process.env.MONGODB_DB || 'gold_finance';
  return client.db(dbName);
}

export type LoanDirection = 'taken' | 'given';

export interface Loan {
  _id?: string;
  direction: LoanDirection;
  principalAmount: number; // in currency units
  interestRateMonthlyPct: number; // percent per month
  monthsTotal: number; // original term
  monthsRemaining: number; // remaining months
  startDate: string; // ISO date string
  goldQuantityGrams: number; // grams of gold associated
  counterpartyName?: string; // lender for taken, borrower for given
  notes?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}