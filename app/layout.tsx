import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gold Finance',
  description: 'Single-user finance app for gold loans',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="container">
            <Link href="/" className="brand">Gold Finance</Link>
            <div className="spacer" />
            <Link href="/loans?type=taken">Loans Taken</Link>
            <Link href="/loans?type=given">Loans Given</Link>
            <Link href="/profile">Profile</Link>
          </div>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}