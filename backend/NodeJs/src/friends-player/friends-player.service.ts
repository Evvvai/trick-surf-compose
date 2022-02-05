import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersI } from 'src/players/entities/players.interface';
import { Repository } from 'typeorm';
import { FriendsPlayer } from '../shared/entities/FriendsPlayer';
import { FriendsPlayerI } from './entities/friends-player.interface';

@Injectable()
export class FriendsPlayerService {
  constructor(
    @InjectRepository(FriendsPlayer)
    private friendsPlayerRepository: Repository<FriendsPlayer>,
  ) {}

  async addFriends(player: PlayersI, players: PlayersI[]) {
    const resQuary: FriendsPlayerI[] = [];

    players.forEach((val) => {
      resQuary.push({
        playerId: player.id,
        friendId: val.id,
      });
      resQuary.push({
        playerId: val.id,
        friendId: player.id,
      });
    });

    return this.friendsPlayerRepository.save(resQuary);
  }

  async getAllFriends(playerId: number) {
    return this.friendsPlayerRepository.find({
      where: {
        playerId: playerId,
      },
    });
  }
}
