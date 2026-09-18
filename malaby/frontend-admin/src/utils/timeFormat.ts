// Time helpers. Accepts both "HH:MM" (24h, preferred) and legacy "HH:MM AM/PM".

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

/**
 * Format a time (24h "HH:MM" or legacy "HH:MM AM/PM") to 12-hour Arabic AM/PM.
 */
export function formatTime12Hour(time: string): string {
  const parsed = parseTime(time);
  if (!parsed) return time || '';
  const meridiem = parsed.hours >= 12 ? 'م' : 'ص';
  const h12 = parsed.hours % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(parsed.minutes).padStart(2, '0')} ${meridiem}`;
}

/**
 * Format a booking time range (start - end) from a start time and duration.
 */
export function formatTimeRange(timeSlot: string, duration: number = 1): string {
  const parsed = parseTime(timeSlot);
  if (!parsed) return timeSlot || '';
  const endHours = (parsed.hours + duration) % 24;
  const endTime = `${String(endHours).padStart(2, '0')}:${String(parsed.minutes).padStart(2, '0')}`;
  return `${formatTime12Hour(timeSlot)} - ${formatTime12Hour(endTime)}`;
}
