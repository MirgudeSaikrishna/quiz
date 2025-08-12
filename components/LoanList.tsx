"use client";

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Loan } from '@/lib/mongodb';
import { computeAccruedInterest } from '@/lib/pnl';

export default function LoanList({ loans }: { loans: Loan[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get('type');
  const [isPending, startTransition] = useTransition();

  const filtered = type === 'taken' || type === 'given' ? loans.filter((l) => l.direction === type) : loans;

  async function onDelete(id: string) {
    startTransition(async () => {
      await fetch(`/api/loans/${id}`, { method: 'DELETE' });
      router.refresh();
    });
  }

  const nowISO = new Date().toISOString();

  return (
    <div className="card">
      <div className="row" style={{ alignItems: 'center', marginBottom: 8 }}>
        <div className="badge">{filtered.length} loans</div>
        <div className="spacer" />
        {isPending ? <div className="badge">Updating…</div> : null}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Principal</th>
              <th>Rate %/mo</th>
              <th>Term</th>
              <th>Start</th>
              <th>Gold (g)</th>
              <th>Accrued</th>
              <th>Counterparty</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((loan) => {
              const accrued = computeAccruedInterest(loan, nowISO);
              return (
                <tr key={String((loan as any)._id)}>
                  <td><span className="badge">{loan.direction}</span></td>
                  <td className="mono">{loan.principalAmount.toLocaleString()}</td>
                  <td className="mono">{loan.interestRateMonthlyPct}</td>
                  <td className="mono">{loan.monthsTotal} mo ({loan.monthsRemaining} left)</td>
                  <td className="mono">{loan.startDate.slice(0, 10)}</td>
                  <td className="mono">{loan.goldQuantityGrams}</td>
                  <td className="mono">{accrued.toFixed(2)}</td>
                  <td>{loan.counterpartyName || '-'}</td>
                  <td>{loan.notes || '-'}</td>
                  <td>
                    <button className="button secondary" onClick={() => onDelete(String((loan as any)._id))}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}