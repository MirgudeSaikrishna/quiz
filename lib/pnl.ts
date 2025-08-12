import { Loan } from '@/lib/mongodb';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function diffInWholeMonths(fromISO: string, toISO: string): number {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  let total = years * 12 + months;
  // adjust if day-of-month not reached
  if (to.getDate() < from.getDate()) {
    total -= 1;
  }
  return Math.max(0, total);
}

export function computeAccruedInterest(loan: Loan, atISO: string): number {
  const monthsElapsedByDate = diffInWholeMonths(loan.startDate, atISO);
  const monthsElapsed = clamp(
    Math.min(loan.monthsTotal, monthsElapsedByDate),
    0,
    loan.monthsTotal
  );
  const monthlyRate = loan.interestRateMonthlyPct / 100;
  return loan.principalAmount * monthlyRate * monthsElapsed;
}

export function summarizePnL(loans: Loan[], atISO: string) {
  let income = 0;
  let expense = 0;
  for (const loan of loans) {
    const accrued = computeAccruedInterest(loan, atISO);
    if (loan.direction === 'given') {
      income += accrued;
    } else {
      expense += accrued;
    }
  }
  const pnl = income - expense;
  return { income, expense, pnl };
}