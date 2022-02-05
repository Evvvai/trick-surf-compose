import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './entities/leaderboard.entity';
import { LeaderboardInput } from './dto/leaderboard.input';
import { LeaderboardI } from './entities/leaderboard.interface';
import { Players } from 'src/shared/entities/Players';
import { PlayersService } from 'src/players/service/players.service';

@Resolver(() => Leaderboard)
export class LeaderboardResolver {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly playerService: PlayersService,
  ) {}

  @Query(() => [Leaderboard], { nullable: true })
  leaderboard(@Args('input') input: LeaderboardInput) {
    return this.leaderboardService.getAll(input);
  }

  // Resolve
  @ResolveField(() => Players, { name: 'player' })
  playerLeaderboard(@Parent() leaderboard: LeaderboardI) {
    return this.playerService.findPlayerBySteamId64(leaderboard.steamid64);
  }
}
