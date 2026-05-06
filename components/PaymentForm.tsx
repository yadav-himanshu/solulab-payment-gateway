'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/ui';
import { CreditCard, User, Calendar, Lock, IndianRupee, DollarSign } from 'lucide-react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { usePaymentStore } from '@/store/usePaymentStore';
import { PaymentPayload, Currency } from '@/types';
import { 
  validateCardNumber, 
  validateExpiry, 
  validateCVV, 
  validateCardholderName 
} from '@/utils/validation';
import { formatCardNumber, formatExpiry, detectCardType } from '@/utils/card';
import { CardType } from '@/types';

export const PaymentForm = () => {
  const { setStatus, status, draftPayment, setDraftPayment, cardType, setCardType } = usePaymentStore();
  
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentPayload, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof PaymentPayload, boolean>>>({});
  const [isShaking, setIsShaking] = useState(false);

  const validateField = (name: keyof PaymentPayload, value: any) => {
    let error = '';
    switch (name) {
      case 'cardholderName':
        if (!validateCardholderName(value)) error = 'Invalid name (min 3 characters)';
        break;
      case 'cardNumber':
        if (!validateCardNumber(value)) error = 'Invalid card number';
        break;
      case 'expiry':
        if (!validateExpiry(value)) error = 'Invalid expiry (MM/YY)';
        break;
      case 'cvv':
        if (!validateCVV(value, cardType)) error = `Invalid CVV (${cardType === 'amex' ? 4 : 3} digits)`;
        break;
      case 'amount':
        if (Number(value) <= 0) error = 'Amount must be greater than 0';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      setCardType(detectCardType(formattedValue));
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cardholderName') {
      formattedValue = value.toUpperCase();
    }

    setDraftPayment({ [name]: formattedValue });

    if (touched[name as keyof PaymentPayload] || name === 'cardNumber' || name === 'expiry') {
      const error = validateField(name as keyof PaymentPayload, formattedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof PaymentPayload, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const fieldErrors = Object.keys(draftPayment).map((key) => 
      validateField(key as keyof PaymentPayload, draftPayment[key as keyof PaymentPayload])
    );
    return fieldErrors.every((err) => !err) && 
           Object.values(draftPayment).every((val) => val !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission if already processing
    if (status === 'PROCESSING') return;

    if (!isFormValid()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    const { processPayment } = usePaymentStore.getState();
    await processPayment(draftPayment);
  };

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
