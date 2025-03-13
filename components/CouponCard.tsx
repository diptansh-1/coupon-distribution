import React from 'react';
import { Coupon } from '@/types';

interface CouponCardProps {
  coupon: Coupon;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
      {/* Decorative elements */}
      <div className="absolute -left-6 -top-6 w-12 h-12 bg-indigo-100 rounded-full opacity-70"></div>
      <div className="absolute -right-6 -bottom-6 w-12 h-12 bg-blue-100 rounded-full opacity-70"></div>
      
      {/* Coupon header */}
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white text-center">
        <div className="text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">Exclusive Discount</div>
        <h3 className="text-xl font-bold">Your Coupon</h3>
      </div>
      
      {/* Coupon content */}
      <div className="p-6">
        <div className="flex justify-center">
          <div className="relative">
            {/* Dashed border effect around code */}
            <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg transform -rotate-1"></div>
            <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 font-mono font-bold text-xl text-blue-800 py-3 px-6 rounded-lg shadow-sm transform rotate-1 transition-all duration-200 hover:-rotate-1">
              {coupon.code}
            </div>
          </div>
        </div>
        
        {coupon.description && (
          <p className="text-gray-700 text-center mt-5 font-medium">{coupon.description}</p>
        )}
        
        {/* Scissors and dotted line effect */}
        <div className="relative my-6">
          <div className="border-t border-dashed border-gray-300 my-4"></div>
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.5 13a3.5 3.5 0 01-3.163-5.001L.342 5.008a1 1 0 011.316-1.316L4.65 6.684A3.5 3.5 0 115.5 13zm5 0a3.5 3.5 0 01-3.163-5.001L5.342 5.008a1 1 0 011.316-1.316L9.65 6.684A3.5 3.5 0 1110.5 13zm5 0a3.5 3.5 0 01-3.163-5.001l-2.995-2.991a1 1 0 011.316-1.316l2.992 2.992A3.5 3.5 0 1115.5 13z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">
            Use this code at checkout
          </div>
          <div className="text-xs text-gray-400 transition-opacity duration-500 hover:opacity-100 opacity-70">
            Valid until further notice
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard; 