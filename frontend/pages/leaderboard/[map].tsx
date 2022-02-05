import { Fragment, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { serverHandle } from 'utils/graphql'
import { LEADERBOARD_CACHED } from 'types/graphql/quary'
import { loadedLeaderboard } from 'stores/leaderboard.slice'

// Styles
import styles from '../../styles/leaderboard/Leaderboard.module.scss'

// Components
import LeaderboardList from '../../components/leaderboard/LeaderboardList.component'

// Custom hook
import { useLeaderboard } from 'hooks/store/leaderboard'
import { useApp } from 'hooks/store/app'

// Utils
import { useRouter } from 'next/router'

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Leaderboard = (props: Props) => {
  const router = useRouter()
  const { currentMap } = useApp()
  const { loadLeaderboard, pagination, top } = useLeaderboard()

  const mounted = useRef<boolean | null>(null)
  useEffect(() => {
    !mounted.current
      ? (mounted.current = true)
      : loadLeaderboard(currentMap, pagination)

    router.push(
      {
        pathname: '/leaderboard/' + currentMap.name,
        query: {
          limit: pagination.limit.toString(),
          offset: pagination.offset.toString(),
        },
      },
      undefined,
      { shallow: true }
    )
    window.scrollTo(0, 0)
  }, [pagination, currentMap])

  return (
    <Fragment>
      <Head>
        <title>{currentMap.alternativeName + ' | Leaderboard'}</title>
        <meta
          name="description"
          content={`Leaderboard table for the ${currentMap.alternativeName} map , by percentage of completion, and avg place by 4 tops (unique points, all points, all tricks, unique tricks)`}
        />
      </Head>
      <section className={styles.leaderboard}>
        <div className={styles.title}>
          <h1>Leaderboard</h1>
          {/* <hr /> */}
        </div>
        <div className={styles.leaderboardContent}>
          {/* <div className={search}>
            <MyInput
              label={'write term'}
              model={{ value: term, setValue: setTerm }}
              type={'text'}
          variables    name={'search'}
              callback={filteringFriends}
              debounce={350}
            />
          </div> */}
          <LeaderboardList top={top} />
        </div>
      </section>
    </Fragment>
  )
}

export default Leaderboard

Leaderboard.getInitialProps = async ({ query, res, store }) => {
  const isLoad = store.getState().leaderboard.isLoad

  if (!isLoad) {
    const limit = Math.abs(+query.limit) || 100
    const offset = Math.abs(+query.offset) || 0
    const currentMap = store.getState().app.currentMap

    const [top, topErrors] = await serverHandle(res, LEADERBOARD_CACHED, {
      mapId: currentMap.id,
      limit: limit,
      offset: offset,
    })

    if (top) {
      store.dispatch(
        loadedLeaderboard({
          top,
          pagination: {
            limit,
            offset,
          },
        })
      )
    }
  }
}
