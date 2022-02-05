import React, {
  createRef,
  Fragment,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'

// Styles
import styles from './Header.module.scss'
const {
  header,
  headerNav,
  headerNavFirst,
  headerNavSecond,
  signin,
  menuProfile,
  Active,
  menuProfileAvatar,
  menuProfileChevron,
  headerUl,
  headerLi,
  hrV,
  invite,
} = styles

// Icons
import { FaUserFriends } from 'react-icons/fa'
import { MdNotificationsActive } from 'react-icons/md'
import { HiMenuAlt1 } from 'react-icons/hi'
import ChevronIcon from '../../assets/icon/Chevron.svg'

// Components
import MapSelect from './map-select/MapSelect.component'
import Menu from './menu/Menu.component'
import Modal from 'components/UI/Modal/Modal.component'

// Custom hooks
import { useFriend } from 'hooks/store/friend'
import { usePlayer } from 'hooks/store/player'
import { useNotification } from 'hooks/store/notification'
import { useNetworkChange } from '../../hooks/events/useNetworkChange'
import { useApp, useMenu } from 'hooks/store/app'

// Utils
import { Portal } from 'utils/portal'
import Link from 'next/link'
import cn from 'classnames'
import { FC } from 'react'

///////////////////////////////////////////////////////////////////////////////////////////
const Header: FC = () => {
  // const { isOnline } = useNetworkChange() // For pwa
  const { isFriendOpen, openFriend, closeFriend } = useFriend()
  const { isNotificationOpen, openNotification, closeNotification } =
    useNotification()
  const { isLoggedIn, playerInfo } = usePlayer()
  const { isMenuOpen, closeMenu, openMenu } = useMenu()
  const { currentMap } = useApp()

  const [isTipMenuOpen, setIsTipMenuOpen] = useState<boolean>(false)
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)

  const menuButtonRef = createRef()

  const MenuChevron = React.forwardRef((props, ref: any) => (
    <div ref={ref} className={menuProfileChevron} onClick={handleClickTipMenu}>
      <ChevronIcon />
    </div>
  ))

  const handleClickNotification = () => {
    if (isNotificationOpen) closeNotification()
    else {
      openNotification()
      closeFriend()
    }
  }

  const handleClickFriend = () => {
    if (isFriendOpen) closeFriend()
    else {
      openFriend()
      closeNotification()
    }
  }

  const handleClickTipMenu = () => {
    setIsTipMenuOpen(!isTipMenuOpen)
    closeNotification()
    closeFriend()
  }

  const handleClickMenu = () => {
    if (isMenuOpen) closeMenu()
    else {
      openMenu()
      closeFriend()
      closeNotification()
    }
  }

  const handleClickMap = () => {
    setIsMapOpen(!isMapOpen)
    closeNotification()
    closeFriend()
  }

  return (
    <Fragment>
      <header className={header}>
        <nav className={headerNav}>
          <div className={headerNavFirst}>
            <ul className={headerUl}>
              <li onClick={handleClickMenu} className={headerLi}>
                <HiMenuAlt1 className={styles.menu} />
              </li>
              <li className={headerLi}>
                <span onClick={handleClickMap} className={styles.map}>
                  {currentMap.alternativeName}
                </span>
                <Portal selector="#modal">
                  <Modal isOpen={isMapOpen} setOpen={setIsMapOpen}>
                    <MapSelect />
                  </Modal>
                </Portal>
              </li>
            </ul>
          </div>
          <div className={headerNavSecond}>
            <ul className={headerUl}>
              {isLoggedIn ? (
                <Fragment>
                  <li className={headerLi} onClick={handleClickNotification}>
                    <MdNotificationsActive />
                    {/*
                     <div
                      className={cn(invite, {
                        [inviteActive]: lobbyInvites.length > 0,
                      })}
                    >
                      {0}
                    </div> 
                    */}
                  </li>
                  <li className={headerLi} onClick={handleClickFriend}>
                    <FaUserFriends />
                  </li>

                  <li className={headerLi}>
                    <div
                      className={cn(menuProfile, {
                        [Active]: isTipMenuOpen,
                      })}
                    >
                      <Link href={'/' + playerInfo?.steamid64}>
                        <a>
                          <img
                            className={menuProfileAvatar}
                            src={
                              playerInfo.avatarCustom !== null
                                ? playerInfo.avatarCustom
                                : playerInfo.avatarfull
                                ? playerInfo.avatarfull
                                : process.env.AVATAR_NULL
                            }
                            alt=""
                            width="32"
                            height="32"
                          />
                        </a>
                      </Link>

                      <MenuChevron ref={menuButtonRef} />

                      {isTipMenuOpen && (
                        <Menu
                          menuButtonRef={menuButtonRef}
                          setOpen={setIsTipMenuOpen}
                        />
                      )}
                    </div>
                  </li>
                </Fragment>
              ) : (
                <li className={cn(headerLi, signin)}>
                  <a href={process.env.NEXT_BACKEND_URL + '/auth/steam'}>
                    Sign In
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </Fragment>
  )
}

export default React.memo(Header)
