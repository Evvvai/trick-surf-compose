import { Module } from '@nestjs/common';
import { PlayersService } from './service/players.service';
import { PlayersResolver } from './resolver/players.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Players } from 'src/shared/entities/Players';
import { FriendsPlayerModule } from '../friends-player/friends-player.module';
import { PlayersStatsResolver } from './resolver/players-stats.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Players]), FriendsPlayerModule],
  providers: [PlayersResolver, PlayersStatsResolver, PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
