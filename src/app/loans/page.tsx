'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

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
  borrowerName?: string;
  lenderName?: string;
  status: 'active' | 'completed' | 'defaulted';
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  createdAt: string;
}

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'taken' | 'given'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'defaulted'>('all');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/loans');
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) {
      return;
    }

    try {
      const response = await fetch(`/api/loans/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLoans();
      } else {
        alert('Failed to delete loan');
      }
    } catch (error) {
      alert('Failed to delete loan');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatGold = (grams: number) => {
    return `${grams.toFixed(2)}g`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'defaulted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLoans = loans.filter(loan => {
    const typeMatch = filter === 'all' || loan.type === filter;
    const statusMatch = statusFilter === 'all' || loan.status === statusFilter;
    return typeMatch && statusMatch;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading loans...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
            <p className="text-gray-600">Manage your gold loan portfolio</p>
          </div>
          <Link href="/add-loan">
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Loan
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Loans</option>
                <option value="taken">Loans Taken</option>
                <option value="given">Loans Given</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="defaulted">Defaulted</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Loans List */}
        <div className="space-y-4">
          {filteredLoans.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500">No loans found matching your criteria</p>
                <Link href="/add-loan">
                  <Button variant="primary" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Loan
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            filteredLoans.map((loan) => (
              <Card key={loan._id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      loan.type === 'given' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {loan.type === 'given' ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {loan.type === 'given' ? loan.borrowerName : loan.lenderName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {loan.type === 'given' ? 'Given to' : 'Taken from'} • {format(new Date(loan.startDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(loan.principalAmount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {loan.interestRate}% • {loan.monthsRemaining} months left
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatGold(loan.goldQuantity)} • {loan.goldPurity}% purity
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(`/loans/${loan._id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(`/loans/${loan._id}/edit`, '_blank')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(loan._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Monthly Payment:</span>
                      <p className="font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Interest:</span>
                      <p className="font-semibold">{formatCurrency(loan.totalInterest)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <p className="font-semibold">{formatCurrency(loan.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}