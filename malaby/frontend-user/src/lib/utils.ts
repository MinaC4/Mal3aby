import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP'
  }).format(price);
}

// Accepts "HH:MM" (24h) and legacy "HH:MM AM/PM".
export function parseTime(time: string): { hours: number; minutes: number } | null {
  if (!time) return null;
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3] ? match[3].toUpperCase() : null;
  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
}

export function formatTime12Hour(time: string): string {
  const parsed = parseTime(time);
  if (!parsed) return time || '';
  const meridiem = parsed.hours >= 12 ? 'م' : 'ص';
  const h12 = parsed.hours % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(parsed.minutes).padStart(2, '0')} ${meridiem}`;
}

// Local calendar date as YYYY-MM-DD (avoids the UTC off-by-one of toISOString near midnight).
export function todayLocalISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
}
