import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatAddress(address: string): string {
  if (address.length > 50) {
    return address.substring(0, 50) + '...';
  }
  return address;
}

export function calculatePriceChange(current: number, previous: number): {
  percentage: number;
  isPositive: boolean;
} {
  const diff = current - previous;
  const percentage = ((diff / previous) * 100).toFixed(1);
  return {
    percentage: parseFloat(percentage),
    isPositive: diff >= 0,
  };
}
