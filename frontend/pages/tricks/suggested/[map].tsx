import { Fragment, useEffect, useRef } from 'react'
import Head from 'next/head'

// Styles
import styles from '../../../styles/tricks/SuggestedTricks.module.scss'

// Icons
// import { GiAbstract007 } from 'react-icons/gi'

// Components
// import MyInput from '../../../components/UI/MyInput/MyInput.component'
import SuggestedTricksList from '../../../components/suggested-tricks/SuggestedTricksList.component'

// Custom hook
import { useApp } from 'hooks/store/app'

// Utils
import { useRouter } from 'next/dist/client/router'
import { serverHandle } from 'utils/graphql'
import { loadedTrickSuggested } from 'stores/trick-suggested.slice'
import { PLAYER_RATE, SUGGESTED_TRICK } from 'types/graphql/quary'
import { useTrickSuggested } from '../../../hooks/store/trick-suggested/useTrickSuggested'
import { TrickSuggested } from '@store'

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const SuggestedTricks = (props: Props) => {
  const router = useRouter()
  const { currentMap } = useApp()
  const { pagination, tricksSuggested, myRates, changePagination } =
    useTrickSuggested()

  const mounted = useRef<boolean | null>(null)
  useEffect(() => {
    !mounted.current ? (mounted.current = true) : changePagination(pagination)

    router.push(
      {
        pathname: '/tricks/suggested/' + currentMap.name,
        query: {
          limit: pagination.limit?.toString() || 100,
          offset: pagination.offset?.toString() || 0,
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
        <title>{currentMap.alternativeName + ' | Suggested tricks'}</title>
        <meta
          name="description"
          content={`Suggested tricks for the ${currentMap.alternativeName} map`}
        />
      </Head>
      <section className={styles.tricks}>
        <div className={styles.tricksContent}>
          <SuggestedTricksList tricks={tricksSuggested} myRates={myRates} />
        </div>
      </section>
    </Fragment>
  )
}

export default SuggestedTricks

SuggestedTricks.getInitialProps = async ({ query, store, res }) => {
  const currentMap = store.getState().app.currentMap

  try {
    // const isLoad = store.getState().trickSuggested.isLoad
    // if (!isLoad) {
    const isLoggedIn = store.getState().player.isLoggedIn
    const limit = Math.abs(+query?.limit || 100)
    const offset = Math.abs(+query?.offset || 0)

    const [tricksSuggested, tricksSuggestedErrors] = await serverHandle(
      res,
      SUGGESTED_TRICK,
      {
        mapId: currentMap.id,
        limit: limit,
        offset: offset,
      }
    )

    const [myRates, myRatesErrors] = isLoggedIn
      ? await serverHandle(res, PLAYER_RATE, {
          ids: tricksSuggested?.map((val: TrickSuggested) => val.id),
        })
      : [[], []]

    if (tricksSuggested) {
      store.dispatch(
        loadedTrickSuggested({
          tricksSuggested,
          myRates,
          pagination: {
            limit,
            offset,
          },
        })
      )
    }
  } catch (e) {
    res.writeHead(201, { Location: '/tricks/suggested/' + currentMap.name })
    res.end()
  }
}
