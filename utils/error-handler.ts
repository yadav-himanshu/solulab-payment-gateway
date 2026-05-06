export enum PaymentErrorType {
  NETWORK = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  DECLINED = 'DECLINED_ERROR',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

const ERROR_MESSAGE_MAP: Record<string, string> = {
  [PaymentErrorType.NETWORK]: 'We are unable to connect to our payment servers. Please check your internet connection.',
  [PaymentErrorType.TIMEOUT]: 'The transaction took too long to respond. This might be due to a slow network. Please try again.',
  [PaymentErrorType.INSUFFICIENT_FUNDS]: 'Your card has insufficient funds for this transaction. Please try another card.',
  [PaymentErrorType.DECLINED]: 'Your transaction was declined by the card issuer. Please contact your bank.',
  'Card expired': 'The card you entered has expired. Please use a valid card.',
  'Incorrect CVV': 'The CVV code entered is incorrect. Please double-check and try again.',
  'Bank server busy': 'Your bank servers are currently busy. Please wait a moment and try again.',
  [PaymentErrorType.SERVER]: 'We are experiencing internal technical difficulties. Our team has been notified.',
  [PaymentErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again later.',
};

export const getFriendlyErrorMessage = (error: string | PaymentErrorType): string => {
  // If it's a known error type or a direct match in the map
  if (ERROR_MESSAGE_MAP[error]) {
    return ERROR_MESSAGE_MAP[error];
  }

  // Handle specific backend strings if they aren't direct types
  const lowerError = error.toLowerCase();
  if (lowerError.includes('insufficient')) return ERROR_MESSAGE_MAP[PaymentErrorType.INSUFFICIENT_FUNDS];
  if (lowerError.includes('declined')) return ERROR_MESSAGE_MAP[PaymentErrorType.DECLINED];
  if (lowerError.includes('timeout') || lowerError.includes('abort')) return ERROR_MESSAGE_MAP[PaymentErrorType.TIMEOUT];
  if (lowerError.includes('network') || lowerError.includes('fetch')) return ERROR_MESSAGE_MAP[PaymentErrorType.NETWORK];
  if (lowerError.includes('server error') || lowerError.includes('500')) return ERROR_MESSAGE_MAP[PaymentErrorType.SERVER];

  return ERROR_MESSAGE_MAP[PaymentErrorType.UNKNOWN];
};
