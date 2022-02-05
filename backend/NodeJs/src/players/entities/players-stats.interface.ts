import { Role } from './role.enum';

export interface PlayersStatsI {
  place: number;
  avg: string;
  ap: number;
  apPlace: number;
  ac: number;
  acPlace: number;
  up: number;
  upPlace: number;
  uc: number;
  ucPlace: number;
  completesPercent: string;
  tricksPoints: number;
  tricksCounts: number;
  twrCounts: number;
  swrCounts: number;
  tricksCreated: number;
}
