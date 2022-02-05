import React, { Fragment, memo, useEffect, useRef, useState } from 'react'

// Styles
import styles from './ThemeSection.module.scss'
const { theme, variouse, Active } = styles

// Components
import { GiSun } from 'react-icons/gi'
import { IoMdRainy } from 'react-icons/io'
import { GiNightSleep } from 'react-icons/gi'

// Custom hooks
import { useTheme } from 'hooks/theme'

// Utils
import Link from 'next/link'
import cn from 'classnames'
import { ThemeVarious } from 'contexts/theme'

interface Props {}

///////////////////////////////////////////////////////////////////////////////////////////
export default function ThemeSection(props: Props): JSX.Element {
  const [currentThemeIcon, setCurrentThemeIcon] = useState<any>()
  const [active, setActive] = useState<boolean>(false)

  const { themeContext, setThemeContext } = useTheme()

  const handleClickTheme = (theme: ThemeVarious) => (e: any) => {
    setThemeContext(theme)
  }

  useEffect(() => {
    setCurrentThemeIcon(themeIcon.get(themeContext))
  }, [themeContext])

  return (
    <div onClick={(e) => setActive(!active)} className={theme}>
      {currentThemeIcon}
      <div>Theme</div>
      <div className={cn(variouse, { [Active]: active })}>
        <GiSun onClick={handleClickTheme('light')} />
        <IoMdRainy onClick={handleClickTheme('blue')} />
        <GiNightSleep onClick={handleClickTheme('dark')} />
      </div>
    </div>
  )
}

// Hardcode
const themeIcon = new Map<ThemeVarious, JSX.Element>([
  ['system', <GiSun key={1} />],
  ['light', <GiSun key={2} />],
  ['dark', <GiNightSleep key={3} />],
  ['blue', <IoMdRainy key={4} />],
])
