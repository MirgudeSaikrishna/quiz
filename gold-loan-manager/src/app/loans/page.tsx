'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Filter, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LoanForm from '@/components/LoanForm';
import LoanCard from '@/components/LoanCard';

interface Loan {
  _id: string;
  type: 'taken' | 'given';
  principalAmount: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  monthsRemaining: number;
  goldQuantity: number;
  goldPurity: number;
  lenderName?: string;
  borrowerName?: string;
  description?: string;
  status: 'active' | 'paid' | 'overdue';
  createdAt: string;
}

export default function LoansPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'taken' | 'given'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paid' | 'overdue'>('all');

  useEffect(() => {
    fetchLoans();
    
    // Check if we should show the form based on URL params
    const action = searchParams.get('action');
    if (action === 'add') {
      setShowForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    filterLoans();
  }, [loans, searchTerm, filterType, filterStatus]);

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/loans');
      const data = await response.json();
      setLoans(data.loans);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLoans = () => {
    let filtered = loans;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(loan => loan.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'overdue') {
        filtered = filtered.filter(loan => 
          Date.now() > new Date(loan.endDate).getTime() && loan.status === 'active'
        );
      } else {
        filtered = filtered.filter(loan => loan.status === filterStatus);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(loan => {
        const name = loan.type === 'taken' ? loan.lenderName : loan.borrowerName;
        return name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               loan.description?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredLoans(filtered);
  };

  const handleAddLoan = async (loanData: any) => {
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanData),
      });

      if (response.ok) {
        const result = await response.json();
        setLoans(prev => [result.loan, ...prev]);
        setShowForm(false);
        router.push('/loans');
      } else {
        console.error('Error adding loan');
      }
    } catch (error) {
      console.error('Error adding loan:', error);
    }
  };

  const handleDeleteLoan = async (loanId: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) {
      return;
    }

    try {
      const response = await fetch(`/api/loans/${loanId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLoans(prev => prev.filter(loan => loan._id !== loanId));
      } else {
        console.error('Error deleting loan');
      }
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  const handleStatusChange = async (loanId: string, newStatus: 'active' | 'paid' | 'overdue') => {
    try {
      const response = await fetch(`/api/loans/${loanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        setLoans(prev => prev.map(loan => 
          loan._id === loanId ? result.loan : loan
        ));
      } else {
        console.error('Error updating loan status');
      }
    } catch (error) {
      console.error('Error updating loan status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Manage Loans</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Loan
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showForm ? (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Loan</h2>
              <LoanForm
                onSubmit={handleAddLoan}
                onCancel={() => {
                  setShowForm(false);
                  router.push('/loans');
                }}
              />
            </div>
          ) : (
            <>
              {/* Filters and Search */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search loans..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Type Filter */}
                  <div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as 'all' | 'taken' | 'given')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="taken">Loans Taken</option>
                      <option value="given">Loans Given</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'paid' | 'overdue')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  {/* Results Count */}
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-500">
                      {filteredLoans.length} of {loans.length} loans
                    </span>
                  </div>
                </div>
              </div>

              {/* Loans Grid */}
              {filteredLoans.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">💰</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
                  <p className="text-gray-500 mb-4">
                    {loans.length === 0 
                      ? "Get started by adding your first loan."
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                  {loans.length === 0 && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Loan
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredLoans.map((loan) => (
                    <LoanCard
                      key={loan._id}
                      loan={loan}
                      onDelete={handleDeleteLoan}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}