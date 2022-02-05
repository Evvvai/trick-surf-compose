import { Fragment, useRef, useEffect, useState } from 'react'
import Head from 'next/head'

// Styles
import styles from '../../styles/trick-editor/TrickEditor.module.scss'

// Icons

// Components
import TrickEditorSubmit from '../../components/trick-editor/trick-editor-submit/TrickEditorSubmit.component'
import TrickEditorSelector from '../../components/trick-editor/trick-editor-selector/TrickEditorSelector.component'
import TrickEditorView from '../../components/trick-editor/trick-editor-view/TrickEditorView.component'

// Custom hook
import { useApp } from 'hooks/store/app'

// Utils
import { TRICKS_STATS, TRIGGERS } from 'types/graphql/quary'
import { Maps } from '@types'
import { clientHandle, serverHandle } from 'utils/graphql'
import { loadedTrickEditor } from 'stores/trick-editor.slice'
import { changedMap } from 'stores/app.slice'
import { useRouter } from 'next/router'
import { useTrickEditor } from 'hooks/store/trick-editor'
import { loadedTricks } from 'stores/trick.slice'

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Tricks = (props: Props) => {
  const router = useRouter()
  const { currentMap } = useApp()
  const { loadTrickEditor } = useTrickEditor()

  const mounted = useRef<boolean | null>(null)
  useEffect(() => {
    !mounted.current ? (mounted.current = true) : loadTrickEditor(currentMap)

    router.push(
      {
        pathname: '/trick-editor/' + currentMap?.name,
      },
      undefined,
      { shallow: true }
    )
  }, [currentMap])

  return (
    <Fragment>
      <Head>
        <title>{currentMap.alternativeName + ' | Trick editor'}</title>
        <meta
          name="description"
          content={`Trick editor for the ${currentMap.alternativeName}`}
        />
      </Head>
      <section className={styles.content}>
        <div className={styles.title}>
          <h1>Trick editor</h1>
          {/* <hr /> */}
        </div>
        <div className={styles.contentInner}>
          <TrickEditorSelector />
          <TrickEditorView />
        </div>
        <TrickEditorSubmit />
      </section>
    </Fragment>
  )
}

export default Tricks

Tricks.getInitialProps = async ({ query, store, res }) => {
  const isTriggerLoad = store.getState().trick.isLoad
  const isEditorLoad = store.getState().trickEditor.isLoad

  if (!isTriggerLoad) {
    const currentMap = store.getState().app.currentMap
    const [triggers, triggersErrors] = await serverHandle(res, TRIGGERS, {
      mapId: currentMap.id,
    })
    const [tricks, errorsTricks] = await serverHandle(res, TRICKS_STATS, {
      mapId: currentMap.id,
      steamId: store.getState().player.playerInfo?.steamid64,
    })
    store.dispatch(loadedTricks({ tricks, triggers }))
    store.dispatch(loadedTrickEditor(triggers))
  } else if (!isEditorLoad) {
    store.dispatch(loadedTrickEditor(store.getState().trick.triggers))
  }
}
