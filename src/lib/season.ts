export type SeasonHero = {
  title: string;
  titleP: number;
  runnersUp: string;
  clSecure: string;
  lastPlaceP: number;
};

export type SeasonRow = {
  code: string;
  pos: number;
  projPos: number;
  pts: number;
  titleP: number;
  clP: number;
  descP: number;
};

export type SeasonForecast = {
  hero: SeasonHero;
  rows: SeasonRow[];
};
