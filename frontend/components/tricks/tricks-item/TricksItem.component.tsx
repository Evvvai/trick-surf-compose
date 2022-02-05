import React, { Fragment, useState } from 'react'

// Styles
import styles from './TricksItem.module.scss'

// Components
import TriggerImage from '../../UI/MyImage/TriggerImage/TriggerImage.component'
import PlayerEmbend from '../../UI/PlayerEmbend/PlayerEmbend.component'

// Custom hooks
import { usePlayer } from '../../../hooks/store/player/usePlayer'
import { useTrickFilters } from 'hooks/store/trick/useTrickFilters'

// Utils
import cn from 'classnames'
import { Trick, TrickWR, Trigger } from '@store'
import { SWR, TWR } from 'types/graphql/quary'
import { clientHandle } from 'utils/graphql'
import dayjs from 'dayjs'
import TricksRelated from '../tricks-related/TricksRelated.component'

interface Props {
  trick: Trick
  triggers: Trigger[]
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function TricksItem({ trick, triggers }: Props): JSX.Element {
  const { isLoggedIn } = usePlayer()
  const { addTriggerToFilters, filters } = useTrickFilters()

  const [isActive, setIsActive] = useState<boolean>(false)
  const [isRelatedActive, setIsRelatedActive] = useState<boolean>(false)
  const [route, setRoute] = useState<Trigger[] | null>(null)
  const [wr, setWr] = useState<{
    swr: TrickWR
    twr: TrickWR
    isLoading: boolean
  }>({
    swr: {} as TrickWR,
    twr: {} as TrickWR,
    isLoading: true,
  })

  const handleClick = (trick: Trick) => (e: any) => {
    if (!route) {
      setRoute(
        trick.routeIds
          .split(',')
          .map(
            (id) => triggers.find((val) => val.id === +id) as Trigger
          ) as Trigger[]
      )
      loadWR(trick)
    }
    setIsActive(!isActive)
    setIsRelatedActive(false)
  }

  const loadWR = async (trick: Trick) => {
    const [swr, swrErrors] = await clientHandle(SWR, {
      trickId: trick.id,
    })

    const [twr, twrErrors] = await clientHandle(TWR, {
      trickId: trick.id,
    })

    setWr({
      swr: { ...swr, isErrors: swr === null },
      twr: { ...twr, isErrors: twr === null },
      isLoading: false,
    })
  }

  return (
    <Fragment>
      <div
        onClick={handleClick(trick)}
        key={trick.id}
        className={cn([styles.content], {
          [styles.contentActive]: isActive,
        })}
      >
        <div className={styles.contentInner}>
          <div className={cn(styles.item, styles.itemInd)}>
            <div>{trick.index}</div>
          </div>

          <div
            className={cn(styles.item, styles.itemTn, {
              [styles.itemTnNone]: isLoggedIn
                ? trick.myCompletes === 0
                : trick.completes === 0,
            })}
          >
            <div>{trick.name}</div>
          </div>

          <div className={cn(styles.item, styles.itemTp)}>
            <div>{trick.point}</div>
          </div>

          <div className={cn(styles.item, styles.itemTc)}>
            <div>{trick.completes}</div>
          </div>

          {isLoggedIn && (
            <div className={cn(styles.item, styles.itemMc)}>
              <div>{trick.myCompletes}</div>
            </div>
          )}

          <div className={cn(styles.item, styles.itemTl)}>
            <div>{trick.len}</div>
          </div>
        </div>
        {isActive && route && (
          <div onClick={(e) => e.stopPropagation()} className={styles.info}>
            <div className={styles.route}>
              {route.map((trigger, key) => {
                return (
                  <div
                    key={trick.id + '|' + trigger.id + '|' + key}
                    className={styles.routeItem}
                  >
                    <div
                      className={cn(styles.routeContent, {
                        [styles.routeContentActive]: filters.triggers.find(
                          (x) => x.id === trigger.id
                        ),
                      })}
                    >
                      <div className={styles.routeTitle}>{trigger.name}</div>
                      <div
                        onClick={() => addTriggerToFilters(trigger)}
                        className={styles.routeImg}
                      >
                        <TriggerImage photo={{ ...trigger }} />
                      </div>
                      <div className={styles.routeCount}>{key + 1}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles.additional}>
              <div className={styles.record}>
                <div className={styles.recordItem}>
                  {!wr.isLoading ? (
                    wr.swr.isErrors ? (
                      <Fragment>
                        <div className={styles.recordTitle}>Speed</div>
                        <div className={styles.recordNone}>none</div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div className={styles.recordTitle}>Speed</div>
                        <PlayerEmbend player={wr.swr.player} />
                        <div className={styles.recordRes}>{wr.swr.speed}</div>
                      </Fragment>
                    )
                  ) : (
                    <Fragment>
                      <div className={styles.recordTitle}>Speed</div>
                      <div className={styles.recordLoad}>
                        data records Loading...
                      </div>
                    </Fragment>
                  )}
                </div>
                <div className={styles.recordItem}>
                  {!wr.isLoading ? (
                    wr.twr.isErrors ? (
                      <Fragment>
                        <div className={styles.recordTitle}>Time</div>
                        <div className={styles.recordNone}>none</div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div className={styles.recordTitle}>Time</div>
                        <PlayerEmbend player={wr.twr.player} />
                        <div className={styles.recordRes}>{wr.twr.time}</div>
                      </Fragment>
                    )
                  ) : (
                    <Fragment>
                      <div className={styles.recordTitle}>Time</div>
                      <div className={styles.recordLoad}>
                        data records Loading...
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
              <div className={styles.author}>
                <div className={styles.authorTitle}>Created by</div>
                {trick?.author ? (
                  <PlayerEmbend reverse={true} player={trick.author} />
                ) : (
                  <div>unknow</div>
                )}
                <div className={styles.authorDateAdd}>
                  {dayjs(trick.dateAdd)?.fromNow()}
                </div>
              </div>
              <div className={styles.related}>
                <span
                  onClick={() => setIsRelatedActive(!isRelatedActive)}
                  className={styles.relatedTitle}
                >
                  {isRelatedActive ? 'unsow' : 'show'} related tricks
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {isRelatedActive && (
        <TricksRelated baseTrick={trick} triggers={triggers} />
      )}
    </Fragment>
  )
}
