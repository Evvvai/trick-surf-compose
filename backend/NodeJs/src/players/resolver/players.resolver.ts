import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { PlayersService } from '../service/players.service';
import { Players } from 'src/shared/entities/Players';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CtxPlayer } from 'src/auth/decorators/ctx-player.decorator';

@Resolver(() => Players)
export class PlayersResolver {
  constructor(private readonly playersService: PlayersService) {}

  @Query(() => [Players])
  players() {
    return this.playersService.getAll();
  }

  @Query(() => [Players], { nullable: true })
  playersBySteamids(
    @Args('steamids64', { type: () => [String] }) steamids: string[],
  ) {
    return this.playersService.getBySteamids(steamids);
  }

  @Query(() => Players)
  playerStats(
    @Args('steamid64') steamid64: string,
    @Args('mapId') mapId: number,
  ) {
    return this.playersService.getPlayerStats(steamid64, mapId);
  }

  @Query(() => Players)
  findOneBySteamid64(@Args('steamid64') steamid64: string) {
    return this.playersService.findPlayerBySteamId64(steamid64);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Players)
  setAvatar(@CtxPlayer() player: Players, @Args('url') url: string) {
    return this.playersService.updateAvatar(player, url);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Players)
  setDashboard(@CtxPlayer() player: Players, @Args('url') url: string) {
    return this.playersService.updateDashboard(player, url);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [Players])
  playerNewFriends(@CtxPlayer() player: Players) {
    return this.playersService.updateFriends(player);
  }
}
