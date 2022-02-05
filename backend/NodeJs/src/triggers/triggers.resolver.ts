import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { TriggersService } from './triggers.service';
import { Triggers } from 'src/shared/entities/Triggers';
import { TriggersInput } from './dto/triggers.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/players/entities/role.enum';
import { CtxPlayer } from 'src/auth/decorators/ctx-player.decorator';
import { Players } from 'src/shared/entities/Players';
import { TriggersUpdateInput } from './dto/triggers-update.input';

@Resolver(() => Triggers)
export class TriggersResolver {
  constructor(private readonly triggersService: TriggersService) {}

  @Query(() => [Triggers])
  triggers(@Args('input') input: TriggersInput) {
    return this.triggersService.getAll(input);
  }

  // @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Triggers, { name: 'updateTrigger' })
  update(
    @CtxPlayer() player: Players,
    @Args('input') input: TriggersUpdateInput,
  ) {
    return this.triggersService.update(player, input);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Triggers)
  updatePhoto(
    @CtxPlayer() player: Players,
    @Args('url') url: string,
    @Args('id') id: number,
  ) {
    return this.triggersService.updatePhoto(player, url, id);
  }

  @Query(() => Triggers)
  trigger(
    @Args('input') input: TriggersInput,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.triggersService.getOne(input, id);
  }

  // Resolve
  // @ResolveField(() => [Triggers], { name: 'route' })
  // routeTrick(@Parent() trick: Triggers) {
  //   return this.tricksService.getRouteByTrick(trick);
  // }
}
