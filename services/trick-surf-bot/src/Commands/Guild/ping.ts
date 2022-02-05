import { Command } from '../../Interfaces'

export const command: Command = {
  name: 'ping',
  aliases: ['p'],
  run: async (client, message, args) => {
    message.channel.send(`${client.ws.ping} ping!`)
  },
}
