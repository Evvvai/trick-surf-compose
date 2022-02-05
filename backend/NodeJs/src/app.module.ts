import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CacheService, LoggingInterceptor } from './config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from './shared/services/config.service';

// Module
import { TricksModule } from './tricks/tricks.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { SharedModule } from './shared/shared.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { PlayersModule } from './players/players.module';
import { FriendsPlayerModule } from './friends-player/friends-player.module';
import { MapsModule } from './maps/maps.module';
import { TriggersModule } from './triggers/triggers.module';
import { WRModule } from './wr/wr.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        origin: '*',
        credentials: true,
      },
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),
    MapsModule,
    PlayersModule,
    LeaderboardModule,
    AuthModule,
    SocketModule,
    TriggersModule,
    TricksModule,
    FriendsPlayerModule,
    WRModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
