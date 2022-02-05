import { ChannelManager, MessageEmbed, TextChannel } from 'discord.js'
import { PlayerI } from '../types'

// Player
//////////////////////////////////////////////////////////////////////////////////////////////////
export const sendPlayer = async (channels: ChannelManager, player: PlayerI) => {
  if (!player) return

  const Embed = new MessageEmbed()
    .setColor('#000000')
    .setAuthor(
      `${player?.nick || 'unnamed'}`,
      `${player?.avatar || ''}`,
      `https://surfgxds.xyz/${player?.steamid64}`
    )
    .setTitle(`Joined a cult`)
    .setTimestamp()

  const channel = channels.cache.get(process.env.PLAYER_CHANNEL || '') as TextChannel
  channel.send({ embeds: [Embed] })
}
