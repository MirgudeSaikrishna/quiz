'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Scale, Calendar, PieChart } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

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

interface Loan {
  _id: string;
  type: 'taken' | 'given';
  principalAmount: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  goldQuantity: number;
  goldPurity: number;
  lenderName?: string;
  borrowerName?: string;
  status: 'active' | 'paid' | 'overdue';
}

export default function ProfilePage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsResponse, loansResponse] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/loans')
      ]);
      
      const analyticsData = await analyticsResponse.json();
      const loansData = await loansResponse.json();
      
      setAnalytics(analyticsData.analytics);
      setLoans(loansData.loans);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLoanInterest = (loan: Loan) => {
    const monthsElapsed = Math.floor(
      (Date.now() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const monthlyInterestRate = loan.interestRate / 100 / 12;
    return loan.principalAmount * monthlyInterestRate * monthsElapsed;
  };

  const getTopPerformingLoans = () => {
    const activeLoansGiven = loans
      .filter(loan => loan.type === 'given' && loan.status === 'active')
      .map(loan => ({
        ...loan,
        currentInterest: calculateLoanInterest(loan),
        roi: (calculateLoanInterest(loan) / loan.principalAmount) * 100
      }))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5);

    return activeLoansGiven;
  };

  const getMostExpensiveLoans = () => {
    const activeLoansTaken = loans
      .filter(loan => loan.type === 'taken' && loan.status === 'active')
      .map(loan => ({
        ...loan,
        currentInterest: calculateLoanInterest(loan),
        costPercentage: (calculateLoanInterest(loan) / loan.principalAmount) * 100
      }))
      .sort((a, b) => b.costPercentage - a.costPercentage)
      .slice(0, 5);

    return activeLoansTaken;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile data.</p>
        </div>
      </div>
    );
  }

  const topPerformingLoans = getTopPerformingLoans();
  const mostExpensiveLoans = getMostExpensiveLoans();

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
              <h1 className="text-2xl font-bold text-gray-900">Profile & P&L Analysis</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* P&L Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Income Card */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                      <dd className="text-2xl font-bold text-green-600">
                        ₹{analytics.summary.totalIncomeFromGiven.toLocaleString()}
                      </dd>
                      <dd className="text-xs text-gray-400">From {analytics.summary.activeLoansGiven} active loans given</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Card */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingDown className="h-8 w-8 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                      <dd className="text-2xl font-bold text-red-600">
                        ₹{analytics.summary.totalExpenseFromTaken.toLocaleString()}
                      </dd>
                      <dd className="text-xs text-gray-400">From {analytics.summary.activeLoansTaken} active loans taken</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Net P&L Card */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className={`h-8 w-8 ${analytics.summary.netProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Net P&L</dt>
                      <dd className={`text-2xl font-bold ${analytics.summary.netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{Math.abs(analytics.summary.netProfitLoss).toLocaleString()}
                      </dd>
                      <dd className="text-xs text-gray-400">
                        {analytics.summary.netProfitLoss >= 0 ? 'Profit' : 'Loss'} 
                        {analytics.summary.totalIncomeFromGiven > 0 && 
                          ` (${((Math.abs(analytics.summary.netProfitLoss) / analytics.summary.totalIncomeFromGiven) * 100).toFixed(1)}%)`
                        }
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Portfolio Breakdown */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Portfolio Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Principal Given Out</p>
                    <p className="text-xs text-blue-600">Investment in loans</p>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">
                    ₹{analytics.loanBreakdown.totalPrincipalGiven.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-red-800">Principal Borrowed</p>
                    <p className="text-xs text-red-600">Liabilities</p>
                  </div>
                  <p className="text-lg font-semibold text-red-900">
                    ₹{analytics.loanBreakdown.totalPrincipalTaken.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md border-2 border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Net Principal Position</p>
                    <p className="text-xs text-gray-600">Assets - Liabilities</p>
                  </div>
                  <p className={`text-lg font-semibold ${(analytics.loanBreakdown.totalPrincipalGiven - analytics.loanBreakdown.totalPrincipalTaken) >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                    ₹{Math.abs(analytics.loanBreakdown.totalPrincipalGiven - analytics.loanBreakdown.totalPrincipalTaken).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Gold Portfolio */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Scale className="h-5 w-5 mr-2 text-yellow-600" />
                Gold Portfolio
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Gold Assets</p>
                    <p className="text-xs text-yellow-600">Gold held as collateral</p>
                  </div>
                  <p className="text-lg font-semibold text-yellow-900">
                    {analytics.goldSummary.totalGoldQuantityTaken.toLocaleString()}g
                  </p>
                </div>
                <div className="flex justify-between items-center p-4 bg-amber-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-amber-800">Gold Liabilities</p>
                    <p className="text-xs text-amber-600">Gold given as collateral</p>
                  </div>
                  <p className="text-lg font-semibold text-amber-900">
                    {analytics.goldSummary.totalGoldQuantityGiven.toLocaleString()}g
                  </p>
                </div>
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-md border-2 border-orange-200">
                  <div>
                    <p className="text-sm font-medium text-orange-800">Net Gold Position</p>
                    <p className="text-xs text-orange-600">Physical gold balance</p>
                  </div>
                  <p className={`text-lg font-semibold ${analytics.goldSummary.netGoldPosition >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                    {Math.abs(analytics.goldSummary.netGoldPosition).toLocaleString()}g
                    {analytics.goldSummary.netGoldPosition < 0 ? ' Deficit' : ' Surplus'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interest Rate Analysis */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Interest Rate Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-md">
                <p className="text-2xl font-bold text-green-600">{analytics.interestRates.avgInterestRateGiven.toFixed(2)}%</p>
                <p className="text-sm text-green-800">Avg. Rate Charged</p>
                <p className="text-xs text-green-600">On loans given</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-md">
                <p className="text-2xl font-bold text-red-600">{analytics.interestRates.avgInterestRateTaken.toFixed(2)}%</p>
                <p className="text-sm text-red-800">Avg. Rate Paid</p>
                <p className="text-xs text-red-600">On loans taken</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-md">
                <p className={`text-2xl font-bold ${analytics.interestRates.interestRateSpread >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.interestRates.interestRateSpread.toFixed(2)}%
                </p>
                <p className="text-sm text-blue-800">Interest Spread</p>
                <p className="text-xs text-blue-600">Charged - Paid</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-md">
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.summary.totalIncomeFromGiven > 0 ? 
                    ((analytics.summary.netProfitLoss / analytics.summary.totalIncomeFromGiven) * 100).toFixed(1) : '0'
                  }%
                </p>
                <p className="text-sm text-purple-800">Profit Margin</p>
                <p className="text-xs text-purple-600">Net P&L / Income</p>
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Loans */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Loans (Given)</h3>
              {topPerformingLoans.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active loans given</p>
              ) : (
                <div className="space-y-3">
                  {topPerformingLoans.map((loan, index) => (
                    <div key={loan._id} className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          #{index + 1} {loan.borrowerName}
                        </p>
                        <p className="text-xs text-green-600">
                          ₹{loan.principalAmount.toLocaleString()} @ {loan.interestRate}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-900">
                          ₹{loan.currentInterest.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">{loan.roi.toFixed(1)}% ROI</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Most Expensive Loans */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Most Expensive Loans (Taken)</h3>
              {mostExpensiveLoans.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active loans taken</p>
              ) : (
                <div className="space-y-3">
                  {mostExpensiveLoans.map((loan, index) => (
                    <div key={loan._id} className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          #{index + 1} {loan.lenderName}
                        </p>
                        <p className="text-xs text-red-600">
                          ₹{loan.principalAmount.toLocaleString()} @ {loan.interestRate}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-900">
                          ₹{loan.currentInterest.toLocaleString()}
                        </p>
                        <p className="text-xs text-red-600">{loan.costPercentage.toFixed(1)}% cost</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <p className="font-semibold text-gray-900">{analytics.summary.totalLoans}</p>
                <p className="text-gray-600">Total Loans</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <p className="font-semibold text-gray-900">{analytics.loanBreakdown.loansGivenCount}</p>
                <p className="text-gray-600">Loans Given</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <p className="font-semibold text-gray-900">{analytics.loanBreakdown.loansTakenCount}</p>
                <p className="text-gray-600">Loans Taken</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <p className="font-semibold text-gray-900">
                  {format(new Date(), 'MMM dd, yyyy')}
                </p>
                <p className="text-gray-600">Report Date</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}