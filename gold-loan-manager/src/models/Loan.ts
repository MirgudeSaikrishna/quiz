import mongoose, { Document, Schema } from 'mongoose';

export interface ILoan extends Document {
  type: 'taken' | 'given';
  principalAmount: number;
  interestRate: number;
  startDate: Date;
  endDate: Date;
  monthsRemaining: number;
  goldQuantity: number; // in grams
  goldPurity: number; // in karats (e.g., 22, 24)
  lenderName?: string; // for loans taken
  borrowerName?: string; // for loans given
  description?: string;
  status: 'active' | 'paid' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>({
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
    min: 0,
    max: 100
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
    min: 1,
    max: 24
  },
  lenderName: {
    type: String,
    required: function(this: ILoan) {
      return this.type === 'taken';
    }
  },
  borrowerName: {
    type: String,
    required: function(this: ILoan) {
      return this.type === 'given';
    }
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'paid', 'overdue'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Calculate current interest and total amount
LoanSchema.methods.calculateCurrentInterest = function(): number {
  const monthsElapsed = Math.floor((Date.now() - this.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const monthlyInterestRate = this.interestRate / 100 / 12;
  return this.principalAmount * monthlyInterestRate * monthsElapsed;
};

LoanSchema.methods.calculateTotalAmount = function(): number {
  return this.principalAmount + this.calculateCurrentInterest();
};

// Check if loan is overdue
LoanSchema.methods.isOverdue = function(): boolean {
  return Date.now() > this.endDate.getTime() && this.status === 'active';
};

export default mongoose.models.Loan || mongoose.model<ILoan>('Loan', LoanSchema);