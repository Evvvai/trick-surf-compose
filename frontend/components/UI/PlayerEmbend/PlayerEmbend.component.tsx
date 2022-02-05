import React, { FC, Fragment, useEffect, useState } from 'react'

// Style
import styles from './PlayerEmbend.module.scss'

// Utils
import cn from 'classnames'
import { Player } from '@store'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { changeDecode } from '../../../utils/changeDecode'

// Interface
interface Props {
  player: Player
  reverse?: boolean
}

// Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const PlayerEmbend: FC<Props> = ({ player, reverse = false }: Props) => {
  const router = useRouter()

  const [isLoad, setIsLoad] = useState<boolean>(false)

  const src =
    player.avatarCustom !== null
      ? player.avatarCustom
      : player.avatarfull
      ? player.avatarfull
      : (process.env.AVATAR_NULL as string)

  useEffect(() => {
    const image = new Image()
    image.src = src
    image.onload = () => {
      setIsLoad(true)
    }
  }, [])

  return (
    <div
      onClick={(e) => router.push('/' + player.steamid64)}
      className={styles.player}
    >
      {reverse ? (
        <Fragment>
          <div className={styles.playerNick}>{changeDecode(player.nick)}</div>
          <img
            className={cn(styles.playerImg, { [styles.isLoading]: !isLoad })}
            src={src}
          ></img>
        </Fragment>
      ) : (
        <Fragment>
          <img
            className={cn(styles.playerImg, { [styles.isLoading]: !isLoad })}
            src={src}
          ></img>
          <div className={styles.playerNick}>{changeDecode(player.nick)}</div>
        </Fragment>
      )}
    </div>
    // <Link href={'/' + player.steamid64}>
    //   <a>
    //     <div className={styles.player}>
    //       <img
    //         className={cn(styles.playerImg, { [styles.isLoading]: !isLoad })}
    //         src={src}
    //       ></img>
    //       <div className={styles.playerNick}>{player.nick}</div>
    //     </div>
    //   </a>
    // </Link>
  )
}

export default React.memo(PlayerEmbend)
