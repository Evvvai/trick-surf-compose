import React, { useState, useEffect } from 'react'

// Styles
import styles from './TricksRelated.module.scss'

// Components
import TricksItem from '../tricks-item/TricksItem.component'

// Custom hooks
import { usePlayer } from '../../../hooks/store/player/usePlayer'
import { useTrickFilters } from 'hooks/store/trick/useTrickFilters'

// Utils
import { Trick, Trigger } from '@store'
import { useTrick } from 'hooks/store/trick'

interface Props {
  triggers: Trigger[]
  baseTrick: Trick
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function TricksRelated({
  triggers,
  baseTrick,
}: Props): JSX.Element {
  const { tricks } = useTrick()

  const [relatedTrick, setRelatedTrick] = useState<Trick[]>([])

  useEffect(() => {
    findRelatedTricks(baseTrick.routeIds)
  }, [])

  const findRelatedTricks = async (route: string) => {
    const findedTricks: Trick[] = []

    let actualRoute = route.substring(0, route.lastIndexOf(','))
    const triggers = actualRoute.split(',')

    triggers.forEach(() => {
      tricks.forEach((val) => {
        if (
          val.routeIds.startsWith(actualRoute) &&
          !findedTricks.find((x) => x.id === val.id) &&
          val.id !== baseTrick.id
        ) {
          findedTricks.push(val)
        }
      })
      actualRoute = actualRoute.substring(0, actualRoute.lastIndexOf(','))
    })
    setRelatedTrick(findedTricks)
  }

  return (
    <div className={styles.related}>
      <div className={styles.relatedTitle}>
        <div className={styles.relatedLine} />
        <div className={styles.relatedText}>Start related tricks</div>
      </div>

      {relatedTrick.map((trick) => {
        return <TricksItem key={trick.id} trick={trick} triggers={triggers} />
      })}

      <div className={styles.relatedTitle}>
        <div className={styles.relatedLine} />
        <div className={styles.relatedText}>End related tricks</div>
      </div>
      <div className={styles.relatedBar}>
        <div className={styles.relatedBarLine} />
        <div className={styles.relatedBarAmmount}>
          <div className={styles.relatedBarAmmountText}>
            <div>x{relatedTrick.length}</div>
            <div>tricks</div>
            <div>related</div>
            <div>{baseTrick.name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
