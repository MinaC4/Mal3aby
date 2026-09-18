// Shared time helpers. Times are "HH:MM" (24h) internally; "HH:MM AM/PM" (12h)
// is accepted for backward compatibility with legacy seeded data.

function parseTimeToParts(timeStr) {
  if (typeof timeStr !== 'string') return { hours: 0, minutes: 0 };
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/);
  if (!match) return { hours: 0, minutes: 0 };
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3] ? match[3].toUpperCase() : null;
  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
}

function addHoursToTime(timeStr, hoursToAdd) {
  const { hours, minutes } = parseTimeToParts(timeStr);
  const totalMinutes = hours * 60 + minutes + (hoursToAdd * 60);
  const newHours = ((Math.floor(totalMinutes / 60) % 24) + 24) % 24;
  const newMinutes = ((totalMinutes % 60) + 60) % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

function timeToMinutes(timeStr) {
  const { hours, minutes } = parseTimeToParts(timeStr);
  return hours * 60 + minutes;
}

function hasTimeOverlap(start1, duration1, start2, duration2) {
  const s1 = timeToMinutes(start1);
  const s2 = timeToMinutes(start2);
  const e1 = s1 + Number(duration1 || 1) * 60;
  const e2 = s2 + Number(duration2 || 1) * 60;
  return s1 < e2 && e1 > s2;
}

function to24Hour(timeStr) {
  const { hours, minutes } = parseTimeToParts(timeStr);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Consistent UTC day range. Accepts a Date or a YYYY-MM-DD string.
// Booking dates are matched by whole day (some records carry a time component).
function utcDayRange(input) {
  let year, month, day;
  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    year = input.getUTCFullYear();
    month = input.getUTCMonth() + 1;
    day = input.getUTCDate();
  } else {
    [year, month, day] = String(input).slice(0, 10).split('-').map(Number);
  }
  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  return { start, end };
}

module.exports = { parseTimeToParts, addHoursToTime, timeToMinutes, hasTimeOverlap, to24Hour, utcDayRange };
