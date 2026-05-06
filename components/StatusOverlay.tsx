'use client';

import React from 'react';
import { CheckCircle2, XCircle, Clock, Loader2, RefreshCw } from 'lucide-react';
import { usePaymentStore } from '@/store/usePaymentStore';
import { Button } from './ui/Button';
import { cn } from '@/utils/ui';

export const StatusOverlay = () => {
  const { status, resetPayment, error, retryPayment, retryCount } = usePaymentStore();
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (status !== 'IDLE') {
      // Only capture focus if we haven't already (prevents overwriting original trigger)
      if (!previousFocusRef.current) {
        previousFocusRef.current = document.activeElement as HTMLElement;
      }
      // Focus the heading for screen readers on every state change
      headingRef.current?.focus();
    } else {
      // Restore focus when returning to IDLE
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [status]);

  if (status === 'IDLE') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4">
      <div className="glass p-8 max-w-md w-full text-center space-y-6 premium-shadow">
        {status === 'PROCESSING' && (
          <div className="space-y-6">
            <div className="relative flex justify-center">
              <Loader2 className="w-20 h-20 text-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-white outline-none">Processing Payment</h3>
              <p className="text-gray-400 mt-2">Please do not close this window or refresh the page.</p>
            </div>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <div>
              <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-white outline-none">Payment Successful</h3>
              <p className="text-gray-400 mt-2">Your transaction has been completed successfully.</p>
            </div>
            <Button onClick={resetPayment} variant="primary" className="w-full">
              Make Another Payment
            </Button>
          </div>
        )}

        {(status === 'FAILED' || status === 'TIMEOUT') && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                {status === 'TIMEOUT' ? (
                  <Clock className="w-12 h-12 text-red-500" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500" />
                )}
              </div>
            </div>
            <div>
              <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-white outline-none">
                {retryCount >= 3 ? 'Transaction Failed' : (status === 'TIMEOUT' ? 'Payment Timed Out' : 'Payment Failed')}
              </h3>
              <p className="text-gray-400 mt-2">
                {retryCount >= 3 
                  ? 'Maximum retry attempts reached. Please check your card details or try a different payment method.' 
                  : (error || 'Something went wrong while processing your payment.')}
              </p>
              <p className={cn(
                "text-sm font-medium mt-4 uppercase tracking-widest",
                retryCount >= 3 ? "text-red-400" : "text-gray-500"
              )}>
                {retryCount >= 3 ? 'Max Retries Reached' : `Attempt ${retryCount} of 3`}
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={resetPayment} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={retryPayment} 
                variant="primary" 
                className="flex-1 gap-2"
                disabled={retryCount >= 3}
              >
                <RefreshCw className="w-4 h-4" />
                {retryCount >= 3 ? 'No Retries Left' : 'Retry'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
