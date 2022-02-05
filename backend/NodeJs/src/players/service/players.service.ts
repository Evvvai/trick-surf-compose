import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Players } from 'src/shared/entities/Players';
import { In, Repository } from 'typeorm';

import { HttpService } from '@nestjs/axios';
import { PlayersI } from '../entities/players.interface';
import { lastValueFrom } from 'rxjs';
import { FriendsPlayerService } from 'src/friends-player/friends-player.service';
import { STEAM_API_KEY } from '@environments';
import { GetPlayerSummaries } from 'src/auth/steamapi-auth.service';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Players)
    private playersRepository: Repository<Players>,

    private friendsPlayerService: FriendsPlayerService,

    private readonly httpService: HttpService,
  ) {}

  async getOne(id: number): Promise<Players> {
    return this.playersRepository.findOne(id);
  }

  async getAll(): Promise<Players[]> {
    return this.playersRepository.find();
  }

  async getBySteamids(steamids: string[]) {
    const players = await this.playersRepository.find({
      where: {
        steamid64: In(steamids),
      },
    });

    return players;
  }

  async getAllFriends(userId: number) {
    const friendsIds = await this.friendsPlayerService.getAllFriends(userId);

    return this.playersRepository.find({
      where: {
        id: In(friendsIds.map((x) => x.friendId)),
      },
    });
  }

  async getPlayerStats(steamid: string, mapId: number) {
    const stats = await this.playersRepository.query(
      `
      	WITH 
        playerId AS (
          SELECT p.id
          FROM players p
          WHERE steamid64 = ${steamid}
        ),
        map_completes AS (
            SELECT sc.id
            FROM completes sc
            JOIN tricks t ON sc.trick_id = t.id
            WHERE t.map_id = ${mapId}
            AND sc.player_id = (SELECT id FROM playerId)
        )
        SELECT  lc.place,
                lc.steamid64,
                lc.nick,
                lc.avg,
                lc.ap,
                lc.ap_place,
                lc.ac,
                lc.ac_place,
                lc.up,
                lc.up_place,
                lc.uc,
                lc.uc_place,
                lc.completes_percent,
                st.tricks_points,
                st.tricks_counts,
                (SELECT COUNT(*) FROM twr st JOIN map_completes sc ON sc.id = st.complete_id) twr_counts,
                (SELECT COUNT(*) FROM swr st JOIN map_completes sc ON sc.id = st.complete_id) swr_counts,
                (SELECT COUNT(*) FROM suggested_tricks st WHERE st.map_id = ${mapId} AND st.author_id = (SELECT id FROM playerId)) tricks_created
                
          FROM leaderboard_cached lc
          JOIN (SELECT sum(POINT) tricks_points, count(POINT) tricks_counts FROM tricks WHERE map_id = ${mapId} ) st
          WHERE lc.player_id = (SELECT id FROM playerId)
          AND lc.map_id = ${mapId};
      `,
    );

    return stats[0];
  }

  async getAllPossibleFriends(
    player: PlayersI,
    friendsSteamid: string[],
  ): Promise<Players[]> {
    const users = await this.playersRepository.find({
      where: { steamid64: In(friendsSteamid) },
    });

    const friends = await this.friendsPlayerService.getAllFriends(player.id);

    const possible = users.filter((x) => {
      const gg = friends.find((y) => {
        return y.friendId === x.id;
      });

      if (gg === undefined) return true;
      return false;
    });

    // console.log('users', users);
    // console.log('friends', friends);
    // console.log('possible', possible);

    return possible;
  }

  async updateFriends(player: PlayersI) {
    const url = `https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${STEAM_API_KEY}&steamid=${player.steamid64}&relationship=friend`;
    const friends = (await lastValueFrom(this.httpService.get<any>(url))).data
      .friendslist.friends;

    const friendsSteamid = friends.map((x) => x.steamid);
    const possible = await this.getAllPossibleFriends(player, friendsSteamid);

    this.friendsPlayerService.addFriends(player, possible);

    return possible;
  }

  async findPlayerByNick(nick: string): Promise<Players> {
    return this.playersRepository.findOne({
      where: {
        nick,
      },
    });
  }

  async findPlayerBySteamId64(steamid64: string): Promise<Players> {
    return this.playersRepository.findOne({
      where: {
        steamid64: steamid64,
      },
    });
  }

  async updateAvatar(player: PlayersI, url: string) {
    player.avatarCustom = url;
    this.playersRepository.save(player);
    return player;
  }

  async updateDashboard(player: PlayersI, url: string) {
    player.dashboard = url;
    this.playersRepository.save(player);
    return player;
  }

  // Steam
  async registerUser(profile: GetPlayerSummaries): Promise<Players> {
    const player = new Players();
    player.steamid64 = profile.steamid;
    player.nick = profile.personaname;
    player.profileurl = profile.profileurl;
    player.avatarfull = profile.avatarfull;

    const newPlayer = await this.playersRepository.save(player);

    return newPlayer;
  }

  async updatePlayer(profile: GetPlayerSummaries): Promise<Players> {
    const player = await this.playersRepository.findOne({
      where: {
        steamid64: profile.steamid,
      },
    });

    // player.nick = profile.personaname;
    player.profileurl = profile.profileurl;
    player.avatarfull = profile.avatarfull;

    return await this.playersRepository.save(player);
  }

  async updateLastSeenSite(player: PlayersI) {
    return this.playersRepository.save({
      ...player,
      lastLoginSite: new Date(),
    });
  }
}
