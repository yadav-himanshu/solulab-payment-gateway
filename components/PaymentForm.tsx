'use client';

import React from 'react';
import { cn } from '@/utils/ui';
import { CreditCard, User, Calendar, Lock, IndianRupee, DollarSign } from 'lucide-react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { usePaymentForm } from '@/hooks/usePaymentForm';

export const PaymentForm = () => {
  const {
    draftPayment,
    cardType,
    status,
    errors,
    touched,
    isShaking,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
  } = usePaymentForm();

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "glass p-8 space-y-6 animate-fade-in",
        isShaking && "animate-shake"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Payment Details</h2>
        <div className="flex gap-2">
          <div className="w-8 h-5 bg-white/10 rounded" />
          <div className="w-8 h-5 bg-white/10 rounded" />
          <div className="w-8 h-5 bg-white/10 rounded" />
        </div>
      </div>

      <Input
        label="Cardholder Name"
        name="cardholderName"
        placeholder="e.g. JOHN DOE"
        icon={<User className="w-5 h-5" />}
        value={draftPayment.cardholderName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.cardholderName ? errors.cardholderName : ''}
        required
      />

      <div className="relative">
        <Input
          label="Card Number"
          name="cardNumber"
          placeholder="0000 0000 0000 0000"
          icon={<CreditCard className="w-5 h-5" />}
          value={draftPayment.cardNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.cardNumber ? errors.cardNumber : ''}
          maxLength={cardType === 'amex' ? 17 : 19}
          required
        />
        {cardType !== 'unknown' && (
          <div className="absolute right-4 top-[46px] text-xs font-bold uppercase text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
            {cardType}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiry Date"
          name="expiry"
          placeholder="MM/YY"
          icon={<Calendar className="w-5 h-5" />}
          value={draftPayment.expiry}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.expiry ? errors.expiry : ''}
          required
        />
        <Input
          label="CVV"
          name="cvv"
          placeholder="***"
          type="password"
          maxLength={4}
          icon={<Lock className="w-5 h-5" />}
          value={draftPayment.cvv}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.cvv ? errors.cvv : ''}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Input
            label="Amount"
            name="amount"
            type="number"
            icon={draftPayment.currency === 'INR' ? <IndianRupee className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
            value={draftPayment.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.amount ? errors.amount : ''}
            required
          />
        </div>
        <Select
          label="Currency"
          name="currency"
          value={draftPayment.currency}
          onChange={handleChange}
          options={[
            { label: 'INR', value: 'INR' },
            { label: 'USD', value: 'USD' },
          ]}
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-4"
        disabled={!isFormValid() || status === 'PROCESSING'}
        isLoading={status === 'PROCESSING'}
      >
        {status === 'PROCESSING' ? 'Processing...' : `Pay ${draftPayment.currency === 'INR' ? '₹' : '$'}${draftPayment.amount}`}
      </Button>

      {status === 'SUCCESS' && (
        <p className="text-center text-green-500 font-medium animate-fade-in">
          Payment Successful!
        </p>
      )}
    </form>
  );
};
