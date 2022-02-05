import Client from '../Client'
import { Message } from 'discord.js'

type Run = (client: Client, message: Message, args: string[]) => void

export interface Command {
  name: string
  description?: string
  aliases: string[]
  run: Run
}
