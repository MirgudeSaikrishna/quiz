'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Coins, Calendar, PieChart } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardData {
  summary: {
    totalLoansTaken: number;
    totalLoansGiven: number;
    activeLoansTaken: number;
    activeLoansGiven: number;
  };
  financials: {
    totalTakenAmount: number;
    totalGivenAmount: number;
    totalInterestExpense: number;
    totalInterestIncome: number;
    netProfitLoss: number;
    monthlyExpenses: number;
    monthlyIncome: number;
    netMonthlyCashFlow: number;
  };
  gold: {
    totalGoldTaken: number;
    totalGoldGiven: number;
    netGoldPosition: number;
  };
}

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

export default function Profile() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardResponse, loansResponse] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/loans')
      ]);
      
      const dashboardData = await dashboardResponse.json();
      const loansData = await loansResponse.json();
      
      setDashboardData(dashboardData);
      setLoans(loansData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const getMonthlyExpenses = () => {
    return loans
      .filter(loan => loan.type === 'taken' && loan.status === 'active')
      .reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  };

  const getMonthlyIncome = () => {
    return loans
      .filter(loan => loan.type === 'given' && loan.status === 'active')
      .reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  };

  const getUpcomingPayments = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    return loans
      .filter(loan => loan.status === 'active')
      .map(loan => ({
        ...loan,
        nextPaymentDate: nextMonth,
        amount: loan.monthlyPayment,
        type: loan.type
      }))
      .sort((a, b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime())
      .slice(0, 5);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="text-center text-red-600">
          Failed to load profile data
        </div>
      </Layout>
    );
  }

  const monthlyExpenses = getMonthlyExpenses();
  const monthlyIncome = getMonthlyIncome();
  const netMonthlyCashFlow = monthlyIncome - monthlyExpenses;
  const upcomingPayments = getUpcomingPayments();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Profile</h1>
          <p className="text-gray-600">Detailed analysis of your gold loan portfolio</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-semibold text-green-600">
                  {formatCurrency(dashboardData.financials.totalInterestIncome)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-semibold text-red-600">
                  {formatCurrency(dashboardData.financials.totalInterestExpense)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net P&L</p>
                <p className={`text-2xl font-semibold ${
                  dashboardData.financials.netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(dashboardData.financials.netProfitLoss)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Cash Flow</p>
                <p className={`text-2xl font-semibold ${
                  netMonthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(netMonthlyCashFlow)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Interest Income</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(dashboardData.financials.totalInterestIncome)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: formatPercentage(
                        dashboardData.financials.totalInterestIncome, 
                        dashboardData.financials.totalInterestIncome + dashboardData.financials.totalInterestExpense
                      )
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Interest Expense</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(dashboardData.financials.totalInterestExpense)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ 
                      width: formatPercentage(
                        dashboardData.financials.totalInterestExpense, 
                        dashboardData.financials.totalInterestIncome + dashboardData.financials.totalInterestExpense
                      )
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Monthly Cash Flow */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cash Flow</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Monthly Income</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(monthlyIncome)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: formatPercentage(monthlyIncome, monthlyIncome + monthlyExpenses)
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Monthly Expenses</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(monthlyExpenses)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ 
                      width: formatPercentage(monthlyExpenses, monthlyIncome + monthlyExpenses)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Gold Portfolio Analysis */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gold Portfolio Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Coins className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Gold Taken</p>
              <p className="text-2xl font-semibold text-red-600">
                {formatGold(dashboardData.gold.totalGoldTaken)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatPercentage(dashboardData.gold.totalGoldTaken, dashboardData.gold.totalGoldTaken + dashboardData.gold.totalGoldGiven)} of total
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Coins className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Gold Given</p>
              <p className="text-2xl font-semibold text-green-600">
                {formatGold(dashboardData.gold.totalGoldGiven)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatPercentage(dashboardData.gold.totalGoldGiven, dashboardData.gold.totalGoldTaken + dashboardData.gold.totalGoldGiven)} of total
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <PieChart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Net Position</p>
              <p className={`text-2xl font-semibold ${
                dashboardData.gold.netGoldPosition >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatGold(dashboardData.gold.netGoldPosition)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData.gold.netGoldPosition >= 0 ? 'Positive' : 'Negative'} balance
              </p>
            </div>
          </div>
        </Card>

        {/* Upcoming Payments */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments (Next Month)</h3>
          <div className="space-y-3">
            {upcomingPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming payments</p>
            ) : (
              upcomingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded ${
                      payment.type === 'given' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {payment.type === 'given' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {payment.type === 'given' ? payment.borrowerName : payment.lenderName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(payment.nextPaymentDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      payment.type === 'given' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {payment.type === 'given' ? '+' : '-'}{formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.type === 'given' ? 'Income' : 'Expense'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}