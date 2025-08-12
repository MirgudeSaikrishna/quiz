"use client";

import { useEffect, useState } from 'react';
import { Loan } from './LoanList';

const Summary: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);

  const fetchLoans = async () => {
    const res = await fetch('/api/loans');
    const data = await res.json();
    setLoans(data);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const expenses = loans
    .filter((l) => l.type === 'taken')
    .reduce((sum, l) => sum + (l.principal * l.interestRate * l.monthsRemaining) / (12 * 100), 0);

  const incomes = loans
    .filter((l) => l.type === 'given')
    .reduce((sum, l) => sum + (l.principal * l.interestRate * l.monthsRemaining) / (12 * 100), 0);

  const pnl = incomes - expenses;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Profile Summary</h2>
      <div className="border p-4 rounded">
        <p>Expenses (Loans Taken Interest): <strong className="text-red-600">₹ {expenses.toFixed(2)}</strong></p>
        <p>Income (Loans Given Interest): <strong className="text-green-600">₹ {incomes.toFixed(2)}</strong></p>
        <p>Total P&amp;L: <strong>{pnl >= 0 ? 'Profit' : 'Loss'} ₹ {pnl.toFixed(2)}</strong></p>
      </div>
    </div>
  );
};

export default Summary;