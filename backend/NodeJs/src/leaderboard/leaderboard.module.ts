import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardResolver } from './leaderboard.resolver';
import { LeaderboardService } from './leaderboard.service';
import { Completes } from 'src/shared/entities/Completes';
import { PlayersModule } from '../players/players.module';
import { LeaderboardCached } from 'src/shared/entities/LeaderboardCached';
import { LeaderboardCachedResolver } from './leaderboard-cached.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Completes, LeaderboardCached]),
    PlayersModule,
  ],
  providers: [
    LeaderboardResolver,
    LeaderboardCachedResolver,
    LeaderboardService,
  ],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
