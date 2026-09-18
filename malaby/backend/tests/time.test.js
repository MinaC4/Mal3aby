const test = require('node:test');
const assert = require('node:assert');
const {
  parseTimeToParts,
  addHoursToTime,
  timeToMinutes,
  hasTimeOverlap,
  to24Hour,
  utcDayRange
} = require('../utils/time');

test('parseTimeToParts handles 24h and 12h', () => {
  assert.deepStrictEqual(parseTimeToParts('18:00'), { hours: 18, minutes: 0 });
  assert.deepStrictEqual(parseTimeToParts('06:00 PM'), { hours: 18, minutes: 0 });
  assert.deepStrictEqual(parseTimeToParts('12:30 AM'), { hours: 0, minutes: 30 });
  assert.deepStrictEqual(parseTimeToParts('12:00 PM'), { hours: 12, minutes: 0 });
});

test('addHoursToTime and to24Hour', () => {
  assert.strictEqual(addHoursToTime('06:00 PM', 1), '19:00');
  assert.strictEqual(addHoursToTime('18:00', 1), '19:00');
  assert.strictEqual(addHoursToTime('23:00', 1), '00:00');
  assert.strictEqual(to24Hour('06:00 PM'), '18:00');
});

test('timeToMinutes', () => {
  assert.strictEqual(timeToMinutes('18:00'), 1080);
  assert.strictEqual(timeToMinutes('06:00 PM'), 1080);
});

test('hasTimeOverlap', () => {
  assert.strictEqual(hasTimeOverlap('18:00', 2, '06:00 PM', 2), true);
  assert.strictEqual(hasTimeOverlap('18:00', 1, '19:00', 1), false);
  assert.strictEqual(hasTimeOverlap('19:00', 1, '18:00', 1), false);
  assert.strictEqual(hasTimeOverlap('09:00', 2, '10:00', 1), true);
});

test('utcDayRange accepts strings and Dates', () => {
  const fromString = utcDayRange('2026-10-01');
  assert.strictEqual(fromString.start.toISOString(), '2026-10-01T00:00:00.000Z');
  assert.strictEqual(fromString.end.toISOString(), '2026-10-01T23:59:59.999Z');

  const fromDate = utcDayRange(new Date('2026-10-01T23:25:35.643Z'));
  assert.strictEqual(fromDate.start.toISOString(), '2026-10-01T00:00:00.000Z');
  assert.strictEqual(fromDate.end.toISOString(), '2026-10-01T23:59:59.999Z');
});
