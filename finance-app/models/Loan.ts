import { Schema, model, models } from 'mongoose';

export interface ILoan {
  type: 'taken' | 'given';
  principal: number;
  interestRate: number; // annual rate in percent
  date: Date;
  monthsRemaining: number;
  goldQuantity: number; // grams or appropriate unit
}

const LoanSchema = new Schema<ILoan>(
  {
    type: {
      type: String,
      enum: ['taken', 'given'],
      required: true,
    },
    principal: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    monthsRemaining: {
      type: Number,
      required: true,
    },
    goldQuantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Loan = models.Loan || model<ILoan>('Loan', LoanSchema);

export default Loan;