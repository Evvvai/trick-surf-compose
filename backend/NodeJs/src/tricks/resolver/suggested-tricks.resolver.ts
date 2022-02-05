import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  Int,
} from '@nestjs/graphql';
import { TricksService } from '../service/tricks.service';
import { TricksStatsInput } from '../dto/tricks-stats.input';
import { Players } from 'src/shared/entities/Players';
import { PlayersService } from 'src/players/service/players.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SuggestedTricks } from 'src/shared/entities/SuggestedTricks';
import { CtxPlayer } from 'src/auth/decorators/ctx-player.decorator';
import { SendTrickInput } from '../dto/send-trick.input';
import { SuggestedTricksService } from '../service/suggested-tricks.service';
import { Triggers } from 'src/shared/entities/Triggers';
import { TricksInput } from '../dto/tricks.input';
import { SuggestedTrickRate } from '../entities/suggested-trick-rate.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from 'src/players/entities/role.enum';
import {
  Rate,
  SuggestedTricksRates,
} from 'src/shared/entities/SuggestedTricksRate';
import { SuggestedTricksInput } from '../dto/suggested-tricks.input';

@Resolver(() => SuggestedTricks)
export class SuggestedTricksResolver {
  constructor(
    private readonly suggestedTricksService: SuggestedTricksService,
    // private readonly tricksService: TricksService,
    private readonly playersService: PlayersService,
  ) {}

  @Query(() => [SuggestedTricks])
  suggestedTricks(@Args('input') input: SuggestedTricksInput) {
    return this.suggestedTricksService.getAll(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => SuggestedTricks)
  sendTrick(
    @CtxPlayer() player: Players,
    @Args('input') input: SendTrickInput,
  ) {
    return this.suggestedTricksService.sendTrick(player, input);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => SuggestedTricks)
  acceptTrick(
    @CtxPlayer() player: Players,
    @Args('id', { type: () => Int! }) id: number,
  ) {
    return this.suggestedTricksService.acceptTrick(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => SuggestedTricks)
  declineTrick(
    @CtxPlayer() player: Players,
    @Args('id', { type: () => Int! }) id: number,
  ) {
    return this.suggestedTricksService.declineTrick(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => SuggestedTricksRates)
  rateTrick(
    @CtxPlayer() player: Players,
    @Args('rate', { type: () => Rate }) rate: Rate,
    @Args('trickId', { type: () => Int }) trickId: number,
  ) {
    return this.suggestedTricksService.rateTrick(player, trickId, rate);
  }

  // @UseGuards(JwtAuthGuard)
  // @Query(() => SuggestedTricksRates)
  // playerRate(@CtxPlayer() player: Players, @Args('ids') ids: number[]) {
  // return this.suggestedTricksService.playerRateForTricks(player, ids);
  // }

  @UseGuards(JwtAuthGuard)
  @Query(() => [SuggestedTricksRates], { nullable: true })
  playerRate(
    @CtxPlayer() player: Players,
    @Args('ids', { type: () => [Int] }) ids: number[],
  ) {
    return this.suggestedTricksService.playerRateForTricks(player, ids);
  }

  // Resolve
  @ResolveField(() => [Triggers], { name: 'route' })
  route(@Parent() trick: SuggestedTricks) {
    return this.suggestedTricksService.getRouteByTrick(trick);
  }

  @ResolveField(() => Players, { name: 'author' })
  author(@Parent() trick: SuggestedTricks) {
    return this.playersService.getOne(trick.authorId);
  }

  @ResolveField(() => SuggestedTrickRate, { name: 'rates' })
  rates(@Parent() trick: SuggestedTricks) {
    return this.suggestedTricksService.ratesForTrick(trick.id);
  }
}
