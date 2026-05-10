import s from './MatchdayHeader.module.css';

export type FilterKey = 'all' | 'top' | 'market' | '50';

type Props = {
  matchday: number;
  totalMatchdays?: number;
  totalMatches: number;
  topCount: number;
  dateRange: string;
  onPrev: () => void;
  onNext: () => void;
  filter: FilterKey;
  onFilterChange: (k: FilterKey) => void;
};

export function MatchdayHeader({
  matchday, totalMatchdays = 34,
  totalMatches, topCount, dateRange,
  onPrev, onNext,
  filter, onFilterChange,
}: Props) {
  return (
    <>
      <header className={s.head}>
        <div className={s.eyebrow}>SPIELTAG · LIVE</div>
        <h1 className={s.title}>
          SPIELTAG <em>{String(matchday).padStart(2, '0')}</em>
        </h1>
        <div className={s.sub}>
          <span><strong>{totalMatches}</strong> Spiele</span>
          <span><strong>{topCount}</strong> Top-Tipps</span>
          <span>{dateRange}</span>
        </div>

        <div className={s.pager}>
          <button
            className={s.pagerBtn}
            disabled={matchday <= 1}
            onClick={onPrev}
            aria-label="Vorheriger Spieltag"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2 L4 7 L9 12" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={s.pagerContent}>
            <div className={s.pagerLabel}>SPIELTAG</div>
            <div className={s.pagerValue}>{matchday}/{totalMatchdays}</div>
          </div>
          <button
            className={s.pagerBtn}
            disabled={matchday >= totalMatchdays}
            onClick={onNext}
            aria-label="Nächster Spieltag"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2 L10 7 L5 12" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      <div className={s.filters}>
        {(['all', 'top', 'market', '50'] as FilterKey[]).map(k => (
          <button
            key={k}
            className={s.chip}
            data-active={filter === k}
            onClick={() => onFilterChange(k)}
          >
            {k === 'all' ? 'ALLE' : k === 'top' ? 'TOP' : k === 'market' ? 'MARKT' : '50/50'}
          </button>
        ))}
      </div>
    </>
  );
}

export function MatchdayDaySeparator({ name, count }: { name: string; count: number }) {
  return (
    <div className={s.day}>
      <span className={s.dayName}>{name}</span>
      <div className={s.dayLine} />
      <span className={s.dayCount}>{count} SPIELE</span>
    </div>
  );
}
