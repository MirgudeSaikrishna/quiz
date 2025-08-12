"use client";

import { useState } from 'react';

interface LoanFormProps {
  onCreated?: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ onCreated }) => {
  const [type, setType] = useState<'taken' | 'given'>('taken');
  const [principal, setPrincipal] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [monthsRemaining, setMonthsRemaining] = useState<number>(0);
  const [goldQuantity, setGoldQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          principal,
          interestRate,
          date: new Date(date),
          monthsRemaining,
          goldQuantity,
        }),
      });
      setPrincipal(0);
      setInterestRate(0);
      setDate('');
      setMonthsRemaining(0);
      setGoldQuantity(0);
      if (onCreated) onCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2 border p-4 rounded">
      <div>
        <label className="mr-2">Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="taken">Loan Taken</option>
          <option value="given">Loan Given</option>
        </select>
      </div>
      <div>
        <label className="mr-2">Principal:</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(parseFloat(e.target.value))}
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="mr-2">Interest Rate (%/yr):</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="mr-2">Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label className="mr-2">Months Remaining:</label>
        <input
          type="number"
          value={monthsRemaining}
          onChange={(e) => setMonthsRemaining(parseInt(e.target.value, 10))}
          required
        />
      </div>
      <div>
        <label className="mr-2">Gold Quantity (g):</label>
        <input
          type="number"
          value={goldQuantity}
          onChange={(e) => setGoldQuantity(parseFloat(e.target.value))}
          step="0.01"
          required
        />
      </div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-1 rounded">
        {loading ? 'Saving...' : 'Add Loan'}
      </button>
    </form>
  );
};

export default LoanForm;