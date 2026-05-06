import { CardType } from '@/types';

export const detectCardType = (number: string): CardType => {
  const sanitized = number.replace(/\D/g, '');
  
  if (/^4/.test(sanitized)) return 'visa';
  if (/^5[1-5]/.test(sanitized)) return 'mastercard';
  if (/^3[47]/.test(sanitized)) return 'amex';
  
  return 'unknown';
};

export const formatCardNumber = (number: string): string => {
  const sanitized = number.replace(/\D/g, '');
  const cardType = detectCardType(sanitized);
  
  if (cardType === 'amex') {
    // Amex format: 4-6-5
    const parts = [
      sanitized.substring(0, 4),
      sanitized.substring(4, 10),
      sanitized.substring(10, 15)
    ].filter(Boolean);
    return parts.join(' ');
  }
  
  // Default format: 4-4-4-4
  const parts = sanitized.match(/.{1,4}/g) || [];
  return parts.join(' ').substring(0, 19);
};

export const formatExpiry = (expiry: string): string => {
  const sanitized = expiry.replace(/\D/g, '');
  if (sanitized.length > 2) {
    return `${sanitized.substring(0, 2)}/${sanitized.substring(2, 4)}`;
  }
  return sanitized;
};
