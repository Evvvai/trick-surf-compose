import db from '../config/db'
import * as iconv from 'iconv-lite'
import AmqpProducer from '../producer'
import { RecordI } from '@types'
import { QUEUE_NAMES } from '../config'

type TypeRecord = 'twr' | 'swr'

// Record
//////////////////////////////////////////////////////////////////////////////////////////////////
export const newRecord = async (
  eventMessage: any,
  producer: AmqpProducer,
  typeRecord: TypeRecord
) => {
  try {
    db.query(
      `
    SELECT  su.now_wr,
            su.before_wr,
            sc.trick_id,
            st.name,
            st.point,
            sc.speed res_speed,
            scc.speed res_speed_before,
            sc.time res_time,
            scc.time res_time_before,
            p.steamid64,
            p.nick,
            pp.steamid before_steamid,
            pp.nick before_nick,
			      m.id map_id,
            m.name map_name,
            if(ISNULL(p.avatarCustom), if(ISNULL(p.avatarfull), '${process.env.NONE_AVATAR}', p.avatarfull), p.avatarCustom) avatar

    FROM ${typeRecord}_update su
    JOIN completes sc ON sc.id = su.now_wr
    JOIN completes scc ON scc.id = su.before_wr
    JOIN tricks st ON st.id = sc.trick_id
    JOIN players p ON p.id = sc.player_id
    JOIN players pp ON pp.id = scc.player_id
    JOIN maps m ON m.id = st.map_id
    WHERE sc.date_add >= FROM_UNIXTIME(${eventMessage.timestamp} * POWER(10, 9 - FLOOR(LOG10(${eventMessage.timestamp}))))
    LIMIT 1;
    `,
      async (err, result) => {
        if (!err) {
          if (result.length === 0) return
          const data: RecordI = result[0]

          // Fix awesome encoding by valve
          data.nick = iconv.decode(iconv.encode(data?.nick, 'win1252'), 'utf8')
          data.before_nick = iconv.decode(iconv.encode(data?.before_nick, 'win1252'), 'utf8')

          // console.log('data', data)

          producer.send(data, QUEUE_NAMES[typeRecord])
        } else {
          console.log('err', err)
        }
      }
    )
  } catch (e) {
    console.log('err', e)
  }
}
