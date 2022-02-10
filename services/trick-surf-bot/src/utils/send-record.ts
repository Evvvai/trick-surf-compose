import { ChannelManager, MessageEmbed, TextChannel } from 'discord.js'
import { RecordI, TypeRecordI } from '../types'

// Record
//////////////////////////////////////////////////////////////////////////////////////////////////
export const sendRecord = async (
  channels: ChannelManager,
  record: RecordI,
  typeRecord: TypeRecordI
) => {
  const Embed = new MessageEmbed()
    .setColor('#DAA520')
    .setTitle(`${record?.name} ${record?.point}`)
    .setURL('https://surfgxds.xyz/')
    .setAuthor(`${record?.nick}`, `${record?.avatar}`, `https://surfgxds.xyz/${record?.steamid64}`)
    .setDescription(typeRecord === TypeRecordI.swr ? 'Speed records' : 'Time records')
    .setThumbnail(`${record?.avatar}`)
    .addField(
      typeRecord === TypeRecordI.swr ? 'Now Speed' : 'Now Time',
      typeRecord === TypeRecordI.swr ? `${record?.res_speed}` : `${record?.res_time}`,
      true
    )
    .addField(
      typeRecord === TypeRecordI.swr ? 'Before Speed' : 'Before Time',
      typeRecord === TypeRecordI.swr ? `${record?.res_speed_before}` : `${record?.res_time_before}`,
      true
    )
    .addField(
      'Improve',
      typeRecord === TypeRecordI.swr
        ? `+${record?.res_speed - record?.res_speed_before}`
        : `${Math.round((record?.res_time - record?.res_time_before) * 100000) / 100000}`,
      true
    )
    .addField(`Before was`, record?.before_nick, false)
    // .setImage(
    //   'https://sun9-13.userapi.com/impg/g7QmV55UIlUSy8p3tdFqHytIZWq1uhgMoTEuiA/5QCzWUvZoVA.jpg?size=1080x1480&quality=96&sign=aee0be8788898eb0811d0d58ca7716c6&type=album'
    // )
    .setTimestamp()
    .setFooter(
      `surf_${record.map_name}`,
      typeRecord === TypeRecordI.swr
        ? 'https://firebasestorage.googleapis.com/v0/b/trick-a871a.appspot.com/o/icon%2Fspeed.png?alt=media&token=1c00e376-82dc-46aa-9547-e67dfbbe8381'
        : 'https://firebasestorage.googleapis.com/v0/b/trick-a871a.appspot.com/o/icon%2Ftime.png?alt=media&token=005350a8-4c36-4cf6-a34d-b09887ce8f15'
    )

  const channel = channels.cache.get(process.env.RECORD_CHANNEL || '') as TextChannel
  channel.send({ embeds: [Embed] })
}
