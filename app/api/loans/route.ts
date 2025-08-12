import { getDb, Loan } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const loanSchema = z.object({
  direction: z.enum(['taken', 'given']),
  principalAmount: z.number().positive(),
  interestRateMonthlyPct: z.number().nonnegative(),
  monthsTotal: z.number().int().positive(),
  monthsRemaining: z.number().int().nonnegative(),
  startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'Invalid date'),
  goldQuantityGrams: z.number().nonnegative(),
  counterpartyName: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection('loans').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(docs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parsed = loanSchema.parse(raw);
    const now = new Date().toISOString();
    const doc: Loan = { ...parsed, createdAt: now, updatedAt: now };
    const db = await getDb();
    const result = await db.collection('loans').insertOne(doc as any);
    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}