import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [AuthModule, PlayersModule],
  providers: [SocketGateway],
})
export class SocketModule {}
