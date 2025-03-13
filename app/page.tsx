'use client';

import { useState } from 'react';
import CouponCard from '@/components/CouponCard';
import { Coupon } from '@/types';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [previousCoupon, setPreviousCoupon] = useState<string | null>(null);

  const claimCoupon = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/coupons/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message);
        if (data.waitTimeMinutes) {
          setWaitTime(data.waitTimeMinutes);
          setPreviousCoupon(data.previousCoupon);
        }
        return;
      }
      
      setSuccess(data.message);
      setCoupon(data.coupon);
      setWaitTime(null);
      setPreviousCoupon(null);
    } catch (err) {
      setError('An error occurred while claiming the coupon. Please try again.');
      console.error('Error claiming coupon:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 sm:p-24">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            Coupon Distribution
          </h1>
          <p className="text-blue-100 mt-2 text-center text-sm">
            Claim your exclusive discount coupon
          </p>
        </div>
        
        <div className="p-6 sm:p-8">
          <p className="text-gray-600 mb-8 text-center">
            Click the button below to claim your coupon. Each user can claim one coupon per hour.
          </p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 transition-opacity duration-300 ease-in" role="alert">
              <p className="font-medium">{error}</p>
              {waitTime && previousCoupon && (
                <div className="mt-2 text-sm">
                  <p>Your previous coupon: <span className="font-bold text-red-600">{previousCoupon}</span></p>
                  <p className="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    You can claim another coupon in <span className="font-bold ml-1">{waitTime} minute(s)</span>
                  </p>
                </div>
              )}
            </div>
          )}
          
          {success && coupon && (
            <div className="mb-6 transition-opacity duration-300 ease-in">
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
                <p className="font-medium">{success}</p>
              </div>
              <CouponCard coupon={coupon} />
            </div>
          )}
          
          <button
            onClick={claimCoupon}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Claiming...
              </span>
            ) : (
              'Claim Your Coupon'
            )}
          </button>
          
          <p className="text-xs text-gray-500 mt-6 text-center flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            This system uses IP tracking and cookies to prevent abuse
          </p>
        </div>
      </div>
    </main>
  );
}
