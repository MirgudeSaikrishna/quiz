"use client";

import { useEffect, useState } from 'react';

export interface Loan {
  _id: string;
  type: 'taken' | 'given';
  principal: number;
  interestRate: number;
  date: string;
  monthsRemaining: number;
  goldQuantity: number;
}

const LoanList: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);

  const fetchLoans = async () => {
    const res = await fetch('/api/loans');
    const data = await res.json();
    setLoans(data);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Loans</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Principal</th>
            <th className="p-2 border">Interest (%)</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Months Left</th>
            <th className="p-2 border">Gold (g)</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td className="p-2 border text-center">{loan.type}</td>
              <td className="p-2 border text-right">{loan.principal.toFixed(2)}</td>
              <td className="p-2 border text-right">{loan.interestRate.toFixed(2)}</td>
              <td className="p-2 border text-center">{new Date(loan.date).toLocaleDateString()}</td>
              <td className="p-2 border text-center">{loan.monthsRemaining}</td>
              <td className="p-2 border text-right">{loan.goldQuantity.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanList;