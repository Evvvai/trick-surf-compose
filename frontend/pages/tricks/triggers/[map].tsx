import { Fragment, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import type { ReactElement } from 'react'

// Layouts
import TricksPath from 'components/layouts/TricksPath.layout'

// Styles
import styles from '../../../styles/tricks/Triggers.module.scss'

// Icons
import { VscGitPullRequestCreate } from 'react-icons/vsc'
import { FaEdit } from 'react-icons/fa'

// Components
import Modal from 'components/UI/Modal/Modal.component'
import MyInput from '../../../components/UI/MyInput/MyInput.component'
import CreateTrigger from '../../../components/triggers/create-trigger/CreateTrigger.component'
import EditTrigger from '../../../components/triggers/edit-trigger/EditTrigger.component'
import TriggerImage from '../../../components/UI/MyImage/TriggerImage/TriggerImage.component'

// Custom hook
import { useApp } from 'hooks/store/app'
import { useRouter } from 'next/router'

// Utils
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import cn from 'classnames'
import { serverHandle } from 'utils/graphql'
import { TRICKS_STATS, TRIGGERS } from 'types/graphql/quary'
import { Trigger } from '@store'
import { Portal } from 'utils/portal'
import { useTrick } from 'hooks/store/trick'
import { loadedTricks } from 'stores/trick.slice'
import { usePlayer } from 'hooks/store/player'

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Triggers = (props: Props) => {
  const router = useRouter()
  const { triggers, loadTricks } = useTrick()
  const { currentMap } = useApp()
  const { playerInfo } = usePlayer()

  const [isCreatorOpen, setIsCreatorOpen] = useState<boolean>(false)
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false)
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger>({} as Trigger)

  const [term, setTerm] = useState<string>('')
  const [filteredTriggers, setFilteredTriggers] = useState<Trigger[]>(triggers) // Need migrate into store

  const filteringTriggers = (term: string) => {
    setFilteredTriggers([...triggers].filter((val) => val.name.includes(term)))
  }

  const mounted = useRef<boolean | null>(null)
  useEffect(() => {
    !mounted.current
      ? (mounted.current = true)
      : loadTricks(currentMap, playerInfo?.steamid64)

    router.push(
      {
        pathname: '/tricks/triggers/' + currentMap?.name,
      },
      undefined,
      { shallow: true }
    )
  }, [currentMap])

  useEffect(() => {
    if (mounted.current) setFilteredTriggers(triggers)
  }, [triggers])

  return (
    <Fragment>
      <Head>
        <title>{currentMap.alternativeName + ' | Triggers'}</title>
        <meta
          name="description"
          content={`List of all available triggers for the ${currentMap.alternativeName} map`}
        />
      </Head>
      <section className={styles.triggers}>
        <div className={styles.content}>
          <div className={styles.control}>
            <MyInput
              label={'write term'}
              model={{ value: term, setValue: setTerm }}
              type={'text'}
              name={'search'}
              callback={filteringTriggers}
              debounce={350}
            />
            <div
              className={styles.controlFilters}
              onClick={(e) => setIsCreatorOpen(true)}
            >
              <VscGitPullRequestCreate />
              <Portal selector="#modal">
                <Modal isOpen={isCreatorOpen} setOpen={setIsCreatorOpen}>
                  <CreateTrigger />
                </Modal>
              </Portal>
            </div>
          </div>

          <div className={styles.list}>
            {filteredTriggers.map((triggerItem) => {
              const matches = match(triggerItem.name, term)
              const parts = parse(triggerItem.name, matches)

              return (
                <div key={triggerItem.id} className={styles.listItem}>
                  <div
                    className={cn(styles.listItemInner, {
                      [styles.listItemInnerActive]: false,
                    })}
                  >
                    <div className={styles.listItemTitle}>
                      {parts.map((part, key) => (
                        <span
                          key={key}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                            color: part.highlight
                              ? 'var(--color-highlight)'
                              : 'var(--color-text)',
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                    <div className={styles.listItemImg}>
                      <TriggerImage photo={{ ...triggerItem }} />
                    </div>
                    <FaEdit
                      className={styles.edit}
                      onClick={() => {
                        setSelectedTrigger(triggerItem)
                        setIsEditorOpen(true)
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <Portal selector="#modal">
          <Modal isOpen={isEditorOpen} setOpen={setIsEditorOpen}>
            <EditTrigger trigger={selectedTrigger} />
          </Modal>
        </Portal>
      </section>
    </Fragment>
  )
}

export default Triggers

Triggers.getInitialProps = async ({ query, store, res }) => {
  const isLoad = store.getState().trick.isLoad

  if (!isLoad) {
    const currentMap = store.getState().app.currentMap
    const [triggers, triggersErrors] = await serverHandle(res, TRIGGERS, {
      mapId: currentMap.id,
    })
    const [tricks, errorsTricks] = await serverHandle(res, TRICKS_STATS, {
      mapId: currentMap.id,
      steamId: store.getState().player.playerInfo?.steamid64,
    })
    store.dispatch(loadedTricks({ tricks, triggers }))
  }
}

Triggers.getLayout = function getLayout(page: ReactElement) {
  return <TricksPath>{page}</TricksPath>
}
