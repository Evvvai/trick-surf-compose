import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TricksResolver } from './resolver/tricks.resolver';
import { TricksService } from './service/tricks.service';
import { Tricks } from 'src/shared/entities/Tricks';
import { Triggers } from 'src/shared/entities/Triggers';
import { Routes } from 'src/shared/entities/Routes';
import { TricksStatsResolver } from './resolver/tricks-stats.resolver';
import { SuggestedTricks } from 'src/shared/entities/SuggestedTricks';
import { IsValidTrickNameConstraint } from './decorators/valid-trick-name.decorator';
import { SuggestedRoutes } from 'src/shared/entities/SuggestedRoutes';
import { PlayersModule } from '../players/players.module';
import { SuggestedTricksService } from './service/suggested-tricks.service';
import { SuggestedTricksResolver } from './resolver/suggested-tricks.resolver';
import { SuggestedTricksRates } from 'src/shared/entities/SuggestedTricksRate';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tricks,
      Routes,
      Triggers,
      SuggestedTricks,
      SuggestedRoutes,
      SuggestedTricksRates,
    ]),
    PlayersModule,
  ],
  providers: [
    TricksResolver,
    TricksStatsResolver,
    TricksService,
    SuggestedTricksResolver,
    SuggestedTricksService,
    IsValidTrickNameConstraint,
  ],
  exports: [TricksService, SuggestedTricksService],
})
export class TricksModule {}
