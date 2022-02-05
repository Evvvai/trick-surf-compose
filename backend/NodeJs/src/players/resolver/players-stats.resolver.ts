import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { PlayersService } from '../service/players.service';
import { PlayersStats } from '../entities/players-stats.entity';

@Resolver(() => PlayersStats)
export class PlayersStatsResolver {
  constructor(private readonly playersService: PlayersService) {}

  @Query(() => PlayersStats)
  playerStats(
    @Args('steamid64', { type: () => String }) steamid64: string,
    @Args('mapId', { type: () => Int }) mapId: number,
  ) {
    return this.playersService.getPlayerStats(steamid64, mapId);
  }
}
