import React, { useEffect, useState } from 'react'

// Icons
import { BiArrowToLeft } from 'react-icons/bi'
import { BiArrowToRight } from 'react-icons/bi'

// Styles
import styles from './LeaderboardList.module.scss'

// Components
import LeaderboardItem from './leaderboard-item/LeaderboardItem.component'
import LeaderboardListHeader from './leaderboard-heard/LeaderboardListHeader.component'

// Custom hooks
import { usePlayer } from '../../hooks/store/player/usePlayer'

// Utils
import { useRouter } from 'next/dist/client/router'
import { Trick, Leaderboard } from '@store'
import { useLeaderboard } from '../../hooks/store/leaderboard/useLeaderboard'
import cn from 'classnames'

interface Props {
  top: Leaderboard[]
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function LeaderboardList(props: Props): JSX.Element {
  const { pagination, changePagination } = useLeaderboard()

  const handleClickPagination = (type: string) => () => {
    if (type === 'back')
      changePagination({
        ...pagination,
        offset:
          pagination.offset < pagination.limit
            ? 0
            : pagination.offset - pagination.limit,
      })
    else
      changePagination({
        ...pagination,
        offset: pagination.offset + pagination.limit,
      })
  }

  return (
    <div className={styles.list}>
      <LeaderboardListHeader />

      {props.top?.map((val) => {
        return <LeaderboardItem key={val.place} stats={val} />
      })}

      <div className={styles.pagination}>
        <button
          onClick={handleClickPagination('back')}
          className={cn(styles.paginationButton, {
            [styles.paginationNone]: pagination.offset === 0,
          })}
        >
          <BiArrowToLeft />
          <span>Back</span>
        </button>
        <button
          onClick={handleClickPagination('next')}
          className={cn(styles.paginationButton, {
            [styles.paginationNone]: props.top?.length < pagination.limit,
          })}
        >
          <span>Next</span>
          <BiArrowToRight />
        </button>
      </div>
    </div>
  )
}
