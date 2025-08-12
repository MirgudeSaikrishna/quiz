import Head from 'next/head';
import Summary from '../components/Summary';
import LoanList from '../components/LoanList';

export default function Profile() {
  return (
    <>
      <Head>
        <title>Profile - Finance Manager</title>
      </Head>
      <main className="container mx-auto p-8 space-y-8">
        <Summary />
        <LoanList />
      </main>
    </>
  );
}