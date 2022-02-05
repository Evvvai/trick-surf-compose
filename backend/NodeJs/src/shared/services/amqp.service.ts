import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AmqpService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  // @RabbitSubscribe({
  //   exchange: 'exchange1',
  //   routingKey: 'rpc-route',
  //   queue: 'rpc-queue',
  // })
  // public async pubSubHandler(msg: {}) {
  //   console.log(`Received message: ${JSON.stringify(msg)}`);
  // }

  async newTrick(queue: string, message: any) {
    this.amqpConnection.publish('', queue, message);
  }
}
