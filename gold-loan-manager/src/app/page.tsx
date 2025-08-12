'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Scale } from 'lucide-react';
import Link from 'next/link';

interface Analytics {
  summary: {
    totalLoans: number;
    activeLoansTaken: number;
    activeLoansGiven: number;
    netProfitLoss: number;
    totalIncomeFromGiven: number;
    totalExpenseFromTaken: number;
  };
  goldSummary: {
    totalGoldQuantityGiven: number;
    totalGoldQuantityTaken: number;
    netGoldPosition: number;
  };
  interestRates: {
    avgInterestRateGiven: number;
    avgInterestRateTaken: number;
    interestRateSpread: number;
  };
  loanBreakdown: {
    loansTakenCount: number;
    loansGivenCount: number;
    totalPrincipalTaken: number;
    totalPrincipalGiven: number;
  };
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics data.</p>
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
              <Scale className="h-8 w-8 text-yellow-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Gold Loan Manager</h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/loans"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Manage Loans
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile & P&L
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Loans */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Loans</dt>
                      <dd className="text-lg font-medium text-gray-900">{analytics.summary.totalLoans}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Loans Taken */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingDown className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Loans Taken</dt>
                      <dd className="text-lg font-medium text-gray-900">{analytics.summary.activeLoansTaken}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Loans Given */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Loans Given</dt>
                      <dd className="text-lg font-medium text-gray-900">{analytics.summary.activeLoansGiven}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Net P&L */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className={`h-6 w-6 ${analytics.summary.netProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Net P&L</dt>
                      <dd className={`text-lg font-medium ${analytics.summary.netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{Math.abs(analytics.summary.netProfitLoss).toLocaleString()}
                        {analytics.summary.netProfitLoss < 0 && ' Loss'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Income & Expenses */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                  <span className="text-sm font-medium text-green-800">Income from Loans Given</span>
                  <span className="text-sm font-semibold text-green-900">
                    ₹{analytics.summary.totalIncomeFromGiven.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                  <span className="text-sm font-medium text-red-800">Expenses from Loans Taken</span>
                  <span className="text-sm font-semibold text-red-900">
                    ₹{analytics.summary.totalExpenseFromTaken.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md border-2 border-blue-200">
                  <span className="text-sm font-medium text-blue-800">Net Position</span>
                  <span className={`text-sm font-semibold ${analytics.summary.netProfitLoss >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                    ₹{Math.abs(analytics.summary.netProfitLoss).toLocaleString()}
                    {analytics.summary.netProfitLoss < 0 ? ' Loss' : ' Profit'}
                  </span>
                </div>
              </div>
            </div>

            {/* Gold Summary */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Gold Portfolio</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md">
                  <span className="text-sm font-medium text-yellow-800">Gold Given Out</span>
                  <span className="text-sm font-semibold text-yellow-900">
                    {analytics.goldSummary.totalGoldQuantityGiven.toLocaleString()}g
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md">
                  <span className="text-sm font-medium text-yellow-800">Gold Taken as Collateral</span>
                  <span className="text-sm font-semibold text-yellow-900">
                    {analytics.goldSummary.totalGoldQuantityTaken.toLocaleString()}g
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-md border-2 border-amber-200">
                  <span className="text-sm font-medium text-amber-800">Net Gold Position</span>
                  <span className={`text-sm font-semibold ${analytics.goldSummary.netGoldPosition >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                    {Math.abs(analytics.goldSummary.netGoldPosition).toLocaleString()}g
                    {analytics.goldSummary.netGoldPosition < 0 ? ' Deficit' : ' Surplus'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/loans?action=add"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Loan
              </Link>
              <Link
                href="/loans"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                View All Loans
              </Link>
              <Link
                href="/profile"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                View P&L Report
              </Link>
            </div>
          </div>

          {/* Interest Rate Analysis */}
          {analytics.interestRates.avgInterestRateGiven > 0 && (
            <div className="mt-6 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Interest Rate Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">Avg. Rate Given</p>
                  <p className="text-xl font-semibold text-gray-900">{analytics.interestRates.avgInterestRateGiven.toFixed(2)}%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">Avg. Rate Taken</p>
                  <p className="text-xl font-semibold text-gray-900">{analytics.interestRates.avgInterestRateTaken.toFixed(2)}%</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-600">Interest Spread</p>
                  <p className={`text-xl font-semibold ${analytics.interestRates.interestRateSpread >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.interestRates.interestRateSpread.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
