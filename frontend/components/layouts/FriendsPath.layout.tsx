import { FC, Fragment, useEffect, useState } from 'react'

// Styles
import styles from '../../styles/layouts/Layouts.module.scss'

// Component

// Custom hooks
import { useRouter } from 'next/dist/client/router'

// Utils

//////////////////////////////////////////////////////////////////////////////////////
const FriendsPath: FC = ({ children }) => {
  const router = useRouter()

  const [section, setSection] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (router.pathname.includes('friends'))
      setSection(
        router.pathname.split('/')[2]
          ? FriendSection[router.pathname.split('/')[2]]
          : FriendSection[router.pathname.split('/')[1]]
      )
    else {
      if (section !== undefined) setSection(undefined)
    }
  }, [router.pathname])

  if (section !== undefined)
    return (
      <div className={styles.layoutsFriends}>
        <div className={styles.layoutsFriendsTitle}>
          <h1>Friends</h1>
        </div>
        <div className={styles.layoutsFriendsVarious}>
          <span style={{ transform: 'translateX(' + 100 * section + 'px)' }} />
          <button
            className={styles.layoutsFriendsVariousItem}
            onClick={(e) => router.push('/friends/')}
          >
            My friends
          </button>
          <button
            className={styles.layoutsFriendsVariousItem}
            onClick={(e) => router.push('/friends/requests')}
          >
            Requests
          </button>
        </div>
        {children}
      </div>
    )

  return <Fragment>{children}</Fragment>
}
export default FriendsPath

const FriendSection: Record<string, number> = {
  friends: 0,
  requests: 1,
  none: 2,
}
