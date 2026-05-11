import { useCallback, useRef, useState } from 'react';
import { MatchCard } from '../components/MatchCard';
import { MatchDetailSheet } from '../components/MatchDetailSheet';
import { MatchdayHeader, MatchdayDaySeparator } from '../components/MatchdayHeader';
import { useMatchday } from '../lib/useMatchday';
import { useSwipe, usePullToRefresh } from '../lib/hooks';
import type { MatchResult } from '../lib/poisson';
import type { FilterKey } from '../components/MatchdayHeader';
import s from './MatchdayScreen.module.css';

type QuickAction = { match: MatchResult; x: number; y: number };

export function MatchdayScreen() {
  const { loading, error, spieltag, trueSpieltag, matches, topCount, dateRange, setSpielTag, refresh } = useMatchday();
  const [selected, setSelected] = useState<MatchResult | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [quickAction, setQuickAction] = useState<QuickAction | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const refreshing = usePullToRefresh(scrollRef, refresh);

  const goPrev = useCallback(() => setSpielTag(Math.max(1, spieltag - 1)), [setSpielTag, spieltag]);
  const goNext = useCallback(() => setSpielTag(Math.min(34, spieltag + 1)), [setSpielTag, spieltag]);
  const swipeRef = useSwipe(goPrev, goNext);

  // Attach both refs to the same element
  const listRef = useCallback((el: HTMLDivElement | null) => {
    (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    (swipeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  }, [swipeRef]);

  const filtered = matches.filter(m => {
    if (filter === 'top')    return m.fp >= 0.7;
    if (filter === 'market') return m.market;
    if (filter === '50')     return m.fp < 0.55;
    return true;
  });

  // Group by dateLabel
  const groups: { day: string; items: MatchResult[] }[] = [];
  const seen = new Map<string, MatchResult[]>();
  for (const m of filtered) {
    const key = m.dateLabel;
    if (!seen.has(key)) {
      const arr: MatchResult[] = [];
      seen.set(key, arr);
      groups.push({ day: key, items: arr });
    }
    seen.get(key)!.push(m);
  }

  return (
    <div className={s.screen}>
      <MatchdayHeader
        matchday={spieltag}
        totalMatches={matches.length}
        topCount={topCount}
        dateRange={dateRange}
        onPrev={goPrev}
        onNext={goNext}
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className={s.list} ref={listRef}>
        {refreshing && (
          <div className={s.refreshBanner}>
            <div className={s.refreshDot} />
            AKTUALISIERE…
          </div>
        )}

        {loading && (
          <div className={s.state}>
            <div className={s.spinner} />
            <span>Lade Spieltag…</span>
          </div>
        )}
        {error && (
          <div className={`${s.state} ${s.stateError}`}>FEHLER: {error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className={s.state}>KEINE SPIELE · {filter.toUpperCase()}</div>
        )}

        {!loading && !error && groups.map(({ day, items }) => (
          <div key={day} className={s.group}>
            {groups.length > 1 && (
              <MatchdayDaySeparator name={day} count={items.length} />
            )}
            {items.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                onClick={() => setSelected(m)}
                onLongPress={(pt) => setQuickAction({ match: m, ...pt })}
              />
            ))}
          </div>
        ))}

        <div className={s.listFooter}>
          BLforecast · Spieltag {spieltag}
          {spieltag !== trueSpieltag && ` · aktuell ST${trueSpieltag}`}
        </div>
      </div>

      {selected && (
        <MatchDetailSheet match={selected} onClose={() => setSelected(null)} />
      )}

      {quickAction && (
        <QuickMenu
          match={quickAction.match}
          x={quickAction.x}
          y={quickAction.y}
          onClose={() => setQuickAction(null)}
        />
      )}
    </div>
  );
}

function QuickMenu({ match: m, x, y, onClose }: {
  match: MatchResult; x: number; y: number; onClose: () => void;
}) {
  const actions = [
    { label: 'TEILEN', icon: '↗' },
    { label: 'WATCHLIST', icon: '★' },
    { label: 'KOMBI', icon: '+' },
    { label: 'AUSBLENDEN', icon: '×' },
  ];

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const menuW = 180;
  const menuH = actions.length * 44;
  const left = Math.min(x, vw - menuW - 16);
  const top = y + menuH > vh - 60 ? y - menuH - 8 : y + 8;

  return (
    <div className={s.qmOverlay} onClick={onClose}>
      <div
        className={s.qmMenu}
        style={{ left, top }}
        onClick={e => e.stopPropagation()}
      >
        <div className={s.qmTitle}>{m.home} vs {m.away}</div>
        {actions.map(a => (
          <button key={a.label} className={s.qmItem} onClick={onClose}>
            <span className={s.qmIcon}>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
