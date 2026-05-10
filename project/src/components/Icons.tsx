export function VelocityIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" rx="6" fill="#0A0A0F" />
      <path d="M20 78 L52 22 L80 22 L48 78 Z" fill="#D6FF1C" />
      <rect x="58" y="56" width="20" height="22" fill="#FF1C7A" />
      <rect x="20" y="78" width="60" height="3" fill="#D6FF1C" />
    </svg>
  );
}

export const TabIcons = {
  matchday: (
    <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="16" height="13" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9 H19" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  table: (
    <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 6 H18 M4 11 H18 M4 16 H18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  season: (
    <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3 16 L8 10 L12 13 L19 5"
            stroke="currentColor" strokeWidth="1.6"
            strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 18c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};
