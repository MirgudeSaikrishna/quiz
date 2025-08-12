import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Loan from '@/models/Loan';
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return createUnauthorizedResponse();
    }

    await connectToDatabase();
    const loans = await Loan.find({});
    
    let totalIncomeFromGiven = 0;
    let totalExpenseFromTaken = 0;
    let totalGoldQuantityGiven = 0;
    let totalGoldQuantityTaken = 0;
    let activeLoansGiven = 0;
    let activeLoansTaken = 0;
    
    const loansTaken = loans.filter(loan => loan.type === 'taken');
    const loansGiven = loans.filter(loan => loan.type === 'given');
    
    // Calculate income from loans given
    loansGiven.forEach(loan => {
      if (loan.status === 'active') {
        activeLoansGiven++;
        const monthsElapsed = Math.floor((Date.now() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
        const monthlyInterestRate = loan.interestRate / 100 / 12;
        const interestEarned = loan.principalAmount * monthlyInterestRate * monthsElapsed;
        totalIncomeFromGiven += interestEarned;
      }
      totalGoldQuantityGiven += loan.goldQuantity;
    });
    
    // Calculate expenses from loans taken
    loansTaken.forEach(loan => {
      if (loan.status === 'active') {
        activeLoansTaken++;
        const monthsElapsed = Math.floor((Date.now() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
        const monthlyInterestRate = loan.interestRate / 100 / 12;
        const interestPaid = loan.principalAmount * monthlyInterestRate * monthsElapsed;
        totalExpenseFromTaken += interestPaid;
      }
      totalGoldQuantityTaken += loan.goldQuantity;
    });
    
    const netProfitLoss = totalIncomeFromGiven - totalExpenseFromTaken;
    
    // Calculate average interest rates
    const avgInterestRateGiven = loansGiven.length > 0 
      ? loansGiven.reduce((sum, loan) => sum + loan.interestRate, 0) / loansGiven.length 
      : 0;
    
    const avgInterestRateTaken = loansTaken.length > 0 
      ? loansTaken.reduce((sum, loan) => sum + loan.interestRate, 0) / loansTaken.length 
      : 0;
    
    const analytics = {
      summary: {
        totalLoans: loans.length,
        activeLoansTaken,
        activeLoansGiven,
        netProfitLoss,
        totalIncomeFromGiven,
        totalExpenseFromTaken
      },
      goldSummary: {
        totalGoldQuantityGiven,
        totalGoldQuantityTaken,
        netGoldPosition: totalGoldQuantityGiven - totalGoldQuantityTaken
      },
      interestRates: {
        avgInterestRateGiven,
        avgInterestRateTaken,
        interestRateSpread: avgInterestRateGiven - avgInterestRateTaken
      },
      loanBreakdown: {
        loansTakenCount: loansTaken.length,
        loansGivenCount: loansGiven.length,
        totalPrincipalTaken: loansTaken.reduce((sum, loan) => sum + loan.principalAmount, 0),
        totalPrincipalGiven: loansGiven.reduce((sum, loan) => sum + loan.principalAmount, 0)
      }
    };
    
    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}