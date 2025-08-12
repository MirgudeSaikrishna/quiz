import mongoose, { Schema, Document } from 'mongoose';

export interface ILoan extends Document {
  type: 'taken' | 'given';
  principalAmount: number;
  interestRate: number;
  startDate: Date;
  endDate: Date;
  monthsRemaining: number;
  goldQuantity: number; // in grams
  goldPurity: number; // in percentage (e.g., 91.6 for 22K)
  borrowerName?: string; // for loans given
  lenderName?: string; // for loans taken
  status: 'active' | 'completed' | 'defaulted';
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['taken', 'given'],
    required: true
  },
  principalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  monthsRemaining: {
    type: Number,
    required: true,
    min: 0
  },
  goldQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  goldPurity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  borrowerName: {
    type: String,
    required: function() { return this.type === 'given'; }
  },
  lenderName: {
    type: String,
    required: function() { return this.type === 'taken'; }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'defaulted'],
    default: 'active'
  },
  monthlyPayment: {
    type: Number,
    required: true,
    min: 0
  },
  totalInterest: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Calculate derived fields before saving
LoanSchema.pre('save', function(next) {
  if (this.isModified('principalAmount') || this.isModified('interestRate') || this.isModified('monthsRemaining')) {
    const monthlyRate = this.interestRate / 100 / 12;
    const totalMonths = this.monthsRemaining;
    
    if (monthlyRate > 0) {
      this.monthlyPayment = (this.principalAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                           (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      this.monthlyPayment = this.principalAmount / totalMonths;
    }
    
    this.totalInterest = (this.monthlyPayment * totalMonths) - this.principalAmount;
    this.totalAmount = this.principalAmount + this.totalInterest;
  }
  next();
});

export default mongoose.models.Loan || mongoose.model<ILoan>('Loan', LoanSchema);