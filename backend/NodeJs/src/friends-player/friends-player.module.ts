import { Module } from '@nestjs/common';
import { FriendsPlayerService } from './friends-player.service';
import { FriendsPlayerResolver } from './friends-player.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsPlayer } from '../shared/entities/FriendsPlayer';

@Module({
  imports: [TypeOrmModule.forFeature([FriendsPlayer])],
  providers: [FriendsPlayerResolver, FriendsPlayerService],
  exports: [FriendsPlayerService],
})
export class FriendsPlayerModule {}
