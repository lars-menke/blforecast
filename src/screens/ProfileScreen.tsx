import p from './ProfileScreen.module.css';
import { VelocityIcon } from '../components/Icons';

export function ProfileScreen() {
  return (
    <div className={p.screen}>
      <header className={p.head}>
        <div className={p.eyebrow}>EINSTELLUNGEN</div>
        <h2 className={p.title}>PROFIL</h2>
      </header>

      <div className={p.scrollArea}>
        <section className={p.hero}>
          <div className={p.mark}><VelocityIcon size={48} /></div>
          <div>
            <div className={p.name}>BLFORECAST 2.0</div>
            <div className={p.sub}>POISSON · DC · PLATT</div>
          </div>
        </section>

        <ul className={p.list}>
          <ProfileRow label="Genauigkeit 1X2"  value="54.2%" />
          <ProfileRow label="Remis erkannt"    value="15.8%" />
          <ProfileRow label="TOP-Tipps Quote"  value="69.2%" />
          <ProfileRow label="Backtest-Spiele"  value="612"   />
        </ul>

        <div className={p.sectionLabel}>WIE FUNKTIONIERT DAS MODELL?</div>

        <div className={p.explainList}>
          <ExplainRow
            term="Poisson-Modell"
            desc="Schätzt die Anzahl Tore pro Team als Zufallsprozess. Basis sind die Saison-Statistiken: Heim-xG und Auswärts-xGA jedes Klubs."
          />
          <ExplainRow
            term="Dixon-Coles (ρ = −0.13)"
            desc="Korrigiert die Unabhängigkeitsannahme des Poisson-Modells für 0:0, 1:0, 0:1 und 1:1 – diese Ergebnisse treten häufiger auf als rein zufällig."
          />
          <ExplainRow
            term="Form-Blending"
            desc="Gewichtet aktuelle Formkurve (40%) und Saison-Durchschnitt (60%). Jüngere Spiele zählen mehr (Decay λ = 0.72)."
          />
          <ExplainRow
            term="Platt-Kalibrierung"
            desc="Justiert die Rohwahrscheinlichkeiten anhand historischer Ergebnisse (2024 + 2025, rolling). Verhindert Über- und Untervertrauen."
          />
          <ExplainRow
            term="Marktkorrektur"
            desc="Wenn Buchmacher-Quoten verfügbar sind, werden die Modellwahrscheinlichkeiten via Newton-Raphson in Richtung des Markts angepasst."
          />
          <ExplainRow
            term="TOP-Tipp"
            desc="Spiele mit fp ≥ 0.70: Der Favorit hat mindestens 70% Wahrscheinlichkeit. Historische Quote: 69.2% korrekt."
          />
          <ExplainRow
            term="Konfidenz"
            desc="Skalierter fp-Wert von 1–5. Zeigt wie klar das Modell einen Sieger sieht. 5/5 bedeutet sehr einseitiges Spiel."
          />
        </div>

        <ul className={p.list}>
          <ProfileRow label="Datenquelle"    value="OpenLigaDB" />
          <ProfileRow label="Marktquoten"    value="Odds API"   />
          <ProfileRow label="Form-Decay λ"   value="0.72"       />
          <ProfileRow label="DC ρ"           value="−0.13"      />
          <ProfileRow label="Draw-Boost max" value="0.15"       />
        </ul>

        <ul className={p.list}>
          <ProfileRow label="Version" value="2.0.0" />
        </ul>
      </div>
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

function ExplainRow({ term, desc }: { term: string; desc: string }) {
  return (
    <div className={p.explainRow}>
      <div className={p.explainTerm}>{term}</div>
      <div className={p.explainDesc}>{desc}</div>
    </div>
  );
}
