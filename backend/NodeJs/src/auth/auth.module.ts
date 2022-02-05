import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SteamAPIAuthService } from './steamapi-auth.service';
import { PassportModule } from '@nestjs/passport';
import { SteamStrategy } from './strategies/steam.strategy';
import { AuthController } from './auth.controller';
import { FriendsPlayerModule } from 'src/friends-player/friends-player.module';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [PassportModule, PlayersModule, FriendsPlayerModule],
  controllers: [AuthController],
  providers: [
    AuthResolver,
    AuthService,
    SteamAPIAuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    SteamStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
