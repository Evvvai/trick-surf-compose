import React, { Fragment, useState } from 'react'

// Icons
import { BiArrowToLeft } from 'react-icons/bi'
import { BiArrowToRight } from 'react-icons/bi'

// Styles
import styles from './SuggestedTricksList.module.scss'

// Components
import SuggestedTricksListHeader from './suggested-tricks-header/SuggestedTricksListHeader.component'
import SuggestedTricksItem from './suggested-tricks-item/SuggestedTricksItem.component'

// Custom hooks
import { usePlayer } from '../../hooks/store/player/usePlayer'

// Utils
import { TrickSuggested, TrickSuggestedRates } from '@store'
import { useTrickSuggested } from 'hooks/store/trick-suggested'
import cn from 'classnames'

interface Props {
  tricks: TrickSuggested[]
  myRates: TrickSuggestedRates[]
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function SuggestedTricksList(props: Props): JSX.Element {
  const { pagination, changePagination } = useTrickSuggested()

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
      <SuggestedTricksListHeader />

      {props?.tricks?.map((trick) => {
        return (
          <SuggestedTricksItem
            key={trick.id}
            trick={trick}
            myRate={
              props.myRates.find((val) => val.trickId === trick.id) || null
            }
          />
        )
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
            [styles.paginationNone]: props.tricks?.length < pagination.limit,
          })}
        >
          <span>Next</span>
          <BiArrowToRight />
        </button>
      </div>
    </div>
  )
}
