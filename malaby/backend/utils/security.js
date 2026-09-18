function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validateHttpUrl(value) {
  if (typeof value !== 'string') return false;
  if (value.length > 2000) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = { escapeRegex, validateHttpUrl };
