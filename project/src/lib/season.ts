// Season forecast types

export type SeasonHero = {
  title: string;       // likely champion name
  titleP: number;      // title probability
  runnersUp: string;
  clSecure: string;    // clubs with CL secured
  lastPlaceP: number;  // last place probability for current last
};

export type SeasonRow = {
  code: string;
  pos: number;         // current table position
  projPos: number;     // projected end position
  pts: number;
  titleP: number;
  clP: number;
  descP: number;
};

export type SeasonForecast = {
  hero: SeasonHero;
  rows: SeasonRow[];
};
