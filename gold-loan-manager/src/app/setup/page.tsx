'use client';

import { useState } from 'react';
import { Scale, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const setupUser = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/setup-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Default user created successfully!');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to create user');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during setup');
      console.error('Setup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Scale className="h-12 w-12 text-yellow-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Gold Loan Manager Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Initialize your application with a default user account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10 border border-gray-200">
          
          {status === 'idle' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Setup Instructions:</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>This will create a default user account for your Gold Loan Manager application.</p>
                  <p><span className="font-medium">Email:</span> admin@goldloan.com</p>
                  <p><span className="font-medium">Password:</span> admin123</p>
                </div>
              </div>

              <button
                onClick={setupUser}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                Create Default User
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Setting up user account...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Setup Complete!</h3>
                <p className="text-sm text-green-700 mt-2">{message}</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-green-800 mb-2">Login Credentials:</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><span className="font-medium">Email:</span> admin@goldloan.com</p>
                  <p><span className="font-medium">Password:</span> admin123</p>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Setup Failed</h3>
                <p className="text-sm text-red-700 mt-2">{message}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={setupUser}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                >
                  Try Again
                </button>
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}