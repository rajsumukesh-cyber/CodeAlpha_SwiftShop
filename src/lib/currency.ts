import { Currency, CurrencyCode } from '../types';

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  INR: { code: 'INR', symbol: '₹', rate: 1, locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, locale: 'en-IE' },
};

export function formatPrice(amount: number, currency: Currency): string {
  const converted = amount * currency.rate;
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.code === 'INR' ? 0 : 2,
  }).format(converted);
}
