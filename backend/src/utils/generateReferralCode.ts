export default function generateReferralCode(email: string) {
  // Simple deterministic code: first 4 of name + short hash
  const name = email.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
  const prefix = (name.slice(0, 6) || 'USER').toUpperCase();
  const hash = Math.abs(
    [...email].reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7)
  ).toString(36).slice(0, 4).toUpperCase();
  return `${prefix}${hash}`;
}
