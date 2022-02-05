import React, { Fragment, useState } from 'react'

// Styles
import styles from './SuggestedTricksItem.module.scss'

// Icons
import { MdOutlineThumbsUpDown } from 'react-icons/md'
import { MdOutlineThumbUp } from 'react-icons/md'
import { MdOutlineThumbDown } from 'react-icons/md'
import { FiX } from 'react-icons/fi'
import { FiCheck } from 'react-icons/fi'
import { FiEdit } from 'react-icons/fi'

// Components
import MyImage from '../../UI/MyImage/MyImage.component'
import PlayerEmbend from '../../UI/PlayerEmbend/PlayerEmbend.component'

// Custom hooks
import { usePlayer } from '../../../hooks/store/player/usePlayer'
import { useTrickSuggested } from 'hooks/store/trick-suggested'

// Utils
import { useRouter } from 'next/dist/client/router'
import cn from 'classnames'
import dayjs from 'dayjs'
import { Role, TrickSuggested, TrickSuggestedStatus } from '@store'
import { TrickSuggestedRates } from '../../../types/store/trick-suggested'
import TriggerImage from '../../UI/MyImage/TriggerImage/TriggerImage.component'

export type RateType = 'up' | 'down'

interface Props {
  trick: TrickSuggested
  myRate: TrickSuggestedRates | null
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function SuggestedTricksItem(props: Props): JSX.Element {
  const { changeMyRate, acceptTrick, declineTrick } = useTrickSuggested()
  const { isLoggedIn, playerInfo } = usePlayer()
  const router = useRouter()

  const [isActive, setIsActive] = useState<boolean>(false)

  const handleClick = (trick: TrickSuggested) => (e: any) => {
    setIsActive(!isActive)
  }

  const handleClickRate = (rate: RateType) => (e: any) => {
    if (isLoggedIn) {
      if (props.myRate?.rate !== rate) changeMyRate(props.trick, rate)
    } else {
      // Show error
      // changeMyRate(props.trick, rate)
    }
  }

  const getStyleForStatus = (status: string): any => {
    switch (status) {
      case TrickSuggestedStatus.ACCEPTED:
        return styles.itemStatusAccepted
      case TrickSuggestedStatus.DECLINED:
        return styles.itemStatusDeclined
      case TrickSuggestedStatus.PENDING:
        return styles.itemStatusPending
    }
  }

  return (
    <div
      onClick={handleClick(props.trick)}
      key={props.trick.id}
      className={cn([styles.content], {
        [styles.contentActive]: isActive,
      })}
    >
      <div className={styles.contentInner}>
        <div
          className={cn(
            styles.item,
            styles.itemStatus,
            getStyleForStatus(props.trick.status)
          )}
        >
          <div className={styles.itemStatusText}>{props.trick.status}</div>
          <div className={styles.itemStatusIcon} />
        </div>

        <div className={cn(styles.item, styles.itemTn)}>
          <div>{props.trick.name}</div>
        </div>

        <div className={cn(styles.item, styles.itemTp)}>
          <div>{props.trick.point}</div>
        </div>

        <div className={cn(styles.item, styles.itemAuthor)}>
          <PlayerEmbend player={props.trick.author} />
        </div>

        <div className={cn(styles.item, styles.itemRate)}>
          <div>{props.trick.rates.up}</div>
          <MdOutlineThumbsUpDown />
          <div>{props.trick.rates.down}</div>
        </div>

        <div className={cn(styles.item, styles.itemDateAdded)}>
          <div>{dayjs(props.trick.dateAdd)?.fromNow()}</div>
        </div>
      </div>
      {isActive && (
        <div onClick={(e) => e.stopPropagation()} className={styles.info}>
          <div className={styles.route}>
            {props.trick.route.map((trigger, key) => {
              return (
                <div
                  key={props.trick.id + '|' + trigger.id + '|' + key}
                  className={styles.routeItem}
                >
                  <div className={styles.routeContent}>
                    <div className={styles.routeTitle}>{trigger.name}</div>
                    <div className={styles.routeImg}>
                      <TriggerImage photo={{ ...trigger }} />
                    </div>
                    <div className={styles.routeCount}>{key + 1}</div>
                  </div>
                </div>
              )
            })}

            {props.trick.status === TrickSuggestedStatus.PENDING && (
              <Fragment>
                <hr className={styles.hrH} />

                <div className={styles.description}>
                  <div
                    className={cn(styles.rate, {
                      [styles.rateUp]: props.myRate?.rate === 'up',
                      [styles.rateDown]: props.myRate?.rate === 'down',
                    })}
                  >
                    <MdOutlineThumbUp onClick={handleClickRate('up')} />
                    <MdOutlineThumbDown onClick={handleClickRate('down')} />
                  </div>
                  {isLoggedIn && playerInfo.role === Role.ADMIN && (
                    <div className={styles.control}>
                      <FiX onClick={(e) => declineTrick(props.trick)} />
                      <FiCheck onClick={(e) => acceptTrick(props.trick)} />
                      {/* <FiEdit /> */}
                    </div>
                  )}
                </div>
              </Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
