import { Resolver } from '@nestjs/graphql';
import { FriendsPlayerService } from './friends-player.service';
import { FriendsPlayer } from '../shared/entities/FriendsPlayer';

@Resolver(() => FriendsPlayer)
export class FriendsPlayerResolver {
  constructor(private readonly friendsPlayerService: FriendsPlayerService) {}
}
