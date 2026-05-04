// ~/Mal3aby/malaby/frontend-admin/src/utils/timeFormat.ts

/**
 * Format 24-hour time to 12-hour format with Arabic AM/PM
 */
export function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  
  const [hoursStr, minutes] = time24.split(':');
  const h = parseInt(hoursStr, 10);
  
  if (isNaN(h)) return time24;
  
  const ampm = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  
  return `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Format booking time range (start - end)
 */
export function formatTimeRange(timeSlot: string, duration: number = 1): string {
  const [hoursStr, minutesStr] = timeSlot.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  const endHour = (hours + duration) % 24;
  const endTime = `${String(endHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
  return `${formatTime12Hour(timeSlot)} - ${formatTime12Hour(endTime)}`;
}
