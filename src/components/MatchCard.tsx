import { useEffect, useState } from 'react';
import s from './MatchCard.module.css';
import { TeamLogo } from './TeamLogo';
import { useLongPress } from '../lib/hooks';
import { CLUBS } from '../lib/clubs';
import type { MatchResult } from '../lib/poisson';

type Props = {
  match: MatchResult;
  onClick: () => void;
  onLongPress?: (point: { x: number; y: number }) => void;
  showStripes?: boolean;
};

export function MatchCard({ match: m, onClick, onLongPress, showStripes = true }: Props) {
  const seen = useRevealOnMount();
  const lp = useLongPress(p => onLongPress?.(p));
  const home = CLUBS[m.home];
  const away = CLUBS[m.away];
  const top = m.fp >= 0.7;
  const cat = m.fp >= 0.7 ? 'FAV' : m.fp >= 0.55 ? 'KANTE' : '50/50';
  const [hg, ag] = m.tipp.split(':').map(Number);

  return (
    <button className={s.card} data-top={top} onClick={onClick} {...lp}>
      <div className={s.stripe} data-stripes={showStripes ? 'on' : 'off'}>
        <div className={s.stripeSide} style={{ background: home?.color }} />
        <div className={s.stripeSide} style={{ background: away?.color }} />
      </div>
      <div className={s.body}>
        <div className={s.head}>
          <div className={s.time}>{m.dateLabel.toUpperCase()} · {m.time}</div>
          <div className={s.pills}>
            {m.market && <span className={s.pill} data-tone="market">MARKT</span>}
            {top && <span className={s.pill} data-tone="top">TOP</span>}
            <span className={s.pill}>{cat}</span>
          </div>
        </div>

        <div className={s.grid}>
          <div className={s.team} data-side="home">
            <div className={s.teamRow}>
              <TeamLogo code={m.home} className={s.mark} />
              <span className={s.teamName}>{home?.name ?? m.home}</span>
            </div>
            <div className={s.form}>
              {m.formH.map((r, i) => <span key={i} className={s.formPip} data-r={r} />)}
            </div>
          </div>

          <div className={s.mid}>
            <div className={s.score}>
              <em>{isNaN(hg) ? '?' : hg}</em>
              <span className={s.scoreColon}>:</span>
              <em>{isNaN(ag) ? '?' : ag}</em>
            </div>
            <div className={s.midEyebrow}>PROGNOSE</div>
            <div className={s.conf}>
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={s.confPip} data-on={i <= m.conf} />
              ))}
            </div>
          </div>

          <div className={s.team} data-side="away">
            <div className={s.teamRow}>
              <TeamLogo code={m.away} className={s.mark} />
              <span className={s.teamName}>{away?.name ?? m.away}</span>
            </div>
            <div className={s.form}>
              {m.formA.map((r, i) => <span key={i} className={s.formPip} data-r={r} />)}
            </div>
          </div>
        </div>

        <div className={s.prob}>
          <div className={s.probBar}>
            <div className={s.h} style={{ width: seen ? `${m.pH * 100}%` : 0 }} />
            <div className={s.d} style={{ width: seen ? `${m.pD * 100}%` : 0 }} />
            <div className={s.a} style={{ width: seen ? `${m.pA * 100}%` : 0 }} />
          </div>
          <div className={s.probNums}>
            <div className={s.probNum} data-side="h" data-pick={m.wo === 'H'}>
              <span className={s.v}>{(m.pH * 100).toFixed(0)}</span>
              <span className={s.l}>1</span>
            </div>
            <div className={s.probNum} data-side="d" data-pick={m.wo === 'D'}>
              <span className={s.v}>{(m.pD * 100).toFixed(0)}</span>
              <span className={s.l}>X</span>
            </div>
            <div className={s.probNum} data-side="a" data-pick={m.wo === 'A'}>
              <span className={s.v}>{(m.pA * 100).toFixed(0)}</span>
              <span className={s.l}>2</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function useRevealOnMount() {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSeen(true), 120);
    return () => clearTimeout(t);
  }, []);
  return seen;
}
