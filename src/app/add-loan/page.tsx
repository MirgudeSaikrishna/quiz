'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, AlertCircle } from 'lucide-react';

export default function AddLoan() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    type: 'taken',
    principalAmount: '',
    interestRate: '',
    startDate: '',
    endDate: '',
    monthsRemaining: '',
    goldQuantity: '',
    goldPurity: '91.6', // Default to 22K gold
    borrowerName: '',
    lenderName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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

    if (!formData.monthsRemaining || parseInt(formData.monthsRemaining) <= 0) {
      newErrors.monthsRemaining = 'Months remaining must be greater than 0';
    }

    if (!formData.goldQuantity || parseFloat(formData.goldQuantity) <= 0) {
      newErrors.goldQuantity = 'Gold quantity must be greater than 0';
    }

    if (!formData.goldPurity || parseFloat(formData.goldPurity) <= 0 || parseFloat(formData.goldPurity) > 100) {
      newErrors.goldPurity = 'Gold purity must be between 0 and 100';
    }

    if (formData.type === 'given' && !formData.borrowerName.trim()) {
      newErrors.borrowerName = 'Borrower name is required for loans given';
    }

    if (formData.type === 'taken' && !formData.lenderName.trim()) {
      newErrors.lenderName = 'Lender name is required for loans taken';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          principalAmount: parseFloat(formData.principalAmount),
          interestRate: parseFloat(formData.interestRate),
          monthsRemaining: parseInt(formData.monthsRemaining),
          goldQuantity: parseFloat(formData.goldQuantity),
          goldPurity: parseFloat(formData.goldPurity),
        }),
      });

      if (response.ok) {
        router.push('/loans');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Failed to create loan' });
      }
    } catch (error) {
      setErrors({ submit: 'Failed to create loan. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Loan</h1>
          <p className="text-gray-600">Enter the details for your new gold loan</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="taken">Loan Taken (You borrowed money)</option>
                <option value="given">Loan Given (You lent money)</option>
              </select>
            </div>

            {/* Principal Amount */}
            <Input
              label="Principal Amount (₹)"
              name="principalAmount"
              type="number"
              value={formData.principalAmount}
              onChange={handleInputChange}
              placeholder="100000"
              error={errors.principalAmount}
            />

            {/* Interest Rate */}
            <Input
              label="Interest Rate (% per annum)"
              name="interestRate"
              type="number"
              value={formData.interestRate}
              onChange={handleInputChange}
              placeholder="12"
              step="0.01"
              error={errors.interestRate}
            />

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                error={errors.startDate}
              />
              <Input
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                error={errors.endDate}
              />
            </div>

            {/* Months Remaining */}
            <Input
              label="Months Remaining"
              name="monthsRemaining"
              type="number"
              value={formData.monthsRemaining}
              onChange={handleInputChange}
              placeholder="12"
              error={errors.monthsRemaining}
            />

            {/* Gold Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Gold Quantity (grams)"
                name="goldQuantity"
                type="number"
                value={formData.goldQuantity}
                onChange={handleInputChange}
                placeholder="10.5"
                step="0.01"
                error={errors.goldQuantity}
              />
              <Input
                label="Gold Purity (%)"
                name="goldPurity"
                type="number"
                value={formData.goldPurity}
                onChange={handleInputChange}
                placeholder="91.6"
                step="0.1"
                error={errors.goldPurity}
              />
            </div>

            {/* Name Fields */}
            {formData.type === 'given' && (
              <Input
                label="Borrower Name"
                name="borrowerName"
                type="text"
                value={formData.borrowerName}
                onChange={handleInputChange}
                placeholder="Enter borrower's name"
                error={errors.borrowerName}
              />
            )}

            {formData.type === 'taken' && (
              <Input
                label="Lender Name"
                name="lenderName"
                type="text"
                value={formData.lenderName}
                onChange={handleInputChange}
                placeholder="Enter lender's name"
                error={errors.lenderName}
              />
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm text-red-600">{errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/loans')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center"
              >
                {loading ? (
                  'Creating...'
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Loan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}