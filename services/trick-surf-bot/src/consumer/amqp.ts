import * as amqp from 'amqplib'
import { AMQP_URI, QUEUE_NAMES } from '../config'

interface AMQPInitializeResult {
  connection: amqp.Connection
  channel: amqp.Channel
}

export default async function initializeAMQP(): Promise<AMQPInitializeResult> {
  const connection = await amqp.connect(AMQP_URI)
  const channel = await connection.createChannel()

  Object.values(QUEUE_NAMES).forEach((queueName: string) => channel.assertQueue(queueName))

  return { connection, channel }
}
