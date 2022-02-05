import React from 'react'

// Styles
import styles from './SuggestedTricksListHeader.module.scss'

// Icons
import { GiAbstract065 } from 'react-icons/gi'

// Components

// Custom hooks
import { usePlayer } from '../../../hooks/store/player/usePlayer'

// Utils
import { useRouter } from 'next/dist/client/router'
import cn from 'classnames'

///////////////////////////////////////////////////////////////////////////////////////////
export default function SuggestedTricksListHeader(): JSX.Element {
  const { isLoggedIn } = usePlayer()

  const router = useRouter()

  return (
    <div className={styles.content}>
      <div className={cn(styles.item, styles.itemStatus)}>
        <GiAbstract065 />
      </div>

      <div className={cn(styles.item, styles.itemTn)}>
        <div>trick</div>
        <div>Name</div>
      </div>

      <div className={cn(styles.item, styles.itemTp)}>
        <div>trick</div>
        <div>points</div>
      </div>

      <div className={cn(styles.item, styles.itemAuthor)}>
        <div>author</div>
      </div>

      <div className={cn(styles.item, styles.itemRate)}>
        <div>rate</div>
      </div>

      <div className={cn(styles.item, styles.itemDateAdded)}>
        <div>date</div>
        <div>added</div>
      </div>
    </div>
  )
}
