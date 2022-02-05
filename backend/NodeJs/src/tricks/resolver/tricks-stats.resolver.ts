import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TricksService } from '../service/tricks.service';
import { Triggers } from 'src/shared/entities/Triggers';
import { TricksStats } from '../entities/trick-stats.entity';
import { TricksStatsInput } from '../dto/tricks-stats.input';
import { Players } from 'src/shared/entities/Players';
import { PlayersService } from 'src/players/service/players.service';

@Resolver(() => TricksStats)
export class TricksStatsResolver {
  constructor(
    private readonly tricksService: TricksService,
    private readonly playersService: PlayersService,
  ) {}

  @Query(() => [TricksStats])
  tricksStats(@Args('input') input: TricksStatsInput) {
    return this.tricksService.getAllWithStats(input);
  }

  // Resolve
  @ResolveField(() => [Triggers], { name: 'route' })
  routeTrickStats(@Parent() trick: TricksStats) {
    return this.tricksService.getRouteByTrickStat(trick);
  }

  @ResolveField(() => Players, { name: 'author' })
  authorTrickStats(@Parent() trick: TricksStats) {
    return this.playersService.findPlayerBySteamId64(trick.author_steamid);
  }
}
