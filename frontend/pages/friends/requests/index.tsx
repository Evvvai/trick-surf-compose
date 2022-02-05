import { Fragment } from 'react'
import Head from 'next/head'

// Styles
import styles from '../../../styles/friends/requests/FriendsRequests.module.scss'

// Icons
// import {} from 'react-icons/'

// Components

// Custom hook

// Utils

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Friends = (props: Props) => {
  return (
    <Fragment>
      <Head>
        <title>SurfGxds</title>
        <meta name="description" property="og:description" content="SurfGxds" />
        <meta name="og:title" content="SurfGxds" />
        <meta name="robots" content="INDEX,FOLLOW" />
      </Head>
      <section className={styles.friends}>
        <h1 className={styles.title}> ¯\_(ツ)_/¯ </h1>
      </section>
    </Fragment>
  )
}

export default Friends

// export async function getStaticProps(context: any): Promise<GetStaticPropsResult<Props>> {

//   return {
//     props: {
//     },
//   };
// }
