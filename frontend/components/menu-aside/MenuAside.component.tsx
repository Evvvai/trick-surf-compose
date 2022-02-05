import React, { FC, useEffect, useRef, useState } from 'react'

// Styles
import styles from './MenuAside.module.scss'
const { content, contentInner, Open, list, item } = styles

// Icons
import { FaRoute } from 'react-icons/fa'
import { MdOutlineLeaderboard } from 'react-icons/md'
import { IoIosConstruct } from 'react-icons/io'
import { FaQuora } from 'react-icons/fa'

// Components
import ToolTip from '../UI/Tooltip/Tooltip.component'

// Custom hooks
import { useApp, useMenu } from 'hooks/store/app'
import { useOutsideClick } from 'hooks/events'

// Utils
import cn from 'classnames'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

///////////////////////////////////////////////////////////////////////////////////////////
const SectionMenuAside: FC = () => {
  const router = useRouter()
  const { currentMap } = useApp()
  const { isMenuOpen, closeMenu } = useMenu()

  const menuRef = useRef(null)
  const handleOutsideClick = () => isMenuOpen && closeMenu()
  useOutsideClick([menuRef], handleOutsideClick)

  return (
    <div ref={menuRef} className={content}>
      <div className={cn(contentInner, { [Open]: isMenuOpen })}>
        <header className={styles.title}>
          <h1>SurfGxds</h1>
          {/* <hr className={hrH} /> */}
        </header>
        <ul onClick={(e) => closeMenu()} className={list}>
          <li>
            <Link href={'/tricks/' + currentMap?.name}>
              <a className={item}>
                <FaRoute className={styles.sectionIcon} />
                <div className={styles.sectionName}>Tricks</div>
              </a>
            </Link>
          </li>
          <li>
            <Link href={'/leaderboard/' + currentMap?.name}>
              <a className={item}>
                <MdOutlineLeaderboard className={styles.sectionIcon} />
                <div className={styles.sectionName}>Leaderboard</div>
              </a>
            </Link>
          </li>
          <li>
            <Link href={'/trick-editor/' + currentMap?.name}>
              <a className={item}>
                <IoIosConstruct className={styles.sectionIcon} />
                <div className={styles.sectionName}>Trick creator</div>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/faq">
              <a className={item}>
                <FaQuora className={styles.sectionIcon} />
                <div className={styles.sectionName}>About server</div>
              </a>
            </Link>
          </li>
        </ul>

        <button className={styles.connect}>
          <a href="steam://connect/62.122.215.124:27015">Join Server</a>
        </button>
      </div>
    </div>
  )
}

export default React.memo(SectionMenuAside)
