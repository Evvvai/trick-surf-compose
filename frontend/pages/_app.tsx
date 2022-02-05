import '../styles/index.scss' // Styles
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '../contexts/theme' // Theme Use Context
import { wrapper } from 'stores'
import { useEffect } from 'react'

// Layouts
import MainLayout from 'components/layouts/Main.layout'

/* May be reworekd... */
import FriendsPath from 'components/layouts/FriendsPath.layout'
import TricksPath from 'components/layouts/TricksPath.layout'

// Components
import Header from '../components/header/Header.component'
import Footer from 'components/footer/Footer.component'
import MenuAside from 'components/menu-aside/MenuAside.component'

// Utils
import { AUTH } from 'types/graphql/mutation'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { setPlayerSetting } from 'stores/player.slice'
import { serverHandle } from 'utils/graphql'
import { appLoaded } from 'stores/app.slice'
import { MAPS } from 'types/graphql/quary'
import Cookies, { parseCookies } from 'nookies'
import { useDispatch } from 'react-redux'
import { usePlayer } from '../hooks/store/player/usePlayer'
import { Maps } from '@types'

/////////////////////////////////////////////////////////////////////////////////////
function MyApp({ Component, pageProps }: AppProps) {
  const { isLoggedIn } = usePlayer()
  const dispatch = useDispatch()

  dayjs.extend(relativeTime)
  dayjs.extend(duration)
  dayjs.locale('ru')
  dayjs.locale('en')

  useEffect(() => {
    if (isLoggedIn) dispatch({ type: 'socket/connect' })
  }, [])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=0, viewport-fit=cover"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content={'black-translucent'}
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ThemeProvider>
        {/* <NotificationList /> */}
        {/* <MenuAside /> */}
        <Header />
        <MainLayout>
          <FriendsPath>
            <TricksPath>
              <Component {...pageProps} />
            </TricksPath>
          </FriendsPath>
        </MainLayout>
        <Footer />
      </ThemeProvider>
    </>
  )
}

MyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ ctx, Component }) => {
      if (!store.getState().app.isLoad) {
        const [player, playerErrors] = await serverHandle(ctx, AUTH, {})

        const [maps, mapsErrors] = await serverHandle(ctx, MAPS, {})

        const cookies = ctx ? Cookies.get(ctx) : parseCookies()
        const map =
          maps.find((x: Maps) => x.name === ctx.query?.map)?.id || cookies.map

        if (player && !playerErrors) {
          store.dispatch(setPlayerSetting(player))
        }

        store.dispatch(
          appLoaded({
            availableMaps: maps,
            currentMap: maps.find((val) => val.id === +map) || maps[0],
          })
        )
      }

      return {
        pageProps: {
          ...(Component.getInitialProps
            ? await Component.getInitialProps({ ...ctx, store })
            : {}),
        },
      }
    }
)

export default wrapper.withRedux(MyApp)
