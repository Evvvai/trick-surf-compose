import { Intents } from 'discord.js'
import Client from './Client'

new Client({ intents: [Intents.FLAGS.GUILDS] }).init()
