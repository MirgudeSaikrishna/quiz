"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { LoanDirection } from '@/lib/mongodb';

export default function LoanForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialDirection = (params.get('type') as LoanDirection) || 'taken';

  const [direction, setDirection] = useState<LoanDirection>(initialDirection);
  const [principalAmount, setPrincipalAmount] = useState<number>(0);
  const [interestRateMonthlyPct, setInterestRateMonthlyPct] = useState<number>(0);
  const [monthsTotal, setMonthsTotal] = useState<number>(1);
  const [monthsRemaining, setMonthsRemaining] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [goldQuantityGrams, setGoldQuantityGrams] = useState<number>(0);
  const [counterpartyName, setCounterpartyName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction,
          principalAmount: Number(principalAmount),
          interestRateMonthlyPct: Number(interestRateMonthlyPct),
          monthsTotal: Number(monthsTotal),
          monthsRemaining: Number(monthsRemaining),
          startDate: new Date(startDate).toISOString(),
          goldQuantityGrams: Number(goldQuantityGrams),
          counterpartyName: counterpartyName || undefined,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data.error ?? data));
      }
      setPrincipalAmount(0);
      setInterestRateMonthlyPct(0);
      setMonthsTotal(1);
      setMonthsRemaining(1);
      setStartDate(new Date().toISOString().slice(0, 10));
      setGoldQuantityGrams(0);
      setCounterpartyName('');
      setNotes('');
      router.refresh();
    } catch (err: any) {
      setError(String(err.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ marginBottom: 16 }}>
      <div className="row">
        <div style={{ flex: 1 }}>
          <label className="label">Type</label>
          <select value={direction} onChange={(e) => setDirection(e.target.value as LoanDirection)}>
            <option value="taken">Taken (Expense)</option>
            <option value="given">Given (Income)</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">Start Date</label>
          <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
      </div>
      <div className="row">
        <div style={{ flex: 1 }}>
          <label className="label">Principal Amount</label>
          <input className="input" type="number" min={0} step={0.01} value={principalAmount} onChange={(e) => setPrincipalAmount(Number(e.target.value))} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">Interest Rate (per month, %)</label>
          <input className="input" type="number" min={0} step={0.01} value={interestRateMonthlyPct} onChange={(e) => setInterestRateMonthlyPct(Number(e.target.value))} />
        </div>
      </div>
      <div className="row">
        <div style={{ flex: 1 }}>
          <label className="label">Total Months (term)</label>
          <input className="input" type="number" min={1} step={1} value={monthsTotal} onChange={(e) => setMonthsTotal(Number(e.target.value))} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">Months Remaining</label>
          <input className="input" type="number" min={0} step={1} value={monthsRemaining} onChange={(e) => setMonthsRemaining(Number(e.target.value))} />
        </div>
      </div>
      <div className="row">
        <div style={{ flex: 1 }}>
          <label className="label">Gold Quantity (grams)</label>
          <input className="input" type="number" min={0} step={0.01} value={goldQuantityGrams} onChange={(e) => setGoldQuantityGrams(Number(e.target.value))} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">Counterparty Name</label>
          <input className="input" type="text" value={counterpartyName} onChange={(e) => setCounterpartyName(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {error ? (
        <div className="mono" style={{ color: '#fca5a5', marginTop: 8 }}>{error}</div>
      ) : null}
      <div style={{ marginTop: 12 }}>
        <button className="button" disabled={submitting} type="submit">
          {submitting ? 'Saving…' : 'Add Loan'}
        </button>
      </div>
    </form>
  );
}