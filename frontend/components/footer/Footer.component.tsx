import React, { Fragment, memo } from 'react'

// Styles
import styles from './Footer.module.scss'
const { footer, footerContent, footerItem } = styles

// Components
import FooterWaveIcon from '../../assets/icon/FooterWave.svg'

// Utils

///////////////////////////////////////////////////////////////////////////////////////////
export default function Footer(): JSX.Element {
  return (
    <footer className={footer}>
      {/* <Icon asset={'FooterWave'} /> */}
      <FooterWaveIcon />
      <div className={footerContent}>
        <a href="https://discord.gg/nybZnuAsze" className={footerItem}>
          Discord
        </a>
        <span>|</span>
        <a href="https://vk.com/surfgxds" className={footerItem}>
          Vk
        </a>
        <span>|</span>
        <a href="https://github.com/Evvvai" className={footerItem}>
          GitHub
        </a>
        <span>|</span>
        <a href="steam://connect/62.122.215.124:27015" className={footerItem}>
          Server
        </a>
        <span>|</span>
        <a
          href="https://www.youtube.com/channel/UCu-39MYQr8I7smURAUeYchw"
          className={footerItem}
        >
          YouTube
        </a>
        <span>|</span>
        <a
          href="https://steamcommunity.com/id/mycecile/"
          className={footerItem}
        >
          TrickManager[srfgxds]
        </a>
      </div>
    </footer>
  )
}
