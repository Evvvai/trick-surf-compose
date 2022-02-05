import {
  AMQP_URI,
  JWT_SECRET,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} from '@environments';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';
import { RediskaService } from './services/rediska.service';
import { AmqpService } from './services/amqp.service';

const providers = [
  ConfigService,
  ValidatorService,
  GeneratorService,
  RediskaService,
  AmqpService,
];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JWT_SECRET,
        // if you want to use token with expiration date
        // signOptions: {
        //     expiresIn: JWT_EXPIRATION_TIME,
        // },
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRoot({
      config: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
      },
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: AMQP_URI,
      connectionInitOptions: { wait: false },
    }),
  ],
  exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}
