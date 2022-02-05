import { ChannelManager, HexColorString, MessageEmbed, TextChannel } from 'discord.js'
import { TrickI, TypeRecordI } from '../types'
import * as iconv from 'iconv-lite'
import { rgbToHex } from './rgb-to-hex'

// Trick
//////////////////////////////////////////////////////////////////////////////////////////////////
export const sendTrick = async (channels: ChannelManager, trick: TrickI) => {
  const value = trick?.point / 4 > 255 ? 255 : trick?.point / 4

  const Embed = new MessageEmbed()
    .setColor(rgbToHex(240, 240, value))
    .setTitle(`${trick?.name} ${trick?.point}`)
    .setURL('https://surfgxds.xyz/')
    .setAuthor(
      `${iconv.decode(iconv.encode(trick?.nick, 'win1252'), 'utf8')}`,
      `${trick.avatar}`,
      `https://surfgxds.xyz/${trick?.steamid64}`
    )
    .addField('Route', `${trick?.route_str}`, false)
    .addField(`ᅠ`, `${+trick?.velocity === 0 ? 'With pre-strafe' : 'With velocity'}`, false)
    .setTimestamp()
    .setFooter(`surf_${trick.map_name}`)

  const channel = channels.cache.get(process.env.TRICK_CHANNEL || '') as TextChannel
  channel.send({ embeds: [Embed] })
}
