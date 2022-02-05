import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Players } from 'src/shared/entities/Players';
import { WRNotify } from '../entities/wr-notify.entity';
import { WRNotifyService } from '../service/wr-notify.service';

@Resolver(() => WRNotify)
export class WRNotifyResolver {
  constructor(private readonly TWRNotifyService: WRNotifyService) {}

  @Query(() => WRNotify)
  swrNotifyNone(@Args('steamid64', { type: () => String }) steamid64: string) {
    return this.TWRNotifyService.getSwrNotifyNone(steamid64);
  }

  @Query(() => WRNotify)
  twrNotifyNone(@Args('steamid64', { type: () => String }) steamid64: string) {
    return this.TWRNotifyService.getTwrNotifyNone(steamid64);
  }

  // Resolve
  // @ResolveField(() => Players, { name: 'player' })
  // player(@Parent() wr: WRNotify) {
  //   return this.playersService.getOne(wr.playerId);
  // }
}
