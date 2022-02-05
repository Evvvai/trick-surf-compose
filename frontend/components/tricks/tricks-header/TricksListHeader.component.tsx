import React from 'react'

// Styles
import styles from './TricksListHeader.module.scss'

// Components
import { FaSortDown, FaSortUp } from 'react-icons/fa'

// Custom hooks
import { usePlayer } from '../../../hooks/store/player/usePlayer'

// Utils
import { useRouter } from 'next/dist/client/router'
import cn from 'classnames'
import { useTrick } from 'hooks/store/trick'
import { SortingTricksOptions } from '@store'

///////////////////////////////////////////////////////////////////////////////////////////
export default function TricksListHeader(): JSX.Element {
  const router = useRouter()

  const { isLoggedIn } = usePlayer()
  const { sortingTricks, sortSettings, tricks } = useTrick()

  const onClickSort = (sortingTricksOption: SortingTricksOptions) => (e) =>
    sortingTricks([...tricks], sortingTricksOption)

  return (
    <div className={styles.content}>
      <div className={cn(styles.item, styles.itemInd)}>
        {/* <div
          className={cn(styles.sort, {
            [styles.sortUp]: sortSettings.dir === 'asc',
            [styles.sortDown]: sortSettings.dir === 'desc',
            [styles.sortActive]: sortSettings.sort === 'index',
          })}
        >
          <FaSortUp />
          <FaSortDown />
        </div> */}
        <div onClick={onClickSort('index')}>
          <div>#</div>
        </div>
      </div>

      <div className={cn(styles.item, styles.itemTn)}>
        <div onClick={onClickSort('name')}>
          <div>trick</div>
          <div>Name</div>
        </div>
        <div
          className={cn(styles.sort, {
            [styles.sortUp]: sortSettings.dir === 'asc',
            [styles.sortDown]: sortSettings.dir === 'desc',
            [styles.sortActive]: sortSettings.sort === 'name',
          })}
        >
          <FaSortUp />
          <FaSortDown />
        </div>
      </div>

      <div className={cn(styles.item, styles.itemTp)}>
        <div
          className={cn(styles.sort, {
            [styles.sortUp]: sortSettings.dir === 'asc',
            [styles.sortDown]: sortSettings.dir === 'desc',
            [styles.sortActive]: sortSettings.sort === 'point',
          })}
        >
          <FaSortUp />
          <FaSortDown />
        </div>
        <div onClick={onClickSort('point')}>
          <div>trick</div>
          <div>points</div>
        </div>
      </div>

      <div className={cn(styles.item, styles.itemTc)}>
        <div
          className={cn(styles.sort, {
            [styles.sortUp]: sortSettings.dir === 'asc',
            [styles.sortDown]: sortSettings.dir === 'desc',
            [styles.sortActive]: sortSettings.sort === 'completes',
          })}
        >
          <FaSortUp />
          <FaSortDown />
        </div>
        <div onClick={onClickSort('completes')}>
          <div>total</div>
          <div>completes</div>
        </div>
      </div>

      {isLoggedIn && (
        <div className={cn(styles.item, styles.itemMc)}>
          <div
            className={cn(styles.sort, {
              [styles.sortUp]: sortSettings.dir === 'asc',
              [styles.sortDown]: sortSettings.dir === 'desc',
              [styles.sortActive]: sortSettings.sort === 'myCompletes',
            })}
          >
            <FaSortUp />
            <FaSortDown />
          </div>
          <div onClick={onClickSort('myCompletes')}>
            <div>my</div>
            <div>completes</div>
          </div>
        </div>
      )}

      <div className={cn(styles.item, styles.itemTl)}>
        <div
          className={cn(styles.sort, {
            [styles.sortUp]: sortSettings.dir === 'asc',
            [styles.sortDown]: sortSettings.dir === 'desc',
            [styles.sortActive]: sortSettings.sort === 'len',
          })}
        >
          <FaSortUp />
          <FaSortDown />
        </div>
        <div onClick={onClickSort('len')}>
          <div>trick</div>
          <div>length</div>
        </div>
      </div>
    </div>
  )
}
