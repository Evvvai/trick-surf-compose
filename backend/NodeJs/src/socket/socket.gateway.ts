import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CLIENT_HOST, PORT, SERVER_HOST } from '@environments';

import * as os from 'os';
import { RediskaService } from '../shared/services/rediska.service';
import { PlayersService } from 'src/players/service/players.service';
import { PlayersI } from 'src/players/entities/players.interface';
import {
  FriendI,
  StatusFriend,
} from 'src/friends-player/entities/friend.interface';

@WebSocketGateway({
  cors: {
    origin: ['*', CLIENT_HOST, SERVER_HOST + ':' + PORT],
    credentials: true,
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly playersService: PlayersService,
    private readonly authService: AuthService,

    public readonly rediskaService: RediskaService,
  ) {}

  async onModuleInit() {
    await this.rediskaService.clear();

    Logger.debug(' > onModuleInit');
  }

  async afterInit(server: Server) {
    Logger.debug(' > afterInit ' + os.cpus().length);
  }

  private disconnect(socket: Socket) {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const player: PlayersI = await this.playersService.findPlayerBySteamId64(
        decodedToken.steamid64,
      );

      if (!player) return this.disconnect(socket);

      /****************************************************************/

      this.rediskaService.add(player.id, socket.id);

      socket.data.player = player;
      socket.join('uid' + player.id);

      // Gets all friends
      const allFriends = await this.playersService.getAllFriends(player.id);

      const onlineFriends = await this.rediskaService.getAllByIds(
        allFriends.map((x) => x.id),
      );

      const friends: FriendI[] = [...allFriends];
      friends.map((x) => {
        onlineFriends.find((y) => +y.playerId === +x.id) !== undefined
          ? (x.online = true)
          : (x.online = false);

        x.status = {} as StatusFriend;
        x.status.action = '. . .';

        return x;
      });
      this.server.to(socket.id).emit('friend/load', friends);
      socket.data.friends = allFriends;

      // *Redis
      const allPlayerConnection = await this.rediskaService.getAll(player.id);

      socket.data.sockets = allPlayerConnection;
      allPlayerConnection.forEach((socketSync) => {
        this.server.sockets.sockets.get(socketSync).data.sockets =
          allPlayerConnection;
      });

      // Notife friend about Player is online
      if (allPlayerConnection.length === 1) {
        onlineFriends.forEach((player) => {
          return (
            this.server
              // .to(player.socketId)
              .to('uid' + player.playerId)
              .emit('friend/online', socket.data.player.id)
          );
        });
      }

      Logger.debug(' > handleConnection | ' + socket.data.player?.nick);
      return this.server.to(socket.id).emit('connected');
    } catch (e) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    if (!socket.data?.player?.id) return;

    // *Redis
    await this.rediskaService.remove(socket.data.player.id, socket.id);
    const isLastConnect = await this.rediskaService.ammount(
      socket.data.player.id,
    );

    // Notify friend about user is offline and update last seen
    if (isLastConnect === 0) {
      this.playersService.updateLastSeenSite(socket.data.player);

      if (!socket.data.friends) return;

      // *Redis
      const onlineFriends = await this.rediskaService.getAllByIds(
        socket.data.friends.map((x) => x.id),
      );

      onlineFriends.forEach(async (player) => {
        this.server
          // .to(player.socketId)
          .to('uid' + player.playerId)
          .emit('friend/offline', socket.data.player.id);
      });
    }
    socket.disconnect();
    Logger.debug(' > handleDisconnect | ' + socket.data.player?.nick);
  }
}
