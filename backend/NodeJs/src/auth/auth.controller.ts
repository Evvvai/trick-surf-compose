/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SteamAuthGuard } from './guards/steam-auth.guard';
import { AuthService } from './auth.service';
import { ReqPlayer } from './decorators/req-player.paramdecorator';
import { Players } from 'src/shared/entities/Players';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('steam')
  @UseGuards(SteamAuthGuard)
  steamLogin() {}

  @Get('steam/return')
  @UseGuards(SteamAuthGuard)
  steamLoginCallback(@ReqPlayer() player: Players | null, @Res() res) {
    this.authService.authSteam(player, res);
  }

  @Put('update')
  updatePlayer(@Body('steamid64') steamid64: string) {
    this.authService.updatePlayerData(steamid64);
  }

  @Post('create')
  createPlayer(@Body('steamid64') steamid64: string) {
    this.authService.steamValidation(null, { id: steamid64 });
  }
}
