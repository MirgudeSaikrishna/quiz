import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Loan from '@/models/Loan';

export async function GET() {
  try {
    await dbConnect();
    const loans = await Loan.find({}).sort({ createdAt: -1 });
    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const {
      type,
      principalAmount,
      interestRate,
      startDate,
      endDate,
      monthsRemaining,
      goldQuantity,
      goldPurity,
      borrowerName,
      lenderName
    } = body;

    // Validate required fields
    if (!type || !principalAmount || !interestRate || !startDate || !endDate || 
        !monthsRemaining || !goldQuantity || !goldPurity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate type-specific fields
    if (type === 'given' && !borrowerName) {
      return NextResponse.json({ error: 'Borrower name is required for loans given' }, { status: 400 });
    }

    if (type === 'taken' && !lenderName) {
      return NextResponse.json({ error: 'Lender name is required for loans taken' }, { status: 400 });
    }

    const loan = new Loan({
      type,
      principalAmount: parseFloat(principalAmount),
      interestRate: parseFloat(interestRate),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      monthsRemaining: parseInt(monthsRemaining),
      goldQuantity: parseFloat(goldQuantity),
      goldPurity: parseFloat(goldPurity),
      borrowerName,
      lenderName
    });

    await loan.save();
    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json({ error: 'Failed to create loan' }, { status: 500 });
  }
}