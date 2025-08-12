import { getDb } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const updateSchema = z.object({
  direction: z.enum(['taken', 'given']).optional(),
  principalAmount: z.number().positive().optional(),
  interestRateMonthlyPct: z.number().nonnegative().optional(),
  monthsTotal: z.number().int().positive().optional(),
  monthsRemaining: z.number().int().nonnegative().optional(),
  startDate: z.string().optional(),
  goldQuantityGrams: z.number().nonnegative().optional(),
  counterpartyName: z.string().optional(),
  notes: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const update = updateSchema.parse(body);
    const db = await getDb();
    const _id = new ObjectId(params.id);
    const result = await db
      .collection('loans')
      .findOneAndUpdate(
        { _id },
        { $set: { ...update, updatedAt: new Date().toISOString() } },
        { returnDocument: 'after' }
      );
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const _id = new ObjectId(params.id);
    const result = await db.collection('loans').deleteOne({ _id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}