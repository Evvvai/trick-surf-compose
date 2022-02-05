import dotenv from 'dotenv'
dotenv.config()

import { Client, Collection } from 'discord.js'
import { Command, Event } from '../Interfaces'

import AmqpConsumer from '../consumer'

// Client
//////////////////////////////////////////////////////////////////////////////////////////
class ExtendedClient extends Client {
  public commands: Collection<string, Command> = new Collection()
  public aliases: Collection<string, Command> = new Collection()
  public events: Collection<string, Event> = new Collection()
  prefix: string = process.env.PREFIX || '!'

  public async init() {
    this.login(process.env.TOKEN)
    this.on('ready', () => {
      console.log(`Logged in as ${this.user?.tag} !`)

      const consmer = new AmqpConsumer()
      consmer.connect(this.channels)
    })

    /* No need for this  */
    /* Commands  */
    // const commandPath = path.join(__dirname, '..', 'Commands')
    // readdirSync(commandPath).forEach((dir) => {
    //   const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts'))
    //   for (const file of commands) {
    //     const { command } = require(`${commandPath}/${dir}/${file}`)
    //     this.commands.set(command.name, command)
    //     if (command?.aliases.lenght !== 0) {
    //       command.aliases.forEach((alias: any) => {
    //         this.aliases.set(alias, command)
    //       })
    //     }
    //   }
    // })
    /* No need for this  */
    /* Events  */
    // const eventPath = path.join(__dirname, '..', 'Events')
    // readdirSync(eventPath).forEach(async (file) => {
    //   const { event } = await import(`${eventPath}/${file}`)
    //   this.events.set(event.name, event)
    //   this.on(event.name, event.run.bind(null, this))
    // })
  }
}

export default ExtendedClient
