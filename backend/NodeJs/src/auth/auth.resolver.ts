import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { Players } from 'src/shared/entities/Players';
import { AuthService } from './auth.service';
import { CtxPlayer } from './decorators/ctx-player.decorator';
import { PlayerToken } from './entities/player-token';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PlayerToken)
  auth(@CtxPlayer() player: Players) {
    return this.service.auth(player);
  }
}
