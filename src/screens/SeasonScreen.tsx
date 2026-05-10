import ss from './SeasonScreen.module.css';
import { TeamLogo } from '../components/TeamLogo';
import { CLUBS } from '../lib/clubs';
import type { SeasonForecast, SeasonRow } from '../lib/season';

export function SeasonScreen({ data }: { data: SeasonForecast | null }) {
  if (!data) {
    return (
      <div className={ss.screen}>
        <header className={ss.head}>
          <div className={ss.eyebrow}>BUNDESLIGA · 2025/26</div>
          <h2 className={ss.title}>SAISON</h2>
        </header>
        <div className={ss.empty}>Saisondaten werden geladen…</div>
      </div>
    );
  }

  return (
    <div className={ss.screen}>
      <header className={ss.head}>
        <div className={ss.eyebrow}>BUNDESLIGA · 2025/26</div>
        <h2 className={ss.title}>SAISON</h2>
      </header>

      <section className={ss.hero}>
        <div className={ss.heroEyebrow}>TITELRENNEN</div>
        <h3 className={ss.heroTitle}>
          <em>{data.hero.title}</em> · {(data.hero.titleP * 100).toFixed(0)}%
        </h3>
        <p className={ss.heroSub}>{data.hero.runnersUp}</p>
        <div className={ss.heroStats}>
          <div>
            <div className={ss.heroStatLabel}>CL SICHER</div>
            <div className={ss.heroStatValue} data-tone="accent">{data.hero.clSecure}</div>
          </div>
          <div>
            <div className={ss.heroStatLabel}>SCHLUSSLICHT</div>
            <div className={ss.heroStatValue} data-tone="plasma">
              {(data.hero.lastPlaceP * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className={ss.heroStatLabel}>SIMULATIONEN</div>
            <div className={ss.heroStatValue}>10K</div>
          </div>
        </div>
      </section>

      {data.rows.slice(0, 10).map(r => <SeasonRowItem key={r.code} row={r} />)}
    </div>
  );
}

function SeasonRowItem({ row: r }: { row: SeasonRow }) {
  const c = CLUBS[r.code];
  const delta = r.pos - r.projPos;
  const dKey: 'up' | 'down' | 'zero' = delta > 0 ? 'up' : delta < 0 ? 'down' : 'zero';
  const dArr = delta > 0 ? '↑' : delta < 0 ? '↓' : '·';

  const barP =
    r.titleP > 0 ? r.titleP :
    r.clP > 0 ? r.clP :
    r.descP > 0 ? r.descP : 0.15;
  const barColor =
    r.titleP > 0.05 ? 'var(--bl-accent)' :
    r.clP > 0.5     ? 'var(--bl-accent)' :
    r.clP > 0       ? 'oklch(0.78 0.20 160)' :
    r.descP > 0     ? 'var(--bl-plasma)' : 'var(--bl-ink-5)';
  const meta =
    r.titleP > 0 ? `${(r.titleP * 100).toFixed(0)}% TITEL` :
    r.clP > 0    ? `${(r.clP    * 100).toFixed(0)}% CL`    :
    r.descP > 0  ? `${(r.descP  * 100).toFixed(0)}% ABSTIEG` :
    `${r.pts} PKT`;

  return (
    <div className={ss.row}>
      <div className={ss.pos}>{r.projPos}</div>
      <TeamLogo code={r.code} className={ss.mark} />
      <div className={ss.club}>
        <div className={ss.clubName}>{c?.name ?? r.code}</div>
        <div className={ss.clubMeta}>{meta}</div>
      </div>
      <div className={ss.bar}>
        <div style={{ width: `${barP * 100}%`, background: barColor }} />
      </div>
      <div className={ss.delta} data-d={dKey}>
        <span>{dArr}</span><span>{Math.abs(delta) || 0}</span>
      </div>
    </div>
  );
}
