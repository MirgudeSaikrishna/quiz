'use client';

import { format } from 'date-fns';
import { Trash2, Edit, DollarSign, Calendar, Scale } from 'lucide-react';

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
  lenderName?: string;
  borrowerName?: string;
  description?: string;
  status: 'active' | 'paid' | 'overdue';
  createdAt: string;
}

interface LoanCardProps {
  loan: Loan;
  onEdit?: (loan: Loan) => void;
  onDelete?: (loanId: string) => void;
  onStatusChange?: (loanId: string, status: 'active' | 'paid' | 'overdue') => void;
}

export default function LoanCard({ loan, onEdit, onDelete, onStatusChange }: LoanCardProps) {
  // Calculate current interest and total amount
  const calculateCurrentInterest = () => {
    const monthsElapsed = Math.floor(
      (Date.now() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const monthlyInterestRate = loan.interestRate / 100 / 12;
    return loan.principalAmount * monthlyInterestRate * monthsElapsed;
  };

  const calculateTotalAmount = () => {
    return loan.principalAmount + calculateCurrentInterest();
  };

  const isOverdue = () => {
    return Date.now() > new Date(loan.endDate).getTime() && loan.status === 'active';
  };

  const currentInterest = calculateCurrentInterest();
  const totalAmount = calculateTotalAmount();
  const overdue = isOverdue();

  const getStatusColor = () => {
    if (overdue) return 'bg-red-100 text-red-800 border-red-200';
    if (loan.status === 'paid') return 'bg-green-100 text-green-800 border-green-200';
    if (loan.status === 'active') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeColor = () => {
    return loan.type === 'taken' 
      ? 'bg-orange-100 text-orange-800 border-orange-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor()}`}>
              {loan.type === 'taken' ? 'Loan Taken' : 'Loan Given'}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}>
              {overdue ? 'Overdue' : loan.status}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {loan.type === 'taken' ? loan.lenderName : loan.borrowerName}
          </h3>
        </div>
        
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(loan)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
              title="Edit loan"
            >
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(loan._id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              title="Delete loan"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Financial Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Principal</p>
            <p className="font-semibold text-gray-900">₹{loan.principalAmount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Current Interest</p>
            <p className="font-semibold text-blue-600">₹{currentInterest.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-semibold text-green-600">₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Gold Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
        <div className="flex items-center gap-2">
          <Scale size={16} className="text-yellow-600" />
          <div>
            <p className="text-sm text-gray-600">Gold Quantity</p>
            <p className="font-semibold text-gray-900">{loan.goldQuantity}g</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Scale size={16} className="text-yellow-600" />
          <div>
            <p className="text-sm text-gray-600">Gold Purity</p>
            <p className="font-semibold text-gray-900">{loan.goldPurity}K</p>
          </div>
        </div>
      </div>

      {/* Date Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium text-gray-900">{format(new Date(loan.startDate), 'MMM dd, yyyy')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium text-gray-900">{format(new Date(loan.endDate), 'MMM dd, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Interest Rate</p>
          <p className="font-medium text-gray-900">{loan.interestRate}% per annum</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Months Remaining</p>
          <p className="font-medium text-gray-900">{Math.max(0, loan.monthsRemaining)} months</p>
        </div>
      </div>

      {/* Description */}
      {loan.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-gray-700 text-sm">{loan.description}</p>
        </div>
      )}

      {/* Status Actions */}
      {onStatusChange && loan.status === 'active' && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onStatusChange(loan._id, 'paid')}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 text-sm"
          >
            Mark as Paid
          </button>
          {!overdue && (
            <button
              onClick={() => onStatusChange(loan._id, 'overdue')}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 text-sm"
            >
              Mark as Overdue
            </button>
          )}
        </div>
      )}
    </div>
  );
}