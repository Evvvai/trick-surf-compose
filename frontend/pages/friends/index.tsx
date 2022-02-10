import { Fragment, useEffect, useState } from 'react'
import Head from 'next/head'

import type { ReactElement } from 'react'

// Layouts
import FriendsPath from 'components/layouts/FriendsPath.layout'

// Styles
import styles from '../../styles/friends/Friends.module.scss'
const {
  cFriends,
  cFriendsContent,
  title,
  item,
  list,
  itemFriend,
  avatar,
  info,
  infoName,
  infoOnline,
  options,
  search,
} = styles

// Icons
import { RiDeleteBin5Fill } from 'react-icons/ri'

// Components
import MyInput from '../../components/UI/MyInput/MyInput.component'

// Custom hook
import { useFriend } from '../../hooks/store/friend'
import { useFriendFiltered } from '../../hooks/store/friend'

// Utils
import { useRouter } from 'next/dist/client/router'
import dayjs from 'dayjs'

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Friends = (props: Props) => {
  const { termFriend, filteredFriendsIds, filteringFriends } =
    useFriendFiltered()
  const { friendsList } = useFriend()
  const router = useRouter()

  const [term, setTerm] = useState<string>(termFriend)

  // Sync term
  useEffect(() => {
    setTerm(termFriend)
  }, [termFriend])

  return (
    <Fragment>
      <Head>
        <title>SurfGxds friends</title>
        <meta name="description" property="og:description" content="SurfGxds" />
        <meta name="og:title" content="SurfGxds" />
        <meta name="robots" content="INDEX,FOLLOW" />
      </Head>
      <section className={cFriends}>
        <div className={cFriendsContent}>
          <div className={search}>
            <MyInput
              label={'write term'}
              model={{ value: term, setValue: setTerm }}
              type={'text'}
              name={'search'}
              callback={filteringFriends}
              debounce={350}
            />
          </div>
          <div className={list}>
            {[
              ...friendsList.filter((x) =>
                filteredFriendsIds.find((y) => y === x.id)
              ),
            ]
              .sort((x, y) => Number(y.online) - Number(x.online))
              .map((friend, key) => {
                return (
                  <div
                    key={friend.id.toString() + key}
                    onClick={(e) => router.push('/' + friend.steamid64)}
                    className={item}
                  >
                    <div className={itemFriend}>
                      <img
                        className={avatar}
                        src={
                          friend.avatarCustom !== null
                            ? friend.avatarCustom
                            : friend.avatarfull
                            ? friend.avatarfull
                            : process.env.AVATAR_NULL
                        }
                      />
                      <div className={info}>
                        <div className={infoName}>{friend.nick}</div>
                        <div className={infoOnline}>
                          {/* {friend.online ? (
                            <span>. . .</span>
                          ) : (
                            <span>{dayjs(friend.lastLogin).fromNow()}</span>
                          )} */}
                        </div>
                      </div>
                      <div className={options}>
                        <RiDeleteBin5Fill />
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default Friends

Friends.getLayout = function getLayout(page: ReactElement) {
  return <FriendsPath>{page}</FriendsPath>
}
