// Rabbit
const AMQP_URI = {
  protocol: process.env.RABBIT_PROTOCOL,
  hostname: process.env.RABBIT_HOSTNAME,
  port: +process.env.RABBIT_PORT,
  username: process.env.RABBIT_USERNAME,
  password: process.env.RABBIT_PASSWORD,
  vhost: process.env.RABBIT_VHOST,
  authMechanism: ['PLAIN', 'AMQPLAN', 'EXTERNAL'],
}

enum QUEUE_NAMES {
  completes = 'completes',
  swr = 'swr',
  twr = 'twr',
  tricks = 'tricks',
  player = 'player',
}

export { AMQP_URI, QUEUE_NAMES }
