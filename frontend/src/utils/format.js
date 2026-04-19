// src/utils/format.js — Display formatting helpers

/**
 * Format a view count into human-readable form.
 * e.g. 1234567 → "1.2M views"
 */
export function formatViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M views';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K views';
  return n + ' views';
}

/**
 * Format a date into relative time.
 * e.g. "3 days ago", "2 months ago"
 */
export function timeAgo(dateStr) {
  const now  = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60)         return 'just now';
  if (diff < 3600)       return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400)      return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 2592000)    return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000)   return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

/**
 * Generate a deterministic placeholder thumbnail color based on video id.
 */
export function placeholderColor(id = '') {
  const colors = ['#e63946','#457b9d','#2a9d8f','#e9c46a','#f4a261','#264653','#6d6875'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
