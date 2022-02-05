import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SteamAuthGuard extends AuthGuard('steam') {
  constructor() {
    super();
  }

  handleRequest(err, player, info) {
    console.log('SteamAuthGuard');

    if (err) throw err;
    // We return the user, even if it's a null
    return player;
  }
}
