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
    const loans = await Loan.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ loans }, { status: 200 });
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return createUnauthorizedResponse();
    }

    await connectToDatabase();
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
      lenderName,
      borrowerName,
      description
    } = body;

    // Validate required fields
    if (!type || !principalAmount || !interestRate || !startDate || !endDate || 
        !goldQuantity || !goldPurity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const loan = new Loan({
      type,
      principalAmount,
      interestRate,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      monthsRemaining,
      goldQuantity,
      goldPurity,
      lenderName: type === 'taken' ? lenderName : undefined,
      borrowerName: type === 'given' ? borrowerName : undefined,
      description
    });

    await loan.save();
    
    return NextResponse.json({ loan }, { status: 201 });
  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json(
      { error: 'Failed to create loan' },
      { status: 500 }
    );
  }
}