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
};

export function MatchCard({ match: m, onClick, onLongPress }: Props) {
  const seen = useRevealOnMount();
  const lp = useLongPress(p => onLongPress?.(p));
  const home = CLUBS[m.home];
  const away = CLUBS[m.away];
  const top = m.fp >= 0.7;
  const cat = m.fp >= 0.55 ? 'FAV' : m.fp < 0.55 && m.fp >= 0.45 ? '50/50' : 'KANTE';
  const badge = top ? 'TOP' : cat;
  const [hg, ag] = m.tipp.split(':').map(Number);

  return (
    <button className={s.card} data-top={top} onClick={onClick} {...lp}>
      <div className={s.body}>
        <div className={s.head}>
          <div className={s.time}>{m.dateLabel.toUpperCase()} · {m.time}</div>
          <span className={s.badge} data-top={top}>{badge}</span>
        </div>

        <div className={s.grid}>
          <div className={s.team} data-side="home">
            <TeamLogo code={m.home} className={s.mark} />
            <span className={s.teamName}>{home?.name ?? m.home}</span>
          </div>

          <div className={s.mid}>
            <div className={s.score}>
              <em data-pick={m.wo === 'H'}>{isNaN(hg) ? '?' : hg}</em>
              <span className={s.scoreColon}>:</span>
              <em data-pick={m.wo === 'A'}>{isNaN(ag) ? '?' : ag}</em>
            </div>
          </div>

          <div className={s.team} data-side="away">
            <TeamLogo code={m.away} className={s.mark} />
            <span className={s.teamName}>{away?.name ?? m.away}</span>
          </div>
        </div>

        <div className={s.prob}>
          <div className={s.probBar}>
            <div className={s.probSeg} data-pick={m.wo === 'H'} style={{ width: seen ? `${m.pH * 100}%` : 0 }} />
            <div className={s.probSeg} data-pick={m.wo === 'D'} style={{ width: seen ? `${m.pD * 100}%` : 0 }} />
            <div className={s.probSeg} data-pick={m.wo === 'A'} style={{ width: seen ? `${m.pA * 100}%` : 0 }} />
          </div>
          <div className={s.probNums}>
            <div className={s.probNum} data-pick={m.wo === 'H'}>
              <span className={s.v}>{(m.pH * 100).toFixed(0)}</span>
              <span className={s.l}>1</span>
            </div>
            <div className={s.probNum} data-center>
              <span className={s.v}>{(m.pD * 100).toFixed(0)}</span>
              <span className={s.l}>X</span>
            </div>
            <div className={s.probNum} data-right data-pick={m.wo === 'A'}>
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
