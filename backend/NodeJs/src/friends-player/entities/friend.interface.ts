import { PlayersI } from 'src/players/entities/players.interface';

export interface FriendI extends PlayersI {
  online?: boolean;
  status?: StatusFriend;
}

export interface StatusFriend {
  action: '. . .' | 'playing';
}
