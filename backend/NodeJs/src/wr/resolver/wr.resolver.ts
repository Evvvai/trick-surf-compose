import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { WRService } from '../service/wr.service';
import { Players } from 'src/shared/entities/Players';
import { PlayersService } from 'src/players/service/players.service';
import { WR } from '../entities/wr.entity';

@Resolver(() => WR)
export class WRResolver {
  constructor(
    private readonly wrService: WRService,
    private readonly playersService: PlayersService,
  ) {}

  @Query(() => WR)
  swr(
    // @Args('mapId', { type: () => Int }) mapId: number,
    @Args('trickId', { type: () => Int }) trickId: number,
  ) {
    return this.wrService.swr(trickId);
  }

  @Query(() => WR)
  twr(
    // @Args('mapId', { type: () => Int }) mapId: number,
    @Args('trickId', { type: () => Int }) trickId: number,
  ) {
    return this.wrService.twr(trickId);
  }

  // Resolve
  @ResolveField(() => Players, { name: 'player' })
  player(@Parent() wr: WR) {
    return this.playersService.getOne(wr.playerId);
  }
}
