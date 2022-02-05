import './ProfileOverview.module.scss'
import React, { FC, useEffect } from 'react'

// Styles
import styles from './ProfileOverview.module.scss'

// Icons
import { BsSpeedometer2 } from 'react-icons/bs'
import { AiOutlineFieldTime } from 'react-icons/ai'

// Components
import { TopTooltip } from 'utils/mui/tooltip'

// Custom Hooks

// Utils
import { parseDigit } from 'utils/regex'
import cn from 'classnames'
import { PlayerStats } from '@store'

// Interface
interface Props {
  playerStats: PlayerStats
}

// Main Component
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ProfileOverview: FC<Props> = ({ playerStats }: Props) => {
  return (
    <div className={styles.overview}>
      <div className={styles.content}>
        <div className={styles.rank}>
          <div className={styles.rankTitle}>Rank</div>
          <div className={styles.rankContent}>
            {/* {leaderboards.find((x) => x.steamid === playerStats.steamid)?.ind} */}
          </div>
        </div>
        <div className={styles.rankPlace}>
          <TopTooltip title={'Top place for unique tricks points'}>
            <div>{playerStats.ucPlace} </div>
          </TopTooltip>
          <div className={styles.rankHr}>/</div>
          <TopTooltip title={'Top place for summary all tricks points'}>
            <div>{playerStats.acPlace} </div>
          </TopTooltip>
          <div className={styles.rankHr}>/</div>
          <TopTooltip title={'Top place for unique counts tricks'}>
            <div>{playerStats.upPlace} </div>
          </TopTooltip>
          <div className={styles.rankHr}>/</div>
          <TopTooltip title={'Top place for summary all counts tricks'}>
            <div>{playerStats.apPlace} </div>
          </TopTooltip>
        </div>
      </div>
      <div className={cn(styles.sideR, styles.side, styles.sideItem)}>
        <div className={styles.sideItem}>
          <div className={styles.sideItemTitle}>Unique tricks</div>
          <div className={styles.sideItemContent}>
            {parseDigit(playerStats.uc)}
            <div
              className={cn(styles.sideItemContent, styles.sideItemContentPart)}
            >
              of {parseDigit(playerStats.tricksCounts)}
            </div>
          </div>
        </div>
        <hr className={styles.sideItemHr} />
        <div className={styles.sideItem}>
          <div className={styles.sideItemTitle}>All tricks</div>
          <div className={styles.sideItemContent}>
            {parseDigit(playerStats.ac)}
          </div>
        </div>
      </div>
      <div className={styles.percent}>
        <div className={styles.percentGlow} />
        <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="20%" x2="10%" y2="80%">
              <stop offset="10%" stopColor="#77FFF5" />
              <stop offset="90%" stopColor="#0093e9" />
            </linearGradient>
          </defs>
          <circle
            className={styles.donutHole}
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
          ></circle>
          <circle
            className={styles.donutRing}
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#d2d3d4"
            strokeWidth="5"
          ></circle>

          <circle
            style={{
              strokeDasharray: `${playerStats.completesPercent} ${
                100 - +playerStats.completesPercent
              }`,
            }}
            className={styles.donutSegment}
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="5"
            strokeDashoffset="0"
          ></circle>
          <g className={styles.chartText}>
            <text x="50%" y="50%" className={styles.chartNumber}>
              {Math.round(+playerStats.completesPercent)}
            </text>
            <text x="50%" y="50%" className={styles.chartLabel}>
              %
            </text>
          </g>
        </svg>
      </div>
      <div className={cn(styles.sideL, styles.side, styles.sideItem)}>
        <div className={styles.sideItem}>
          <div className={styles.sideItemTitle}>Unique points</div>
          <div className={styles.sideItemContent}>
            {parseDigit(playerStats.up)}
            <div
              className={cn(styles.sideItemContent, styles.sideItemContentPart)}
            >
              of {parseDigit(playerStats.tricksPoints)}
            </div>
          </div>
        </div>
        <hr className={styles.sideItemHr} />
        <div className={styles.sideItem}>
          <div className={styles.sideItemTitle}>All points</div>
          <div className={styles.sideItemContent}>
            {parseDigit(playerStats.ap)}
          </div>
        </div>
      </div>
      <div className={styles.etc}>
        <TopTooltip
          title={
            'Counts of speed records | max ' +
            parseDigit(playerStats.tricksCounts)
          }
        >
          <div className={styles.swr}>
            <span className={styles.swrText}>{playerStats.swrCounts}</span>
            <span className={styles.swrHr}></span>
            <BsSpeedometer2 className={styles.swrIcon} />
          </div>
        </TopTooltip>
        <TopTooltip
          title={
            'A value that shows how many percent of the players above you are in the tops'
          }
        >
          <div className={styles.avg}>
            <div className={styles.avgTitle}>AVG</div>
            <div className={styles.avgContent}>{playerStats.avg}</div>
          </div>
        </TopTooltip>
        {/* 
        <TopTooltip title={'Total points collected from dailies tricks'}>
          <div className={styles.daily}>
            <div className={styles.dailyTitle}>Daily</div>
            <div className={styles.dailyContent}>
            </div>
          </div>
        </TopTooltip>
       */}
        <TopTooltip
          title={
            'Counts of time records | max ' +
            parseDigit(playerStats.tricksCounts)
          }
        >
          <div className={styles.twr}>
            <AiOutlineFieldTime className={styles.twrIcon} />
            <div className={styles.twrHr} />
            <span className={styles.twrText}>{playerStats.twrCounts}</span>
          </div>
        </TopTooltip>
      </div>
    </div>
  )
}

export default ProfileOverview
