import { getDb } from '@/lib/mongodb';
import { summarizePnL } from '@/lib/pnl';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const db = await getDb();
  const loans = await db.collection('loans').find({}).toArray();
  const nowISO = new Date().toISOString();
  const { income, expense, pnl } = summarizePnL(loans as any, nowISO);
  const totalGoldTaken = (loans as any[]).filter(l => l.direction === 'taken').reduce((s, l) => s + (l.goldQuantityGrams || 0), 0);
  const totalGoldGiven = (loans as any[]).filter(l => l.direction === 'given').reduce((s, l) => s + (l.goldQuantityGrams || 0), 0);

  return (
    <div className="grid">
      <div className="card">
        <h2>Income (Loans Given)</h2>
        <div className="mono" style={{ fontSize: 28 }}>{income.toFixed(2)}</div>
      </div>
      <div className="card">
        <h2>Expenses (Loans Taken)</h2>
        <div className="mono" style={{ fontSize: 28 }}>{expense.toFixed(2)}</div>
      </div>
      <div className="card">
        <h2>Total P&L</h2>
        <div className="mono" style={{ fontSize: 32, color: pnl >= 0 ? '#86efac' : '#fca5a5' }}>{pnl.toFixed(2)}</div>
      </div>
      <div className="card">
        <h2>Gold Quantities</h2>
        <div className="row">
          <div style={{ flex: 1 }}>
            <div className="label">Gold for Loans Taken (g)</div>
            <div className="mono" style={{ fontSize: 24 }}>{totalGoldTaken.toFixed(2)}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">Gold for Loans Given (g)</div>
            <div className="mono" style={{ fontSize: 24 }}>{totalGoldGiven.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}