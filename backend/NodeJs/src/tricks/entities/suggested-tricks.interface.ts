import { Status } from 'src/shared/entities/SuggestedTricks';

export interface SuggestedTricksI {
  id?: number;
  name: string;
  point: number;
  velocity: number;
  dateAdd?: Date;
  dateModify: Date;
  authorId: number;
  status: Status;
  mapId: number;

  // completes: Completes[];
  // routes: Routes[];
  // swrs: Swr[];
  // author: Players;
  // twrs: Twr[];
  // map: Maps;
}
