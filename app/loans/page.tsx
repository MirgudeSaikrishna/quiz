import LoanForm from '@/components/LoanForm';
import LoanList from '@/components/LoanList';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export default async function LoansPage() {
  const db = await getDb();
  const loans = await db.collection('loans').find({}).sort({ createdAt: -1 }).toArray();
  return (
    <div>
      <h1>Loans</h1>
      <LoanForm />
      <LoanList loans={JSON.parse(JSON.stringify(loans))} />
    </div>
  );
}