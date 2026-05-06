import React from 'react';
import { CreditCard, Wifi } from 'lucide-react';
import { CardType } from '@/types';
import { cn } from '@/utils/ui';

interface CardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cardType: CardType;
}

export const CardPreview = ({
  cardNumber,
  cardholderName,
  expiry,
  cardType,
}: CardPreviewProps) => {
  const getCardGradient = () => {
    switch (cardType) {
      case 'visa':
        return 'from-blue-600 to-blue-900';
      case 'mastercard':
        return 'from-orange-500 to-red-600';
      case 'amex':
        return 'from-emerald-500 to-teal-700';
      default:
        return 'from-gray-700 to-gray-900';
    }
  };

  const displayCardNumber = cardNumber || '•••• •••• •••• ••••';
  const displayName = cardholderName || 'YOUR NAME';
  const displayExpiry = expiry || 'MM/YY';

  return (
    <div className="w-full perspective-1000">
      <div className={cn(
        "relative w-full aspect-[1.586/1] rounded-2xl p-6 md:p-8 text-white shadow-2xl transition-all duration-500 bg-gradient-to-br hover:scale-[1.02] transform-gpu glass-reflection cursor-default",
        getCardGradient()
      )}>
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full border-[20px] border-white/20" />
          <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full border-[30px] border-white/10" />
        </div>

        {/* Chip & Wifi */}
        <div className="relative z-10 flex justify-between items-start mb-8 md:mb-12">
          <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md shadow-inner flex items-center justify-center">
            <div className="w-8 h-6 border border-black/10 rounded flex flex-wrap">
              <div className="w-1/2 h-1/2 border-r border-b border-black/10" />
              <div className="w-1/2 h-1/2 border-b border-black/10" />
              <div className="w-1/2 h-1/2 border-r border-black/10" />
            </div>
          </div>
          <Wifi className="w-8 h-8 opacity-50 rotate-90" />
        </div>

        {/* Card Number */}
        <div className="relative z-10 mb-8 md:mb-12">
          <p className="text-xl md:text-2xl tracking-[0.2em] font-mono drop-shadow-lg">
            {displayCardNumber}
          </p>
        </div>

        {/* Name & Expiry */}
        <div className="relative z-10 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] uppercase opacity-60 tracking-widest">Card Holder</p>
            <p className="text-sm md:text-base font-medium tracking-wider truncate max-w-[180px]">
              {displayName}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] uppercase opacity-60 tracking-widest">Expires</p>
            <p className="text-sm md:text-base font-medium tracking-wider">
              {displayExpiry}
            </p>
          </div>
          {cardType !== 'unknown' && (
            <div className="absolute -right-2 -bottom-2 opacity-80 scale-125 md:scale-150 transform">
              <p className="text-xs font-black italic uppercase tracking-tighter">
                {cardType}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
