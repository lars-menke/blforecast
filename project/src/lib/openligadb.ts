import type { TeamCode } from './clubs';
import { useEffect, useState } from 'react';

const OLDB_BASE = 'https://api.openligadb.de';

const TEAM_CODE_MAP: Record<string, TeamCode> = {
  'FC Bayern München': 'FCB', 'Bayern München': 'FCB',
  'Borussia Dortmund': 'BVB',
  'TSG 1899 Hoffenheim': 'TSG', 'TSG Hoffenheim': 'TSG',
  'VfB Stuttgart': 'VFB',
  'RB Leipzig': 'RBL',
  'Bayer 04 Leverkusen': 'B04', 'Bayer Leverkusen': 'B04',
  'SC Freiburg': 'SCF',
  'Eintracht Frankfurt': 'SGE',
  '1. FC Union Berlin': 'UNI', 'Union Berlin': 'UNI',
  'FC Augsburg': 'FCA',
  'Hamburger SV': 'HSV',
  '1. FC Köln': 'KOE', 'FC Köln': 'KOE',
  '1. FSV Mainz 05': 'MAI', 'FSV Mainz 05': 'MAI', 'Mainz 05': 'MAI',
  'Borussia Mönchengladbach': 'BMG',
  'VfL Wolfsburg': 'WOB',
  'FC St. Pauli': 'STP',
  'SV Werder Bremen': 'SVW', 'Werder Bremen': 'SVW',
  '1. FC Heidenheim 1846': 'HEI', '1. FC Heidenheim': 'HEI',
};

function normalizeUrl(url: string): string {
  const m = url.match(/^(.+\/commons\/)thumb\/(.+\.svg)\/\d+px-.+\.png$/);
  return m ? m[1] + m[2] : url;
}

const LOGO_CACHE = new Map<TeamCode, string>();
const SUBSCRIBERS = new Set<() => void>();
let loading: Promise<void> | null = null;

export function getLogoUrl(code: TeamCode): string | undefined {
  return LOGO_CACHE.get(code);
}

export function subscribeLogos(cb: () => void): () => void {
  SUBSCRIBERS.add(cb);
  return () => SUBSCRIBERS.delete(cb);
}

export async function fetchLogos(): Promise<void> {
  if (loading) return loading;
  loading = (async () => {
    const seasons = ['2025', '2024', '2023'];
    for (const s of seasons) {
      try {
        const r = await fetch(`${OLDB_BASE}/getavailableteams/bl1/${s}`);
        if (!r.ok) continue;
        const teams: Array<{ teamName: string; shortName: string; teamIconUrl: string }> = await r.json();
        teams.forEach(t => {
          const code = TEAM_CODE_MAP[t.teamName] || TEAM_CODE_MAP[t.shortName];
          if (code && t.teamIconUrl && !LOGO_CACHE.has(code)) {
            LOGO_CACHE.set(code, normalizeUrl(t.teamIconUrl));
          }
        });
      } catch {
        // network error: non-fatal, try next season
      }
    }
    SUBSCRIBERS.forEach(cb => cb());
  })();
  return loading;
}

export function useLogos(): Map<TeamCode, string> {
  const [, force] = useState(0);
  useEffect(() => {
    if (LOGO_CACHE.size === 0) fetchLogos();
    return subscribeLogos(() => force(x => x + 1));
  }, []);
  return LOGO_CACHE;
}
