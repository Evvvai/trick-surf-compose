import React from 'react'

// Styles
import styles from './LeaderboardListHeader.module.scss'

// Components

// Custom hooks
import { usePlayer } from '../../../hooks/store/player/usePlayer'

// Utils
import { useRouter } from 'next/dist/client/router'
import cn from 'classnames'

///////////////////////////////////////////////////////////////////////////////////////////
export default function LeaderboardListHeader(): JSX.Element {
  const { isLoggedIn } = usePlayer()

  const router = useRouter()

  return (
    <div className={styles.content}>
      <div className={cn(styles.item, styles.itemInd)}>
        <div>#</div>
      </div>

      <div className={cn(styles.item, styles.itemPlayer)}>
        <div>Player</div>
      </div>

      <div className={cn(styles.item, styles.itemAvg)}>
        <div>avg</div>
      </div>

      <div className={cn(styles.item, styles.itemPc)}>
        <div>percent</div>
        <div>completes</div>
      </div>

      <div className={cn(styles.item, styles.itemData)}>
        <div>all</div>
        <div>points</div>
      </div>

      <div className={cn(styles.item, styles.itemData)}>
        <div>unique</div>
        <div>points</div>
      </div>

      <div className={cn(styles.item, styles.itemData)}>
        <div>all</div>
        <div>counts</div>
      </div>

      <div className={cn(styles.item, styles.itemData)}>
        <div>unique</div>
        <div>counts</div>
      </div>
    </div>
  )
}
