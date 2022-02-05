import React, { useState } from 'react'

// Styles
import styles from './TrickEditorView.module.scss'

// Components
import TrickEditorViewItem from './trick-editor-view-item/TrickEditorViewItem.component'

// Custom hooks
import { useTrickEditor } from 'hooks/store/trick-editor'

// Utils

interface Props {}

///////////////////////////////////////////////////////////////////////////////////////////
export default function TrickEditorView(props: Props): JSX.Element {
  const { route } = useTrickEditor()
  const [currentDrag, setCurrentDrag] = useState<number>(0)

  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>
        {route.map((val, key) => {
          return (
            <TrickEditorViewItem
              key={key + val.name + val.id}
              trigger={val}
              index={key}
              setCurrentDrag={setCurrentDrag}
              currentDrag={currentDrag}
            />
          )
        })}
      </div>
    </div>
  )
}
