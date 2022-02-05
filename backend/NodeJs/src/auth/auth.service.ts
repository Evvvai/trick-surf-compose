import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CLIENT_HOST } from '@environments';
import { JwtDto } from './dto/jwt.dto';
import { SteamAPIAuthService } from './steamapi-auth.service';
import { FriendsPlayerService } from 'src/friends-player/friends-player.service';
import { PlayerToken } from './entities/player-token';
import { PlayersService } from 'src/players/service/players.service';
import { Players } from 'src/shared/entities/Players';
import { Role } from 'src/players/entities/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly playersService: PlayersService,
    private readonly steamAPIAuthService: SteamAPIAuthService,
    private readonly friendsPlayerService: FriendsPlayerService,
  ) {}

  public async auth(player: Players): Promise<PlayerToken> {
    this.updatePlayerData(player.steamid64);

    return { player, token: this.signToken(player.steamid64, player.role) };
  }

  public async updatePlayerData(steamid64: string) {
    try {
      if (steamid64) {
        const playerProfile = await this.steamAPIAuthService.getUserInfo(
          steamid64,
        );
        this.playersService.updatePlayer(playerProfile);
      }
    } catch {
      console.log('Steam sleep...');
    }
  }

  signToken(steamid64: string, role: Role) {
    const payload: JwtDto = { steamid64, role };

    return this.jwt.sign(payload);
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwt.verifyAsync(jwt);
  }

  public async validatePlayer(steamid64: string): Promise<Players | null> {
    const player = await this.playersService.findPlayerBySteamId64(steamid64);
    /**
     * Some stuff
     */
    return player;
  }

  // Steam validate
  public async steamValidation(
    req: any,
    profile: any,
  ): Promise<Players | null> {
    let player = await this.playersService.findPlayerBySteamId64(profile.id);

    if (!player) {
      if (!(await this.steamAPIAuthService.canPlayerRegister(profile.id))) {
        return null;
      }

      const playerProfile = await this.steamAPIAuthService.getUserInfo(
        profile.id,
      );

      player = await this.playersService.registerUser(playerProfile);

      const userFriends = await this.steamAPIAuthService.getFriendsPlayer(
        profile.id,
      );

      if (userFriends) {
        const friendsSteamid = userFriends.map((x) => x.steamid);
        const friends = await this.playersService.getAllPossibleFriends(
          player,
          friendsSteamid,
        );
        if (friends) {
          this.friendsPlayerService.addFriends(player, friends);
        }
      }
    }

    return player;
  }

  authSteam(player: Players, res: any) {
    if (!player) {
      res.redirect(`${CLIENT_HOST}/signin`);
      return;
    }

    const JWT = this.signToken(player.steamid64, player.role);

    res.redirect(`${CLIENT_HOST}/auth/?token=${JWT}`);
  }
}
