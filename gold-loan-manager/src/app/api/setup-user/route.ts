import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'admin@goldloan.com' });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create default user
    const user = new User({
      email: 'admin@goldloan.com',
      password: 'admin123', // This will be hashed automatically
      name: 'Gold Loan Admin'
    });

    await user.save();
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        email: 'admin@goldloan.com',
        defaultPassword: 'admin123'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}