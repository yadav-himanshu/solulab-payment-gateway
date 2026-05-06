export type PaymentStatus = 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export type Currency = 'INR' | 'USD';

export interface PaymentPayload {
  cardholderName: string;
  cardNumber: string;
  expiry: string; // MM/YY
  cvv: string;
  amount: number;
  currency: Currency;
}

export interface Transaction extends PaymentPayload {
  id: string;
  status: PaymentStatus;
  timestamp: number;
  error?: string;
  attempts: number;
}
