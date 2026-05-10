import s from './TabBar.module.css';
import { TabIcons } from './Icons';

export type TabKey = 'matchday' | 'table' | 'season' | 'profile';

type Props = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

const TABS: { key: TabKey; label: string; icon: keyof typeof TabIcons }[] = [
  { key: 'matchday', label: 'SPIELTAG', icon: 'matchday' },
  { key: 'table',    label: 'TABELLE',  icon: 'table'    },
  { key: 'season',   label: 'SAISON',   icon: 'season'   },
  { key: 'profile',  label: 'PROFIL',   icon: 'profile'  },
];

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className={s.tabbar}>
      {TABS.map(({ key, label, icon }) => (
        <button
          key={key}
          className={s.tab}
          data-active={active === key}
          onClick={() => onChange(key)}
          aria-label={label}
        >
          {TabIcons[icon]}
          <span className={s.tabLabel}>{label}</span>
        </button>
      ))}
    </nav>
  );
}
