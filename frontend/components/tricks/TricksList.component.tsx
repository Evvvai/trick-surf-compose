import React from 'react'

// Styles
import styles from './TricksList.module.scss'

// Components
import TricksItem from './tricks-item/TricksItem.component'
import TricksListHeader from './tricks-header/TricksListHeader.component'

// Custom hooks

// Utils
import { Trick, Trigger } from '@store'

interface Props {
  tricks: Trick[]
  triggers: Trigger[]
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function TricksList({ tricks, triggers }: Props): JSX.Element {
  return (
    <div className={styles.list}>
      <TricksListHeader />
      {tricks?.map((trick) => {
        return <TricksItem key={trick.id} trick={trick} triggers={triggers} />
      })}
    </div>
  )
}
