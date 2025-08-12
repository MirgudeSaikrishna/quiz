import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Loan from '@/models/Loan';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all loans
    const loans = await Loan.find({});
    
    // Calculate statistics
    const loansTaken = loans.filter(loan => loan.type === 'taken');
    const loansGiven = loans.filter(loan => loan.type === 'given');
    
    // Total amounts
    const totalTakenAmount = loansTaken.reduce((sum, loan) => sum + loan.principalAmount, 0);
    const totalGivenAmount = loansGiven.reduce((sum, loan) => sum + loan.principalAmount, 0);
    
    // Total interest expenses (loans taken)
    const totalInterestExpense = loansTaken.reduce((sum, loan) => sum + loan.totalInterest, 0);
    
    // Total interest income (loans given)
    const totalInterestIncome = loansGiven.reduce((sum, loan) => sum + loan.totalInterest, 0);
    
    // Net P&L
    const netProfitLoss = totalInterestIncome - totalInterestExpense;
    
    // Gold quantities
    const totalGoldTaken = loansTaken.reduce((sum, loan) => sum + loan.goldQuantity, 0);
    const totalGoldGiven = loansGiven.reduce((sum, loan) => sum + loan.goldQuantity, 0);
    const netGoldPosition = totalGoldGiven - totalGoldTaken;
    
    // Active loans
    const activeLoansTaken = loansTaken.filter(loan => loan.status === 'active');
    const activeLoansGiven = loansGiven.filter(loan => loan.status === 'active');
    
    // Monthly cash flows
    const monthlyExpenses = activeLoansTaken.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
    const monthlyIncome = activeLoansGiven.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
    const netMonthlyCashFlow = monthlyIncome - monthlyExpenses;
    
    return NextResponse.json({
      summary: {
        totalLoansTaken: loansTaken.length,
        totalLoansGiven: loansGiven.length,
        activeLoansTaken: activeLoansTaken.length,
        activeLoansGiven: activeLoansGiven.length,
      },
      financials: {
        totalTakenAmount,
        totalGivenAmount,
        totalInterestExpense,
        totalInterestIncome,
        netProfitLoss,
        monthlyExpenses,
        monthlyIncome,
        netMonthlyCashFlow,
      },
      gold: {
        totalGoldTaken,
        totalGoldGiven,
        netGoldPosition,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}