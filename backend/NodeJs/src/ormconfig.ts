import { ConnectionOptions } from 'typeorm';

import {
  DATABASE_DB,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
} from '@environments';

const config: ConnectionOptions = {
  type: DATABASE_TYPE,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_DB,

  // entities: [__dirname + '/shared/entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/shared/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/shared/migrations/',
  },
};

export = config;
