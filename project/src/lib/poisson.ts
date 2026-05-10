// Poisson model types — implementation lives in the real repo
// This file defines all types needed by the Velocity UI components.

export type TeamStats = {
  rank: number;
  hGF: number; hGA: number;
  aGF: number; aGA: number;
};

export type MatchResult = {
  id: string;
  home: string;          // club code
  away: string;          // club code
  dateLabel: string;     // e.g. 'Fr.'
  time: string;          // e.g. '18:30'
  tipp: string;          // e.g. '2:1'
  wo: 'H' | 'D' | 'A';
  fp: number;            // favorite probability
  pH: number;
  pD: number;
  pA: number;
  lH: number;
  lA: number;
  lambdaDiff: number;
  effectiveDrawThreshold: number;
  conf: number;          // 1-5
  market: boolean;
  marketApplied: boolean;
  calibrated: boolean;
  drawBlocked: boolean;
  adjusted: boolean;
  goalRuleApplied: boolean;
  favScoreRuleApplied: boolean;
  formH: ('S' | 'U' | 'N')[];
  formA: ('S' | 'U' | 'N')[];
  topScores: [string, number][];
  srt: [string, number][];   // alias for topScores, backwards compat
  actual?: { g1: number; g2: number } | null;
};
