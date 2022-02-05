import { QUEUE_NAMES } from '@config'
import amqp from 'amqplib'
import initializeAMQP from './amqp'

const MS_BETWEEN_MESSAGES = 200

export default class AmqpProducer {
  connection: amqp.Connection
  channel: amqp.Channel

  async connect() {
    try {
      const { connection, channel } = await initializeAMQP()

      this.connection = connection
      this.channel = channel

      console.log('AmqpProducer connect')
    } catch (err) {
      console.error(err)
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise((res) => {
      setTimeout(res, ms)
    })
  }

  send(message: any, queue: QUEUE_NAMES) {
    // console.log('Starting producer...', message, queue)
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
  }

  close() {
    this.channel.close()
    this.connection.close()
  }
}

// interface Message {
//   id: string
//   message: string
// }

// let connection: amqp.Connection
// let channel: amqp.Channel

// function sleep(ms: number): Promise<void> {
//   return new Promise((res) => {
//     setTimeout(res, ms)
//   })
// }

// async function produce(): Promise<void> {
//   console.log('Starting producer...')

//   try {
//     ;({ connection, channel } = await initializeAMQP())
//   } catch (err) {
//     console.error(err)
//   }

//   let messagesSent = 0
//   while (messagesSent < MESSAGES_TO_SEND) {
//     // const message = buildMessage()
//     console.log(`Sending message with id ${'a'}...`)
//     channel.sendToQueue(QUEUE_NAMES.completes, Buffer.from(JSON.stringify('message')))
//     messagesSent += 1
//     await sleep(MS_BETWEEN_MESSAGES)
//   }

//   await channel.close()
//   await connection.close()
// }
// produce()
