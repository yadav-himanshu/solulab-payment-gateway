export const validateCardNumber = (number: string): boolean => {
  const sanitized = number.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(sanitized)) return false;
  
  // Luhn Algorithm
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

export const validateExpiry = (expiry: string): boolean => {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return false;
  
  const [month, year] = expiry.split('/').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv: string, cardType: string = 'unknown'): boolean => {
  const length = cardType === 'amex' ? 4 : 3;
  return new RegExp(`^\\d{${length}}$`).test(cvv);
};

export const validateCardholderName = (name: string): boolean => {
  return /^[a-zA-Z ]{3,50}$/.test(name);
};
