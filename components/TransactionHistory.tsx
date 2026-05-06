'use client';

import React, { useState } from 'react';
import { usePaymentStore } from '@/store/usePaymentStore';
import { Transaction, PaymentStatus } from '@/types';
import { cn } from '@/utils/ui';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  Calendar, 
  Hash, 
  Trash2 
} from 'lucide-react';

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const configs: Record<PaymentStatus, { icon: any; color: string; bg: string }> = {
    SUCCESS: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    FAILED: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    TIMEOUT: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    PROCESSING: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    IDLE: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500/10' },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", config.bg, config.color)}>
      <Icon className="w-3 h-3" />
      {status}
    </div>
  );
};

export const TransactionHistory = () => {
  const { history, clearHistory } = usePaymentStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="glass p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
          <Hash className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">No Transactions Yet</h3>
          <p className="text-gray-500 text-sm">Your payment history will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden flex flex-col max-h-[600px]">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Transaction History
          <span className="text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </h2>
        <button 
          onClick={clearHistory}
          className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
          title="Clear History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto divide-y divide-white/5">
        {history.map((tx) => (
          <div key={tx.id} className="group">
            <button 
              onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
              className="w-full p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                tx.status === 'SUCCESS' ? 'bg-green-500/10' : 'bg-red-500/10'
              )}>
                {tx.currency === 'INR' ? '₹' : '$'}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-bold truncate">
                    {tx.currency === 'INR' ? '₹' : '$'}{tx.amount}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
              </div>

              {expandedId === tx.id ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
              )}
            </button>

            {expandedId === tx.id && (
              <div className="p-4 bg-black/20 border-t border-white/5 animate-fade-in space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest font-bold">Transaction ID</p>
                    <p className="text-gray-300 font-mono break-all">{tx.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest font-bold">Cardholder</p>
                    <p className="text-gray-300">{tx.cardholderName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest font-bold">Attempts</p>
                    <p className="text-gray-300">{tx.attempts}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest font-bold">Card Used</p>
                    <p className="text-gray-300">•••• {tx.cardNumber.slice(-4)}</p>
                  </div>
                </div>
                {tx.error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                    <p className="font-bold uppercase tracking-widest mb-1">Error Reason</p>
                    {tx.error}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
