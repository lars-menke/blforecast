import styles from './TabBar.module.css';

export type TabKey = 'matchday' | 'table' | 'season' | 'profile';

type Props = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

const TABS: { key: TabKey; label: string; icon: JSX.Element }[] = [
  {
    key: 'matchday',
    label: 'Spieltag',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="7" y="12" width="3" height="3" rx="0.5" fill="currentColor"/>
        <rect x="10.5" y="12" width="3" height="3" rx="0.5" fill="currentColor"/>
        <rect x="14" y="12" width="3" height="3" rx="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    key: 'table',
    label: 'Tabelle',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 6h18M3 10h18M3 14h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 3v18M16 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'season',
    label: 'Saison',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 19 L7 14 L11 16 L16 9 L21 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="21" cy="5" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    key: 'profile',
    label: 'Modell',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="8" r="1" fill="currentColor"/>
      </svg>
    ),
  },
];

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className={styles.tabbar}>
      {TABS.map(({ key, label, icon }) => (
        <button
          key={key}
          className={styles.tab}
          data-active={active === key}
          onClick={() => onChange(key)}
          aria-label={label}
        >
          {icon}
          <span className={styles.tabLabel}>{label}</span>
        </button>
      ))}
    </nav>
  );
}
