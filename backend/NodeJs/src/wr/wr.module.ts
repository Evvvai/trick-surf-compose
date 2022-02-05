import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from '../players/players.module';
import { Swr } from 'src/shared/entities/Swr';
import { Twr } from '../shared/entities/Twr';
import { WRResolver } from './resolver/wr.resolver';
import { WRService } from './service/wr.service';
import { Completes } from 'src/shared/entities/Completes';
import { TwrLostNotify } from 'src/shared/entities/TwrLostNotify';
import { SwrLostNotify } from 'src/shared/entities/SwrLostNotify';
import { WRNotifyService } from './service/wr-notify.service';
import { WRNotifyResolver } from './resolver/wr-notify.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Completes,
      Swr,
      Twr,
      TwrLostNotify,
      SwrLostNotify,
    ]),
    PlayersModule,
  ],
  providers: [WRResolver, WRService, WRNotifyResolver, WRNotifyService],
  exports: [WRService, WRNotifyService],
})
export class WRModule {}

// @Module({
//   imports: [TypeOrmModule.forFeature([Completes, Swr, Twr]), PlayersModule],
//   providers: [WRResolver, WRService],
//   exports: [WRService],
// })
// export class WRModule {}
