import * as dotenv from 'dotenv';
dotenv.config();

const db = ['postgres', 'mysql', 'mariadb'] as const;
type DB = typeof db[number];

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'development';
const CLIENT_HOST: string = process.env.CLIENT_HOST || 'http://localhost:3000';
const SERVER_HOST: string = process.env.SERVER_HOST || 'http://localhost';

// colors
const DEBUG_COLOR: string = process.env.DEBUG_COLOR || '#00BFFF';
const LOG_COLOR: string = process.env.LOG_COLOR || '#DDA0DD';
const PRIMARY_COLOR: string = process.env.PRIMARY_COLOR || '#FFA07A';
const ERROR_COLOR: string = process.env.ERROR_COLOR || '#DC143C';

// application
const DOMAIN: string = process.env.DOMAIN || 'localhost';
const PORT: number = +process.env.PORT || 8080;
const END_POINT: string = process.env.END_POINT || 'graphql';
const RATE_LIMIT_MAX: number = +process.env.RATE_LIMIT_MAX || 10_000;
const GRAPHQL_DEPTH_LIMIT: number = +process.env.GRAPHQL_DEPTH_LIMIT || 3;

// redis
const REDIS_HOST: string = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT: number = +process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || 'password';

// Amqp
const AMQP_URI: string =
  process.env.AMQP_URI || 'amqp://rabbitmq:rabbitmq@localhost:5672';

// typeorm
const DATABASE_TYPE: DB =
  db[db.findIndex((x) => x === (process.env?.DATABASE_TYPE || 'mysql'))];
const DATABASE_HOST: string = process.env.DATABASE_HOST || 'localhost';
const DATABASE_PORT: number = +process.env.DATABASE_PORT || 5432;
const DATABASE_USER: string = process.env.DATABASE_USER || 'root';
const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || 'root';
const DATABASE_DB: string = process.env.DATABASE_DB || 'csurf';

// jsonwebtoken
const JWT_SECRET: string = process.env.JWT_SECRET || 'SECRET';
const JWT_REFRESH_SECRET: string =
  process.env.JWT_REFRESH_SECRET || 'refresh-token-key';

// bcrypt
const BCRYPT_SALT: number = +process.env.BCRYPT_SALT || 10;

// Steam
const STEAM_API_KEY: string = process.env.STEAM_API_KEY || '';

// CSGO Config
const GAME_APPID: number = +process.env.GAME_APPID || 730;
const MIN_GAME_HOURS: number = +process.env.MIN_GAME_HOURS || 1;

export {
  NODE_ENV,
  AMQP_URI,
  CLIENT_HOST,
  PRIMARY_COLOR,
  DOMAIN,
  PORT,
  END_POINT,
  RATE_LIMIT_MAX,
  GRAPHQL_DEPTH_LIMIT,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  BCRYPT_SALT,
  DATABASE_TYPE,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_DB,
  STEAM_API_KEY,
  GAME_APPID,
  MIN_GAME_HOURS,
  SERVER_HOST,
  DEBUG_COLOR,
  LOG_COLOR,
  ERROR_COLOR,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
};
