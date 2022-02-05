import { Fragment, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'

// Components

// Custom hook
import { usePlayer } from '../../hooks/store/player/usePlayer'

// Utils
import { browserStorage } from 'utils/browser'
import client from 'utils/graphql'

// Styles
// import styles from '../styles/home/Home.module.scss'
// const { home, homeContent } = styles

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Auth = (props: Props) => {
  const { authPlayer } = usePlayer()

  const [isChecked, setisChecked] = useState<boolean>(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const router = useRouter()
  const token: any = router.query.token

  useEffect(() => {
    if (token) {
      authPlayer('Bearer ' + token).then((x) => {
        setIsValid(x)
        setisChecked(true)
      })
    }
  }, [token])

  // Some logic
  useEffect(() => {
    if (isChecked) {
      router.push('/')
    }
  }, [isChecked])

  return (
    <Fragment>
      <Head>
        <title>SurfGxds</title>
        <meta name="description" property="og:description" content="SurfGxds" />
        <meta name="og:title" content="SurfGxds" />
        <meta name="robots" content="INDEX,FOLLOW" />
      </Head>
      {isValid ? (
        <div>Yep!</div>
      ) : isValid === null ? (
        <div>Loading</div>
      ) : (
        <div>Nope</div>
      )}
    </Fragment>
  )
}

export default Auth

// export async function getStaticProps(context: any): Promise<GetStaticPropsResult<Props>> {

//   return {
//     props: {
//     },
//   };
// }
