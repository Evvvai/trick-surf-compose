import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DATABASE_DB,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
  NODE_ENV,
} from '@environments';
// import { SnakeNamingStrategy } from '../strategies/snake-naming.strategy';

// Entity
import { Completes } from '../entities/Completes';
import { HopTriggers } from '../entities/HopTriggers';
import { Maps } from '../entities/Maps';
import { Players } from '../entities/Players';
import { Routes } from '../entities/Routes';
import { SuggestedRoutes } from '../entities/SuggestedRoutes';
import { SuggestedTricks } from '../entities/SuggestedTricks';
import { Swr } from '../entities/Swr';
import { SwrUpdate } from '../entities/SwrUpdate';
import { TimeOnline } from '../entities/TimeOnline';
import { TimeOnlineStatus } from '../entities/TimeOnlineStatus';
import { Tricks } from '../entities/Tricks';
// import { User } from '../entities/Users';
import { Triggers } from '../entities/Triggers';
import { TriggersTimeSpeedRoutes } from '../entities/TriggersTimeSpeedRoutes';
import { TriggersTimeSpeedTouch } from '../entities/TriggersTimeSpeedTouch';
import { Twr } from '../entities/Twr';
import { TwrUpdate } from '../entities/TwrUpdate';
import { FriendsPlayer } from '../entities/FriendsPlayer';
import { SuggestedTricksRates } from '../entities/SuggestedTricksRate';
import { LeaderboardCached } from '../entities/LeaderboardCached';
import { TwrLostNotify } from '../entities/TwrLostNotify';
import { SwrLostNotify } from '../entities/SwrLostNotify';

export class ConfigService {
  constructor() {
    /**
     *
     */
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    const entities = [
      FriendsPlayer,
      Completes,
      HopTriggers,
      Maps,
      Players,
      Routes,
      SuggestedRoutes,
      SuggestedTricks,
      SuggestedTricksRates,
      Swr,
      SwrUpdate,
      TimeOnline,
      TimeOnlineStatus,
      Tricks,
      Triggers,
      TriggersTimeSpeedRoutes,
      TriggersTimeSpeedTouch,
      Twr,
      TwrUpdate,
      LeaderboardCached,
      TwrLostNotify,
      SwrLostNotify,
    ];

    return {
      entities,
      keepConnectionAlive: true,
      type: DATABASE_TYPE,
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      username: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_DB,
      synchronize: NODE_ENV === 'production' ? false : true,
      migrations: [__dirname + '../migrations/**/*{.ts,.js}'],
      // migrationsRun: true,
      // namingStrategy: new SnakeNamingStrategy(),
      // logging: this.nodeEnv === 'development',
    };
  }
}
