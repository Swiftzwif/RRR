"use client";

import { isSaleActive, getSalePercentage } from '@/lib/config';

interface PricingDisplayProps {
  regularPrice: number;
  salePrice: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PricingDisplay({ 
  regularPrice, 
  salePrice, 
  currency = 'USD',
  size = 'lg'
}: PricingDisplayProps) {
  const isOnSale = isSaleActive();
  const currentPrice = isOnSale ? salePrice : regularPrice;
  const discount = getSalePercentage();

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl md:text-7xl'
  };

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {isOnSale && (
        <div className="flex flex-col items-end">
          <span className="text-slate-400 line-through text-2xl md:text-3xl">
            ${regularPrice}
          </span>
          <span className="text-red-400 text-sm font-bold">
            {discount}% OFF
          </span>
        </div>
      )}
      
      <div className="flex items-baseline gap-2">
        <span className={`font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent ${sizeClasses[size]}`}>
          ${currentPrice}
        </span>
        {!isOnSale && (
          <span className="text-slate-400 text-xl">
            {currency}
          </span>
        )}
      </div>

      {isOnSale && (
        <div className="w-full text-center mt-2">
          <span className="inline-block bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-bold px-4 py-1 rounded-full">
            LIMITED TIME OFFER
          </span>
        </div>
      )}
    </div>
  );
}

