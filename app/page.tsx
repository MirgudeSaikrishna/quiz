import Link from 'next/link';

export default function Page() {
  return (
    <div className="grid">
      <div className="card">
        <h2>Loans Taken</h2>
        <p>Track liabilities you have taken. Enter principal, interest, term, and gold quantity.</p>
        <Link className="button" href="/loans?type=taken">Go to Loans Taken</Link>
      </div>
      <div className="card">
        <h2>Loans Given</h2>
        <p>Track assets you have given out as loans. Record details and monitor income.</p>
        <Link className="button" href="/loans?type=given">Go to Loans Given</Link>
      </div>
      <div className="card">
        <h2>Profile & P&L</h2>
        <p>See total income from loans given, expenses from loans taken, and overall P&L.</p>
        <Link className="button" href="/profile">Go to Profile</Link>
      </div>
    </div>
  );
}