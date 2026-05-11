import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchSeason,
  detectCurrentSpieltag,
  buildMatchEntries,
  buildDynST,
} from './openligadb';
import { recalcMatches } from './poisson';
import { CLUBS, FALLBACK_STATS } from './clubs';
import type { MatchResult } from './poisson';
import type { OldbMatch } from './openligadb';

function parseDateLabel(kickoff: string): { dateLabel: string; time: string } {
  // format from fmtKickoff: "Fr 18.04 · 20:30"
  const m = kickoff.match(/^(\S+)\s+[\d.]+\s+·\s+(\d{2}:\d{2})$/);
  if (m) return { dateLabel: m[1] + '.', time: m[2] };
  return { dateLabel: '', time: kickoff };
}

function buildDateRange(all: OldbMatch[], nr: number): string {
  const ms = all.filter(m => m.group.groupOrderID === nr);
  const dates = ms
    .map(m => new Date(m.matchDateTimeUTC ?? m.matchDateTime ?? ''))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  if (!dates.length) return '';
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const fmt = (d: Date) =>
    `${days[d.getDay()]} ${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
  const first = dates[0], last = dates[dates.length - 1];
  return first.toDateString() === last.toDateString()
    ? fmt(first)
    : `${fmt(first)}–${fmt(last)}`;
}

export function useMatchday() {
  const [spieltag, setSpieltagState] = useState<number | null>(null);
  const [trueSpieltag, setTrueSpieltag] = useState(1);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [dateRange, setDateRange] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const allRef = useRef<OldbMatch[] | null>(null);

  const load = useCallback(async (nr: number | null) => {
    setLoading(true);
    setError(null);
    try {
      const all = allRef.current ?? await fetchSeason();
      allRef.current = all;

      const current = detectCurrentSpieltag(all);
      setTrueSpieltag(current);
      const target = nr ?? current;
      if (spieltag === null) setSpieltagState(target);

      const entries = buildMatchEntries(all, target);
      const stData = buildDynST(all, target);

      const calcMap = recalcMatches(entries, stData, FALLBACK_STATS, null);

      const results: MatchResult[] = entries.flatMap(e => {
        const r = calcMap[e.id];
        if (!r || !CLUBS[e.home] || !CLUBS[e.away]) return [];
        const { dateLabel, time } = parseDateLabel(e.kickoff);
        return [{
          ...r,
          id: e.id,
          home: e.home,
          away: e.away,
          dateLabel,
          time,
          actual: e.actual,
          market: r.marketApplied,
          conf: Math.min(5, Math.max(1, Math.round(r.fp * 5))),
          formH: (e.hForm ? [
            e.hForm.gf > e.hForm.ga ? 'S' : e.hForm.gf < e.hForm.ga ? 'N' : 'U',
          ] : []) as ('S'|'U'|'N')[],
          formA: (e.aForm ? [
            e.aForm.gf > e.aForm.ga ? 'S' : e.aForm.gf < e.aForm.ga ? 'N' : 'U',
          ] : []) as ('S'|'U'|'N')[],
          topScores: r.srt,
        }];
      });

      setMatches(results);
      setDateRange(buildDateRange(all, target));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [spieltag]);

  const setSpielTag = useCallback((nr: number) => {
    setSpieltagState(nr);
    load(nr);
  }, [load]);

  const refresh = useCallback(() => {
    allRef.current = null; // clear cache to force reload
    load(spieltag);
  }, [load, spieltag]);

  useEffect(() => { load(null); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const topCount = matches.filter(m => m.fp >= 0.7).length;

  return {
    loading,
    error,
    spieltag: spieltag ?? trueSpieltag,
    trueSpieltag,
    matches,
    topCount,
    dateRange,
    setSpielTag,
    refresh,
  };
}
