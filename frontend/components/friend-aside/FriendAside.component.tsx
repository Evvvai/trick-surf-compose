import React, { FC, useEffect, useState } from 'react'

// Styles
import styles from './FriendAside.module.scss'
const {
  friend,
  Open,
  content,
  title,
  hrH,
  search,
  searchInput,
  searchItem,
  searchIcon,
  list,
  item,
  itemImg,
  itemInfo,
  itemOnline,
  itemInvite,
  exit,
  Online,
  tip,
} = styles

// Icons
import { MdPersonAdd } from 'react-icons/md'
import { AiOutlineCloudSync } from 'react-icons/ai'
import { MdOutlineManageSearch } from 'react-icons/md'
import { IoIosClose } from 'react-icons/io'
import { MdLibraryAdd } from 'react-icons/md'
import { RiMailCloseFill } from 'react-icons/ri'

// Components
import ToolTip from '../UI/Tooltip/Tooltip.component'
import FriendSync from './friend-sync/FriendSync.component'

// Custom hooks
import { useFriend } from 'hooks/store/friend'
import { useFriendFiltered } from 'hooks/store/friend'

// Utils
import cn from 'classnames'
import { useRouter } from 'next/dist/client/router'
import Modal from 'components/UI/Modal/Modal.component'
import { Portal } from 'utils/portal'
import dayjs from 'dayjs'

///////////////////////////////////////////////////////////////////////////////////////////
const FriendAside: FC = () => {
  const { isFriendOpen, openFriend, closeFriend, friendsList, isFriendLoad } =
    useFriend()
  const { termFriend, filteredFriendsIds } = useFriendFiltered()

  const [isFriendSync, setIsFriendSync] = useState<boolean>(false)
  const [term, setTerm] = useState<string>(termFriend)

  // Sync
  useEffect(() => {
    setTerm(termFriend)
  }, [termFriend])

  const router = useRouter()
  const handleClickClose = () => closeFriend()
  const handleClickNewFriend = () => {
    setIsFriendSync(true)
    handleClickClose()
  }
  const handleClickOpenProfile = (steamid64: string) => () => {
    router.push('/' + steamid64)
    handleClickClose()
  }

  return (
    <div className={cn(friend, { [Open]: isFriendOpen })}>
      <div className={content}>
        <header className={title}>
          <h1>Friends</h1>
        </header>
        <hr className={hrH} />
        <div className={search}>
          <MdOutlineManageSearch className={cn(searchIcon)} />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className={searchInput}
          />
          <div
            className={searchIcon}
            onClick={(e) => {
              router.push('/friends')
              handleClickClose()
            }}
          >
            <MdPersonAdd />
          </div>

          <ToolTip
            content={
              <div className={tip}>
                <span>Synchronizing friends with steam</span>
                <span>
                  If a player is registered on the site and he is also in your
                  list of friends steem, he will be added to the friends
                </span>
              </div>
            }
            reset={50}
            delay={350}
            placement={'top'}
          >
            <div className={searchIcon} onClick={handleClickNewFriend}>
              <AiOutlineCloudSync />
              <Portal selector="#modal">
                <Modal isOpen={isFriendSync} setOpen={setIsFriendSync}>
                  <FriendSync />
                </Modal>
              </Portal>
            </div>
          </ToolTip>
        </div>
        <ul className={list}>
          {!isFriendLoad ? (
            <div></div>
          ) : filteredFriendsIds.length === 0 ? (
            <div>{/* <img src={NOT_FOUND} /> */}</div>
          ) : (
            [
              ...friendsList.filter((x) =>
                filteredFriendsIds.find((y) => y === x.id)
              ),
            ]
              .sort((x, y) => Number(y.online) - Number(x.online))
              .map((val) => {
                return (
                  <li key={val.id} className={item}>
                    <div
                      onClick={handleClickOpenProfile(val.steamid64)}
                      className={itemImg}
                    >
                      <img
                        src={
                          val.avatarCustom !== null
                            ? val.avatarCustom
                            : val.avatarfull
                            ? val.avatarfull
                            : process.env.AVATAR_NULL
                        }
                      />
                      <div
                        className={cn(itemOnline, {
                          [Online]: val.online,
                        })}
                      />
                    </div>
                    <div className={itemInfo}>
                      <div>{val.nick}</div>
                      {val.online ? (
                        <span>{val.status.action}</span>
                      ) : (
                        <span>{dayjs(val.lastLoginSite).fromNow()}</span>
                      )}
                    </div>
                  </li>
                )
              })
          )}
        </ul>
        <IoIosClose onClick={handleClickClose} className={exit} />
      </div>
    </div>
  )
}

export default React.memo(FriendAside)
