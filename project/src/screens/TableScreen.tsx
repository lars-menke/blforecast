import t from './TableScreen.module.css';
import { TeamLogo } from '../components/TeamLogo';
import { CLUBS } from '../lib/clubs';
import type { TableRow } from '../lib/standings';

export function TableScreen({ rows }: { rows: TableRow[] }) {
  return (
    <div className={t.screen}>
      <header className={t.head}>
        <div className={t.eyebrow}>BUNDESLIGA · 2025/26</div>
        <h2 className={t.title}>TABELLE</h2>
      </header>

      <div className={t.list}>
        {rows.length === 0 ? (
          <div className={t.empty}>Tabellendaten werden geladen…</div>
        ) : (
          rows.map(r => {
            const c = CLUBS[r.code];
            const gd = r.gf - r.ga;
            return (
              <div key={r.code} className={t.row}>
                <div className={t.zone} data-zone={r.zone || ''} />
                <div className={t.pos}>{r.pos}</div>
                <TeamLogo code={r.code} className={t.mark} />
                <div className={t.name}>{c?.name ?? r.code}</div>
                <div className={t.form}>
                  {r.last5.map((x, i) => <div key={i} className={t.formPip} data-r={x} />)}
                </div>
                <div className={t.gd}>{gd > 0 ? '+' : ''}{gd}</div>
                <div className={t.pts}>{r.pts}</div>
              </div>
            );
          })
        )}
      </div>

      <div className={t.legend}>
        <Legend dot="var(--bl-accent)"       label="CL"      />
        <Legend dot="oklch(0.78 0.20 160)"   label="EL"      />
        <Legend dot="var(--bl-good)"         label="CONF"    />
        <Legend dot="oklch(0.78 0.18 50)"    label="RELEG"   />
        <Legend dot="var(--bl-plasma)"       label="ABSTIEG" />
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className={t.legendItem}>
      <span className={t.legendDot} style={{ background: dot }} />
      {label}
    </div>
  );
}
