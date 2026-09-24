// Shared input validation helpers.

// Booking duration must be an integer between 1 and 4 (matches the Booking model).
function isValidDuration(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 4;
}

// Calendar date in YYYY-MM-DD form.
function isValidDateString(value) {
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime());
}

module.exports = { isValidDuration, isValidDateString };
