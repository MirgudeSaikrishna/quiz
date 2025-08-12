'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Coins, Users, Calendar } from 'lucide-react';

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

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="text-center text-red-600">
          Failed to load dashboard data
        </div>
      </Layout>
    );
  }

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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your gold loan portfolio</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Loans</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.summary.totalLoansTaken + dashboardData.summary.totalLoansGiven}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Coins className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Gold Position</p>
                <p className={`text-2xl font-semibold ${
                  dashboardData.gold.netGoldPosition >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatGold(dashboardData.gold.netGoldPosition)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Cash Flow</p>
                <p className={`text-2xl font-semibold ${
                  dashboardData.financials.netMonthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(dashboardData.financials.netMonthlyCashFlow)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loans Overview */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loans Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Loans Taken</span>
                <span className="font-semibold">{dashboardData.summary.totalLoansTaken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Loans Given</span>
                <span className="font-semibold">{dashboardData.summary.totalLoansGiven}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Loans Taken</span>
                <span className="font-semibold">{dashboardData.summary.activeLoansTaken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Loans Given</span>
                <span className="font-semibold">{dashboardData.summary.activeLoansGiven}</span>
              </div>
            </div>
          </Card>

          {/* Financial Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount Taken</span>
                <span className="font-semibold">{formatCurrency(dashboardData.financials.totalTakenAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount Given</span>
                <span className="font-semibold">{formatCurrency(dashboardData.financials.totalGivenAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interest Expense</span>
                <span className="font-semibold text-red-600">{formatCurrency(dashboardData.financials.totalInterestExpense)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interest Income</span>
                <span className="font-semibold text-green-600">{formatCurrency(dashboardData.financials.totalInterestIncome)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Gold Summary */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gold Portfolio</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Gold Taken</p>
              <p className="text-2xl font-semibold text-red-600">{formatGold(dashboardData.gold.totalGoldTaken)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Gold Given</p>
              <p className="text-2xl font-semibold text-green-600">{formatGold(dashboardData.gold.totalGoldGiven)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Net Position</p>
              <p className={`text-2xl font-semibold ${
                dashboardData.gold.netGoldPosition >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatGold(dashboardData.gold.netGoldPosition)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}