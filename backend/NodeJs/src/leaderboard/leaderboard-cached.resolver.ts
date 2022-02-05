import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardInput } from './dto/leaderboard.input';
import { LeaderboardI } from './entities/leaderboard.interface';
import { Players } from 'src/shared/entities/Players';
import { PlayersService } from 'src/players/service/players.service';
import { LeaderboardCached } from '../shared/entities/LeaderboardCached';

@Resolver(() => LeaderboardCached)
export class LeaderboardCachedResolver {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly playerService: PlayersService,
  ) {}

  @Query(() => [LeaderboardCached])
  leaderboardCached(@Args('input') input: LeaderboardInput) {
    return this.leaderboardService.getAllCached(input);
  }

  // Resolve
  @ResolveField(() => Players, { name: 'player' })
  playerLeaderboard(@Parent() leaderboard: LeaderboardCached) {
    return this.playerService.findPlayerBySteamId64(leaderboard.steamid64);
  }
}
