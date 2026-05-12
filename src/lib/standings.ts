export type Zone = 'cl' | 'el' | 'cf' | 'rel' | 'desc' | '';

export type TableRow = {
  pos: number;
  code: string;
  pts: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  last5: ('S' | 'U' | 'N')[];
  zone: Zone;
};
