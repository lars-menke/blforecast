// useMatchday hook — connects to OpenLigaDB + Poisson model
// This stub generates realistic mock data based on FALLBACK_STATS.
// In the real app, replace with live API calls.

import { useCallback, useEffect, useState } from 'react';
import { CLUBS, FALLBACK_STATS } from './clubs';
import type { MatchResult } from './poisson';

const FIXTURES: [string, string, string, string][] = [
  ['FCB', 'BVB', 'Fr.', '20:30'],
  ['B04', 'RBL', 'Sa.', '15:30'],
  ['VFB', 'SGE', 'Sa.', '15:30'],
  ['SCF', 'BMG', 'Sa.', '15:30'],
  ['TSG', 'FCA', 'Sa.', '15:30'],
  ['SVW', 'WOB', 'Sa.', '18:30'],
  ['STP', 'UNI', 'So.', '15:30'],
  ['HSV', 'KOE', 'So.', '17:30'],
  ['MAI', 'HEI', 'So.', '19:30'],
];

const FORM_OPTS: ('S' | 'U' | 'N')[] = ['S', 'S', 'U', 'N', 'S'];

function mockResult(home: string, away: string, dateLabel: string, time: string, idx: number): MatchResult {
  const hS = FALLBACK_STATS[home] ?? { rank: 10, hGF: 1.3, hGA: 1.2, aGF: 1.0, aGA: 1.5 };
  const aS = FALLBACK_STATS[away] ?? { rank: 10, hGF: 1.3, hGA: 1.2, aGF: 1.0, aGA: 1.5 };

  const lH = parseFloat(((hS.hGF + aS.hGA) / 2 * 1.08).toFixed(2));
  const lA = parseFloat(((aS.aGF + hS.aGA) / 2).toFixed(2));
  const diff = Math.abs(lH - lA);

  const pH = Math.min(0.92, Math.max(0.10, lH / (lH + lA + 0.5)));
  const pA = Math.min(0.92, Math.max(0.08, lA / (lH + lA + 0.5)));
  const pD = Math.max(0.05, 1 - pH - pA);

  const norm = pH + pD + pA;
  const fpH = pH / norm;
  const fpD = pD / norm;
  const fpA = pA / norm;
  const fp = Math.max(fpH, fpA);
  const wo: 'H' | 'D' | 'A' = fpH > fpA && fpH > fpD ? 'H' : fpA > fpD ? 'A' : 'D';
  const hg = wo === 'H' ? 2 : wo === 'D' ? 1 : 0;
  const ag = wo === 'A' ? 2 : wo === 'D' ? 1 : 0;

  const form = (seed: number): ('S' | 'U' | 'N')[] =>
    Array.from({ length: 5 }, (_, i) => FORM_OPTS[(seed + i) % 5]);

  return {
    id: `${home}-${away}`,
    home, away, dateLabel, time,
    tipp: `${hg}:${ag}`,
    wo,
    fp,
    pH: fpH, pD: fpD, pA: fpA,
    lH, lA,
    lambdaDiff: diff,
    effectiveDrawThreshold: 0.22 + (diff < 0.25 ? 0.05 : 0),
    conf: Math.min(5, Math.max(1, Math.round(fp * 5))),
    market: idx % 3 === 0,
    marketApplied: false,
    calibrated: true,
    drawBlocked: fpD < 0.18 && wo !== 'D',
    adjusted: false,
    goalRuleApplied: false,
    favScoreRuleApplied: lH >= 2.0 && wo === 'H',
    formH: form(hS.rank),
    formA: form(aS.rank + 2),
    topScores: [
      [`${hg}:${ag}`, fp * 0.22],
      ['1:0', 0.10], ['2:1', 0.09], ['0:0', 0.07],
      ['1:1', 0.08], ['2:0', 0.07], ['0:1', 0.06], ['3:1', 0.05],
    ],
    srt: [
      [`${hg}:${ag}`, fp * 0.22],
      ['1:0', 0.10], ['2:1', 0.09], ['0:0', 0.07],
      ['1:1', 0.08], ['2:0', 0.07], ['0:1', 0.06], ['3:1', 0.05],
    ],
    actual: null,
  };
}

export function useMatchday() {
  const [spieltag, setSpieltag] = useState(26);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In real app: fetch from OpenLigaDB and run Poisson model
  const matches: MatchResult[] = FIXTURES.map(([h, a, d, t], i) =>
    mockResult(h, a, d, t, i)
  ).filter(m => CLUBS[m.home] && CLUBS[m.away]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [spieltag, refresh]);

  const topCount = matches.filter(m => m.fp >= 0.7).length;

  return {
    loading,
    error,
    spieltag,
    trueSpieltag: 26,
    matches,
    topCount,
    dateRange: 'Fr–So · 18.–20. Apr',
    setSpielTag: setSpieltag,
    refresh,
  };
}
