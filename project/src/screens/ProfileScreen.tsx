import p from './ProfileScreen.module.css';
import { VelocityIcon } from '../components/Icons';

export function ProfileScreen() {
  return (
    <div className={p.screen}>
      <header className={p.head}>
        <div className={p.eyebrow}>EINSTELLUNGEN</div>
        <h2 className={p.title}>PROFIL</h2>
      </header>

      <section className={p.hero}>
        <div className={p.mark}><VelocityIcon size={48} /></div>
        <div>
          <div className={p.name}>BLFORECAST 2.0</div>
          <div className={p.sub}>POISSON · DC · PLATT</div>
        </div>
      </section>

      <ul className={p.list}>
        <ProfileRow label="GENAUIGKEIT 1X2"  value="54.2%" />
        <ProfileRow label="REMIS ERKANNT"    value="15.8%" />
        <ProfileRow label="TOP-TIPPS QUOTE"  value="69.2%" />
        <ProfileRow label="BACKTEST-SPIELE"  value="612"   />
      </ul>

      <ul className={p.list}>
        <ProfileRow label="DATENQUELLE"    value="OPENLIGADB" />
        <ProfileRow label="MARKTQUOTEN"    value="ODDS API"   />
        <ProfileRow label="FORM-DECAY λ"   value="0.72"       />
        <ProfileRow label="DC ρ"           value="−0.13"      />
        <ProfileRow label="DRAW-BOOST MAX" value="0.15"       />
      </ul>

      <ul className={p.list}>
        <ProfileRow label="PUSH"    value="AN"    />
        <ProfileRow label="VERSION" value="2.0.0" />
      </ul>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <li className={p.row}>
      <span className={p.rowLabel}>{label}</span>
      <span className={p.rowValue}>{value}</span>
    </li>
  );
}
