import s from './OnboardingScreen.module.css';
import { VelocityIcon } from '../components/Icons';

type Props = { onStart: () => void };

export function OnboardingScreen({ onStart }: Props) {
  return (
    <div className={s.onb}>
      <div className={s.mark}><VelocityIcon size={64} /></div>
      <div className={s.eyebrow}>▶ SYSTEM ONLINE</div>
      <h1 className={s.title}>
        DATEN.<br />NICHT <em>BAUCH</em>.
      </h1>
      <p className={s.sub}>
        Bundesliga-Prognosen aus Poisson, Dixon-Coles und Live-Marktquoten —
        kalibriert auf 612 Backtest-Spiele.
      </p>

      <div className={s.features}>
        <Feature icon="λ" title="POISSON"
          desc="Erwartete Tore aus Form, Stärke, Heimvorteil" />
        <Feature icon="€" title="MARKTKORREKTUR"
          desc="Buchmacher-Edge fließt mit ein, transparent" />
        <Feature icon="⚡" title="LIVE"
          desc="Pull-to-refresh aktualisiert Quoten und Form" />
      </div>

      <button className={s.cta} onClick={onStart}>START →</button>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className={s.feat}>
      <div className={s.featIcon}>{icon}</div>
      <div>
        <div className={s.featTitle}>{title}</div>
        <div className={s.featDesc}>{desc}</div>
      </div>
    </div>
  );
}
