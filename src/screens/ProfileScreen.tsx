import styles from './ProfileScreen.module.css';

export function ProfileScreen() {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.large}>Modell</h1>
        <p className={styles.subtitle}>BLforecast Poisson-Modell</p>
      </header>

      <div className={styles.sectionLabel}>Genauigkeit</div>
      <div className={styles.sectionCard}>
        <Row label="1X2-Genauigkeit" value="54.2%" />
        <Row label="Remis erkannt" value="15.8%" />
        <Row label="TOP-Tipps Quote" value="69.2%" />
        <Row label="Backtest-Spiele" value="612" />
      </div>

      <div className={styles.sectionLabel}>Wie funktioniert das Modell?</div>
      <div className={styles.sectionCard}>
        <ExplainRow
          term="Poisson-Modell"
          desc="Schatzt die Anzahl Tore pro Team als Zufallsprozess. Basis sind die Saison-Statistiken: Heim-xG und Auswarts-xGA jedes Klubs."
        />
        <ExplainRow
          term="Dixon-Coles (rho = -0.13)"
          desc="Korrigiert die Unabhangigkeitsannahme des Poisson-Modells fur 0:0, 1:0, 0:1 und 1:1 - diese Ergebnisse treten haufiger auf als rein zufallig."
        />
        <ExplainRow
          term="Form-Blending"
          desc="Gewichtet aktuelle Formkurve (40%) und Saison-Durchschnitt (60%). Jungere Spiele zahlen mehr (Decay 0.72)."
        />
        <ExplainRow
          term="Platt-Kalibrierung"
          desc="Justiert die Rohwahrscheinlichkeiten anhand historischer Ergebnisse (2024 + 2025, rolling). Verhindert Uber- und Untervertrauen."
        />
        <ExplainRow
          term="Marktkorrektur"
          desc="Wenn Buchmacher-Quoten verfugbar sind, werden die Modellwahrscheinlichkeiten via Newton-Raphson in Richtung des Markts angepasst."
        />
        <ExplainRow
          term="TOP-Tipp"
          desc="Spiele mit fp >= 0.70: Der Favorit hat mindestens 70% Wahrscheinlichkeit. Historische Quote: 69.2% korrekt."
        />
      </div>

      <div className={styles.sectionLabel}>Parameter</div>
      <div className={styles.sectionCard}>
        <Row label="Form-Decay lambda" value="0.72" />
        <Row label="Dixon-Coles rho" value="-0.13" />
        <Row label="Draw-Boost max" value="0.15" />
        <Row label="Form-Gewicht" value="40%" />
      </div>

      <div className={styles.sectionLabel}>Daten</div>
      <div className={styles.sectionCard}>
        <Row label="Datenquelle" value="OpenLigaDB" />
        <Row label="Marktquoten" value="Odds API" />
        <Row label="Kalibrierung" value="2024 + 2025" />
        <Row label="Version" value={__APP_VERSION__} />
      </div>

      <div className={styles.footer}>
        BLforecast v{__APP_VERSION__}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}

function ExplainRow({ term, desc }: { term: string; desc: string }) {
  return (
    <div className={styles.explainRow}>
      <div className={styles.explainTerm}>{term}</div>
      <div className={styles.explainDesc}>{desc}</div>
    </div>
  );
}
