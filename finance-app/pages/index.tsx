import Head from 'next/head';
import LoanForm from '../components/LoanForm';
import LoanList from '../components/LoanList';

export default function Home() {
  const refresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <>
      <Head>
        <title>Finance Manager</title>
      </Head>
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Finance Manager</h1>
        <LoanForm onCreated={refresh} />
        <LoanList />
      </main>
    </>
  );
}