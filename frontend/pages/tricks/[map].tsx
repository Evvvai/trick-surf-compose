import { Fragment, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import type { ReactElement } from 'react'

// Layouts
import TricksPath from 'components/layouts/TricksPath.layout'

// Styles
import styles from '../../styles/tricks/Tricks.module.scss'

// Icons
import { GiAbstract007 } from 'react-icons/gi'
import { RiCloseFill } from 'react-icons/ri'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'

// Components
import TricksListHeader from '../../components/tricks/tricks-header/TricksListHeader.component'
import TricksList from '../../components/tricks/TricksList.component'
import MySlider from '../../components/UI/MySlider/MySlider.component'
import TricksFiltersTriggersSelector from '../../components/tricks/tricks-filters-triggers-selector/TricksFiltersTriggersSelector.component'

// Custom hook
import { useTrick } from '../../hooks/store/trick/useTrick'
import { useApp } from 'hooks/store/app'

// Utils
import { useRouter } from 'next/dist/client/router'
import { TRICKS_STATS } from 'types/graphql/quary/tricks'
import { loadedTricks } from 'stores/trick.slice'
import { serverHandle } from 'utils/graphql'
import { changedMap } from 'stores/app.slice'
import { Maps } from '@types'
import { usePlayer } from '../../hooks/store/player/usePlayer'
import MyInput from '../../components/UI/MyInput/MyInput.component'
import { Trick } from '@store'
import { TRIGGERS } from 'types/graphql/quary'
import cn from 'classnames'
import { useTrickFilters } from '../../hooks/store/trick/useTrickFilters'

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Tricks = (props: Props) => {
  const router = useRouter()

  const { currentMap } = useApp()
  const { triggers, tricks, filteredTricks, loadTricks } = useTrick()
  const { filteringTricks, filters, addTriggerToFilters } = useTrickFilters()
  const { playerInfo } = usePlayer()

  const [term, setTerm] = useState<string>('')
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
  const [isSuggestOpen, setIsSuggestOpen] = useState<boolean>(false)

  const mounted = useRef<boolean | null>(null)
  useEffect(() => {
    !mounted.current
      ? (mounted.current = true)
      : loadTricks(currentMap, playerInfo?.steamid64)

    router.push(
      {
        pathname: '/tricks/' + currentMap?.name,
      },
      undefined,
      { shallow: true }
    )
  }, [currentMap])

  return (
    <Fragment>
      <Head>
        <title>{currentMap.alternativeName + ' | Tricks'}</title>
        <meta
          name="description"
          content={`List of all available tricks for the ${currentMap.alternativeName} map`}
        />
      </Head>
      <section className={styles.tricks}>
        <div className={styles.content}>
          <div className={styles.control}>
            <MyInput
              label={'write term'}
              model={{ value: term, setValue: setTerm }}
              type={'text'}
              name={'search'}
              callback={(term: string) =>
                filteringTricks([...tricks], {
                  ...filters,
                  term,
                })
              }
              debounce={350}
              dependencies={[tricks]}
            />
            <div
              onClick={(e) => setIsFiltersOpen(!isFiltersOpen)}
              className={cn(styles.controlFilters, {
                [styles.controlFiltersActive]: isFiltersOpen,
              })}
            >
              <GiAbstract007 />
            </div>
          </div>
          {isFiltersOpen && (
            <div className={styles.filters}>
              <div className={styles.points}>
                <MySlider
                  min={Math.min(...tricks.map((x) => x.point))}
                  max={Math.max(...tricks.map((x) => x.point))}
                  currentMin={filters.pointsRange.min}
                  currentMax={filters.pointsRange.max}
                  callback={(min: number, max: number) =>
                    filteringTricks([...tricks], {
                      ...filters,
                      pointsRange: {
                        min,
                        max,
                      },
                    })
                  }
                  debounceDelay={350}
                  dependencies={[tricks]}
                />
              </div>
              <div className={styles.triggers}>
                <div className={styles.triggersList}>
                  <AiOutlineAppstoreAdd
                    onClick={() => setIsSuggestOpen(true)}
                    className={styles.triggersAdd}
                  />
                  {filters.triggers.map((trigger) => {
                    return (
                      <div
                        onClick={() => addTriggerToFilters(trigger)}
                        className={styles.triggersItem}
                        key={trigger.id}
                      >
                        <div className={styles.triggersInner}>
                          <div>{trigger.name}</div>
                          <RiCloseFill />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <TricksFiltersTriggersSelector
                isSuggestOpen={isSuggestOpen}
                setIsSuggestOpen={setIsSuggestOpen}
              />

              {/* <div>Its complete -+ | Velocity +-</div> */}
            </div>
          )}
          <TricksList tricks={filteredTricks} triggers={triggers} />
        </div>
      </section>
    </Fragment>
  )
}

export default Tricks

Tricks.getInitialProps = async ({ query, store, res }) => {
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

Tricks.getLayout = function getLayout(page: ReactElement) {
  return <TricksPath>{page}</TricksPath>
}
