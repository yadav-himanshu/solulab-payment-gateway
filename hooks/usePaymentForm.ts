'use client';

import { useState } from 'react';
import { usePaymentStore } from '@/store/usePaymentStore';
import { PaymentPayload } from '@/types';
import { 
  validateCardNumber, 
  validateExpiry, 
  validateCVV, 
  validateCardholderName 
} from '@/utils/validation';
import { formatCardNumber, formatExpiry, detectCardType } from '@/utils/card';

export const usePaymentForm = () => {
  const { status, draftPayment, setDraftPayment, cardType, setCardType, processPayment } = usePaymentStore();
  
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentPayload, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof PaymentPayload, boolean>>>({});
  const [isShaking, setIsShaking] = useState(false);

  const validateField = (name: keyof PaymentPayload, value: string | number) => {
    let error = '';
    switch (name) {
      case 'cardholderName':
        if (!validateCardholderName(value as string)) error = 'Invalid name (min 3 characters)';
        break;
      case 'cardNumber':
        if (!validateCardNumber(value as string)) error = 'Invalid card number';
        break;
      case 'expiry':
        if (!validateExpiry(value as string)) error = 'Invalid expiry (MM/YY)';
        break;
      case 'cvv':
        if (!validateCVV(value as string, cardType)) error = `Invalid CVV (${cardType === 'amex' ? 4 : 3} digits)`;
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
    
    if (status === 'PROCESSING') return;

    if (!isFormValid()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    await processPayment(draftPayment);
  };

  return {
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
  };
};
