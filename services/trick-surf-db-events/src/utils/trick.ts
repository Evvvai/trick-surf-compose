import db from '../config/db'
import * as iconv from 'iconv-lite'
import AmqpProducer from '../producer'
import { TrickI } from '@types'
import { QUEUE_NAMES } from '../config'

// Trick
//////////////////////////////////////////////////////////////////////////////////////////////////
export const newTrick = async (eventMessage: any, producer: AmqpProducer) => {
  try {
    db.query(
      `
    SELECT t.id,
        t.name,
        t.point,
        t.velocity,
        p.steamid,
        p.steamid64,
        p.nick,
        m.id map_id,
        m.alternative_name map_name,
        t.route_str,
        if(ISNULL(p.avatarCustom), if(ISNULL(p.avatarfull), '${process.env.NONE_AVATAR}', p.avatarfull), p.avatarCustom) avatar

    FROM tricks_route_viewer t
    JOIN players p ON p.steamid64 = t.author_steamid
    JOIN maps m ON m.id = t.map_id
    WHERE t.date_add >= FROM_UNIXTIME(${eventMessage.timestamp} * POWER(10, 9 - FLOOR(LOG10(${eventMessage.timestamp}))))
    LIMIT 1;
    `,
      async (err, result) => {
        if (!err) {
          if (result.length === 0) return
          const data: TrickI = result[0]

          // Fix awesome encoding by valve
          data.nick = iconv.decode(iconv.encode(data?.nick, 'win1252'), 'utf8')

          // console.log('data', data)

          producer.send(data, QUEUE_NAMES.tricks)
        } else {
          console.log('err', err)
        }
      }
    )
  } catch (e) {
    console.log('err', e)
  }
}
