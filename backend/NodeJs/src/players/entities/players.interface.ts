import { Role } from './role.enum';

export interface PlayersI {
  id: number;
  steamid: string | null;
  steamid64: string | null;
  nick: string | null;
  profileurl: string;
  avatarCustom: string;
  avatarfull: string;
  dashboard: string;
  lastLoginSite: Date;
  lastLoginServer: Date;
  role: Role;
}
