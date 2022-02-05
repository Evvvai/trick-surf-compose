import { ChannelManager, MessageEmbed, TextChannel } from 'discord.js'
import { CompleteI } from '../types'
import { rgbToHex } from './rgb-to-hex'

// Complete
//////////////////////////////////////////////////////////////////////////////////////////////////
export const sendComplete = async (channels: ChannelManager, complete: CompleteI) => {
  const value = complete?.point / 4 > 255 ? 255 : complete?.point / 4

  const Embed = new MessageEmbed()
    .setColor(rgbToHex(240, 240, value))
    .setTitle(`${complete?.name} ${complete?.point}`)
    .setURL('https://surfgxds.xyz/')
    .setAuthor(
      `${complete?.nick}`,
      `${complete.avatar}`,
      `https://surfgxds.xyz/${complete?.steamid}`
    )
    .setThumbnail(`${complete.avatar}`)
    .addField('Time', `${complete?.time}`, true)
    .addField('Speed', `${complete?.speed}`, true)
    // .setImage(
    //   'https://sun9-13.userapi.com/impg/g7QmV55UIlUSy8p3tdFqHytIZWq1uhgMoTEuiA/5QCzWUvZoVA.jpg?size=1080x1480&quality=96&sign=aee0be8788898eb0811d0d58ca7716c6&type=album'
    // )
    .setTimestamp()
    .setFooter(
      `surf_${complete.map_name}`
      // ,'https://firebasestorage.googleapis.com/v0/b/trick-a871a.appspot.com/o/icon%2Fcomplete.png?alt=media&token=35639870-044a-486f-a651-b1c5f1d8f39a'
    )

  const channel = channels.cache.get(process.env.COMPLETE_CHANNEL || '') as TextChannel
  channel.send({ embeds: [Embed] })
}
