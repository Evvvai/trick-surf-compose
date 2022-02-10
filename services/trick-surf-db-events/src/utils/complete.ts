import db from '../config/db'
import * as iconv from 'iconv-lite'
import AmqpProducer from '../producer'
import { CompleteI } from '@types'
import { QUEUE_NAMES } from '../config'

// Complete
//////////////////////////////////////////////////////////////////////////////////////////////////
export const newComplete = async (eventMessage: any, producer: AmqpProducer) => {
  try {
    db.query(
      `
    SELECT sc.time,
           sc.speed,
           st.name,
           st.point,
           p.steamid64,
           p.nick,
           m.id map_id,
           m.alternative_name map_name,
           if(ISNULL(p.avatarCustom), if(ISNULL(p.avatarfull), '${process.env.NONE_AVATAR}', p.avatarfull), p.avatarCustom) avatar

    FROM completes sc
    JOIN tricks st ON st.id = sc.trick_id
    JOIN players p ON p.id = sc.player_id
    JOIN maps m ON m.id = st.map_id
    WHERE sc.date_add >= FROM_UNIXTIME(${eventMessage.timestamp} * POWER(10, 9 - FLOOR(LOG10(${eventMessage.timestamp}))))
    LIMIT 1;
    `,
      async (err, result) => {
        if (!err) {
          if (result.length === 0) return
          const data: CompleteI = result[0]

          // Fix awesome encoding by valve
          data.nick = iconv.decode(iconv.encode(data?.nick, 'win1252'), 'utf8')

          // console.log('data', data)

          producer.send(data, QUEUE_NAMES.completes)
        } else {
          console.log('err', err)
        }
      }
    )
  } catch (e) {
    console.log('err', e)
  }
}
