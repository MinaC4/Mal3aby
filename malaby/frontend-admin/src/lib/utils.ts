import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP'
  }).format(price);
}

export function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'pending':
      return { bg: 'bg-amber-100', text: 'text-amber-800' };
    case 'confirmed':
      return { bg: 'bg-emerald-100', text: 'text-emerald-800' };
    case 'cancelled':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    case 'completed':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending': return 'معلق';
    case 'confirmed': return 'مؤكد';
    case 'cancelled': return 'ملغي';
    case 'completed': return 'مكتمل';
    default: return status;
  }
}
