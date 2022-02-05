import { ChannelManager } from 'discord.js'
import amqp from 'amqplib'
import initializeAMQP from './amqp'
import { QUEUE_NAMES } from '../config'
import { TypeRecordI, RecordI, CompleteI, TrickI, PlayerI } from '../types'
import { sendComplete, sendRecord, sendPlayer, sendTrick } from '../utils'

export default class AmqpConsumer {
  connection!: amqp.Connection
  channel!: amqp.Channel
  discordChannels!: ChannelManager

  async connect(discordChannels: ChannelManager) {
    try {
      const { connection, channel } = await initializeAMQP()

      channel.consume(QUEUE_NAMES.completes, (message: any) => {
        this.complete(JSON.parse(message.content.toString()))
        channel.ack(message)
      })

      channel.consume(QUEUE_NAMES.swr, (message: any) => {
        this.record(JSON.parse(message.content.toString()), TypeRecordI.swr)
        channel.ack(message)
      })

      channel.consume(QUEUE_NAMES.twr, (message: any) => {
        this.record(JSON.parse(message.content.toString()), TypeRecordI.twr)
        channel.ack(message)
      })

      channel.consume(QUEUE_NAMES.tricks, (message: any) => {
        this.trick(JSON.parse(message.content.toString()))
        channel.ack(message)
      })

      channel.consume(QUEUE_NAMES.player, (message: any) => {
        this.player(JSON.parse(message.content.toString()))
        channel.ack(message)
      })

      this.connection = connection
      this.channel = channel
      this.discordChannels = discordChannels

      console.log('AmqpConsumer connect')
    } catch (err) {
      console.error(err)
    }
  }

  complete(complete: CompleteI) {
    sendComplete(this.discordChannels, complete)
  }

  record(record: RecordI, typeRecord: TypeRecordI) {
    sendRecord(this.discordChannels, record, typeRecord)
  }

  trick(trick: TrickI) {
    sendTrick(this.discordChannels, trick)
  }

  player(player: PlayerI) {
    sendPlayer(this.discordChannels, player)
  }

  close() {
    this.channel.close()
    this.connection.close()
  }
}
