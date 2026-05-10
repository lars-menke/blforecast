import { useEffect, useRef, useState } from 'react';
import s from './MatchDetailSheet.module.css';
import { TeamLogo } from './TeamLogo';
import { CLUBS } from '../lib/clubs';
import type { MatchResult } from '../lib/poisson';

type Props = {
  match: MatchResult | null;
  onClose: () => void;
};

export function MatchDetailSheet({ match: m, onClose }: Props) {
  if (!m) return null;
  return <SheetInner m={m} onClose={onClose} />;
}

function SheetInner({ m, onClose }: { m: MatchResult; onClose: () => void }) {
  const home = CLUBS[m.home];
  const away = CLUBS[m.away];
  const [hg, ag] = m.tipp.split(':').map(Number);

  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const dragging = useRef(false);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const onMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) { dragging.current = false; setDragY(0); return; }
      e.preventDefault();
      setDragY(delta);
    };
    sheet.addEventListener('touchmove', onMove, { passive: false });
    return () => sheet.removeEventListener('touchmove', onMove);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!sheetRef.current || sheetRef.current.scrollTop > 2) return;
    startY.current = e.touches[0].clientY;
    dragging.current = true;
  };
  const onTouchEnd = () => {
    dragging.current = false;
    if (dragY > 90) onClose();
    else setDragY(0);
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div
        ref={sheetRef}
        className={s.sheet}
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
      >
        <div className={s.handle} />

        <div className={s.hero}>
          <div className={s.team}>
            <TeamLogo code={m.home} className={s.mark} />
            <span className={s.teamName}>{home?.fullName ?? m.home}</span>
          </div>
          <div className={s.heroMid}>
            <div className={s.heroEyebrow}>PROGNOSE</div>
            <div className={s.heroScore}>
              <em>{isNaN(hg) ? '?' : hg}</em>
              <span className={s.heroScoreColon}>:</span>
              <em>{isNaN(ag) ? '?' : ag}</em>
            </div>
            <div className={s.heroTime}>{m.dateLabel.toUpperCase()} · {m.time}</div>
          </div>
          <div className={s.team}>
            <TeamLogo code={m.away} className={s.mark} />
            <span className={s.teamName}>{away?.fullName ?? m.away}</span>
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionLabel}>WAHRSCHEINLICHKEIT 1X2</div>
          <div className={s.sectionCard}>
            <div className={s.grid1x2}>
              <div className={s.cell} data-pick={m.wo === 'H'}>
                <span className={s.v}>{(m.pH * 100).toFixed(0)}%</span>
                <span className={s.l}>HEIM · 1</span>
              </div>
              <div className={s.cell} data-pick={m.wo === 'D'}>
                <span className={s.v}>{(m.pD * 100).toFixed(0)}%</span>
                <span className={s.l}>REMIS · X</span>
              </div>
              <div className={s.cell} data-pick={m.wo === 'A'}>
                <span className={s.v}>{(m.pA * 100).toFixed(0)}%</span>
                <span className={s.l}>GAST · 2</span>
              </div>
            </div>
            <div className={s.bar1x2}>
              <div className={s.h} style={{ width: `${m.pH * 100}%` }} />
              <div className={s.d} style={{ width: `${m.pD * 100}%` }} />
              <div className={s.a} style={{ width: `${m.pA * 100}%` }} />
            </div>
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionLabel}>MODELL</div>
          <div className={s.sectionCard}>
            <Row label="λ HEIM · xG"    value={m.lH.toFixed(2)} />
            <Row label="λ GAST · xG"    value={m.lA.toFixed(2)} />
            <Row label="DIXON-COLES ρ"  value="−0.13" />
            <Row label="MARKTKORREKTUR" value={m.market ? 'AKTIV' : 'INAKTIV'} />
            <Row label="KONFIDENZ"      value={`${m.conf}/5`} />
            {m.drawBlocked && <Row label="REMIS" value="GESPERRT" />}
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionLabel}>TOP-SCORES</div>
          <div className={s.scores}>
            {m.topScores.slice(0, 8).map(([score, p]) => (
              <div key={score} className={s.scoreCell} data-active={score === m.tipp}>
                <div className={s.scoreS}>{score}</div>
                <div className={s.scoreP}>{(p * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        <button className={s.close} onClick={onClose}>SCHLIESSEN</button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.row}>
      <span className={s.rowLabel}>{label}</span>
      <span className={s.rowValue}>{value}</span>
    </div>
  );
}
