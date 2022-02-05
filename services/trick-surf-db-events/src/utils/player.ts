import db from '../config/db'
import axios from 'axios'
import * as iconv from 'iconv-lite'
import AmqpProducer from '../producer'
import { QUEUE_NAMES } from '../config'
import { PlayerI } from '../types'

// Player
//////////////////////////////////////////////////////////////////////////////////////////////////
export const newPlayer = async (eventMessage: any, producer: AmqpProducer) => {
  try {
    db.query(
      `
    SELECT  steamid,
            steamid64,
            nick,
            if(ISNULL(avatarCustom), if(ISNULL(avatarfull), '${process.env.NONE_AVATAR}', avatarfull), avatarCustom) avatar

    FROM players
    WHERE t.date_joined >= FROM_UNIXTIME(${eventMessage.timestamp} * POWER(10, 9 - FLOOR(LOG10(${eventMessage.timestamp}))))
    LIMIT 1;
    `,
      async (err, result) => {
        if (!err) {
          if (result.length === 0) return

          const { data } = await axios.put<PlayerI>(process.env.BACKEND_URL + '/auth/update', {
            steamid64: result[0].steamid64,
          })

          producer.send(data, QUEUE_NAMES.player)
        } else {
          console.log('err', err)
        }
      }
    )
  } catch (e) {
    console.log('err', e)
  }
}
