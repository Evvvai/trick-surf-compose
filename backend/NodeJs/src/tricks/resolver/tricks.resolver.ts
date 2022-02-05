import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { TricksService } from '../service/tricks.service';
import { Tricks } from 'src/shared/entities/Tricks';
import { Triggers } from 'src/shared/entities/Triggers';
import { TricksInput } from '../dto/tricks.input';
import { Players } from 'src/shared/entities/Players';
import { CtxPlayer } from 'src/auth/decorators/ctx-player.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SendTrickInput } from '../dto/send-trick.input';
import { SuggestedTricks } from 'src/shared/entities/SuggestedTricks';
import { PlayersService } from 'src/players/service/players.service';

@Resolver(() => Tricks)
export class TricksResolver {
  constructor(
    private readonly tricksService: TricksService,
    private readonly playersService: PlayersService,
  ) {}

  @Query(() => [Tricks])
  tricks(@Args('input') input: TricksInput) {
    return this.tricksService.getAll(input);
  }

  @Query(() => Tricks)
  trick(
    @Args('input') input: TricksInput,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.tricksService.getOne(input, id);
  }

  @Query(() => Tricks)
  getTrickByName(@Args('id', { type: () => String }) name: string) {
    return this.tricksService.getSuggestedTrickByName(name);
  }

  // Resolve
  @ResolveField(() => [Triggers], { name: 'route' })
  routeTrick(@Parent() trick: Tricks) {
    return this.tricksService.getRouteByTrick(trick);
  }

  @ResolveField(() => Players, { name: 'author' })
  authorTrick(@Parent() trick: Tricks) {
    return this.playersService.getOne(trick.authorId);
  }
}
