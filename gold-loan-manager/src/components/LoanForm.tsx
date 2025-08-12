'use client';

import { useState } from 'react';
import { format } from 'date-fns';

interface LoanFormProps {
  onSubmit: (loanData: any) => void;
  onCancel: () => void;
}

export default function LoanForm({ onSubmit, onCancel }: LoanFormProps) {
  const [formData, setFormData] = useState({
    type: 'taken' as 'taken' | 'given',
    principalAmount: '',
    interestRate: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    monthsRemaining: '',
    goldQuantity: '',
    goldPurity: '22',
    lenderName: '',
    borrowerName: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.principalAmount || parseFloat(formData.principalAmount) <= 0) {
      newErrors.principalAmount = 'Principal amount must be greater than 0';
    }

    if (!formData.interestRate || parseFloat(formData.interestRate) < 0) {
      newErrors.interestRate = 'Interest rate must be 0 or greater';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.goldQuantity || parseFloat(formData.goldQuantity) <= 0) {
      newErrors.goldQuantity = 'Gold quantity must be greater than 0';
    }

    if (!formData.goldPurity || parseFloat(formData.goldPurity) < 1 || parseFloat(formData.goldPurity) > 24) {
      newErrors.goldPurity = 'Gold purity must be between 1 and 24 karats';
    }

    if (formData.type === 'taken' && !formData.lenderName.trim()) {
      newErrors.lenderName = 'Lender name is required for loans taken';
    }

    if (formData.type === 'given' && !formData.borrowerName.trim()) {
      newErrors.borrowerName = 'Borrower name is required for loans given';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Calculate months remaining
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const monthsRemaining = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));

    const loanData = {
      ...formData,
      principalAmount: parseFloat(formData.principalAmount),
      interestRate: parseFloat(formData.interestRate),
      monthsRemaining: Math.max(0, monthsRemaining),
      goldQuantity: parseFloat(formData.goldQuantity),
      goldPurity: parseFloat(formData.goldPurity)
    };

    onSubmit(loanData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="taken">Loan Taken</option>
            <option value="given">Loan Given</option>
          </select>
        </div>

        {/* Principal Amount */}
        <div>
          <label htmlFor="principalAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Principal Amount (₹)
          </label>
          <input
            type="number"
            id="principalAmount"
            name="principalAmount"
            value={formData.principalAmount}
            onChange={handleInputChange}
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.principalAmount ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.principalAmount && <p className="mt-1 text-sm text-red-600">{errors.principalAmount}</p>}
        </div>

        {/* Interest Rate */}
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (% per annum)
          </label>
          <input
            type="number"
            id="interestRate"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            max="100"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.interestRate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.interestRate && <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>}
        </div>

        {/* Gold Quantity */}
        <div>
          <label htmlFor="goldQuantity" className="block text-sm font-medium text-gray-700 mb-2">
            Gold Quantity (grams)
          </label>
          <input
            type="number"
            id="goldQuantity"
            name="goldQuantity"
            value={formData.goldQuantity}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.goldQuantity ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.goldQuantity && <p className="mt-1 text-sm text-red-600">{errors.goldQuantity}</p>}
        </div>

        {/* Gold Purity */}
        <div>
          <label htmlFor="goldPurity" className="block text-sm font-medium text-gray-700 mb-2">
            Gold Purity (karats)
          </label>
          <select
            id="goldPurity"
            name="goldPurity"
            value={formData.goldPurity}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.goldPurity ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="22">22K</option>
            <option value="24">24K</option>
            <option value="18">18K</option>
            <option value="14">14K</option>
            <option value="10">10K</option>
          </select>
          {errors.goldPurity && <p className="mt-1 text-sm text-red-600">{errors.goldPurity}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.startDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.endDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
        </div>

        {/* Conditional Name Field */}
        {formData.type === 'taken' ? (
          <div>
            <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-2">
              Lender Name
            </label>
            <input
              type="text"
              id="lenderName"
              name="lenderName"
              value={formData.lenderName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.lenderName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.lenderName && <p className="mt-1 text-sm text-red-600">{errors.lenderName}</p>}
          </div>
        ) : (
          <div>
            <label htmlFor="borrowerName" className="block text-sm font-medium text-gray-700 mb-2">
              Borrower Name
            </label>
            <input
              type="text"
              id="borrowerName"
              name="borrowerName"
              value={formData.borrowerName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.borrowerName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.borrowerName && <p className="mt-1 text-sm text-red-600">{errors.borrowerName}</p>}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional notes about the loan..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Add Loan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}