import React, { Fragment, memo, useRef, useState } from 'react'

// Styles
import styles from './Menu.module.scss'
const {
  menu,
  profileDashboard,
  profileImage,
  profile,
  item,
  itemIcon,
  footer,
  footerIcon,
  itemHr,
} = styles

// Components
import Icon from 'components/icon/Icon.component'
import FooterWave from '../../../assets/icon/FooterWave.svg'
import ThemeSection from './theme-section/ThemeSection.component'
import { GiBowenKnot } from 'react-icons/gi'
import { CgProfile } from 'react-icons/cg'
import { AiOutlineProfile } from 'react-icons/ai'
import { FaUserFriends } from 'react-icons/fa'

// Custom hooks
import { useFriend } from 'hooks/store/friend'
import { usePlayer } from 'hooks/store/player'
import { useOutsideClick } from 'hooks/events'

// Utils
import Link from 'next/link'
import cn from 'classnames'
import { changeDecode } from 'utils/changeDecode'

interface Props {
  setOpen: any
  menuButtonRef: any
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function Menu(props: Props): JSX.Element {
  const { openFriend } = useFriend()
  const { playerInfo } = usePlayer()

  const menuRef = useRef(null)
  const handleOutsideClick = () => {
    props.setOpen(false)
  }
  const handleClickClose = () => props.setOpen(false)

  useOutsideClick([menuRef, props.menuButtonRef], handleOutsideClick)

  return (
    <div ref={menuRef} className={menu}>
      <ul>
        <li onClick={handleClickClose} className={profile}>
          <Link href={'/' + playerInfo.steamid64}>
            <a>
              <img
                className={profileDashboard}
                src={
                  playerInfo.dashboard !== null
                    ? playerInfo.dashboard
                    : process.env.DASHBOARD_NULL
                }
              />
              <div className={profileImage}>
                <img
                  src={
                    playerInfo.avatarCustom !== null
                      ? playerInfo.avatarCustom
                      : playerInfo.avatarfull
                      ? playerInfo.avatarfull
                      : process.env.AVATAR_NULL
                  }
                />
                <span>{changeDecode(playerInfo.nick)}</span>
              </div>
            </a>
          </Link>
        </li>
        <li onClick={handleClickClose} className={item}>
          <Link href={'/' + playerInfo.steamid64}>
            <a>
              <AiOutlineProfile className={itemIcon} />
              <span>Profile</span>
            </a>
          </Link>
        </li>
        <li
          onClick={(e) => {
            openFriend()
            props.setOpen(false)
          }}
          className={item}
        >
          <FaUserFriends className={itemIcon} />
          <span>Friends</span>
        </li>
        {/* <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li>
        <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li>*/}
        <hr className={itemHr} />
        {/* <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li>
        <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li> */}
        <li className={item}>
          <ThemeSection />
        </li>
      </ul>
      {/* <div className={footer}>
        <FooterWave className={footerIcon} />
      </div> */}

      <footer className={footer}>
        <FooterWave />
        {/* <Icon asset={'FooterWave'} /> */}
      </footer>
    </div>
  )
}
