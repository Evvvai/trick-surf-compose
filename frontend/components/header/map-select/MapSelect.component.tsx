import React, { FC, Fragment, useEffect, useState } from 'react'
import cn from 'classnames'

// Styles
import stylesModal from '../../../styles/modal/ModalSkelet.module.scss'
import styles from './MapSelect.module.scss'

// Icons
import { IoIosClose } from 'react-icons/io'
import Link from 'next/link'

// Components

// Custom Hooks
import { useApp } from 'hooks/store/app'
import { Maps } from '@types'

// Utils

// Interface
interface Props {
  close?: any
  isOpen?: any
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function MapSelect(props: Props): JSX.Element {
  const { availableMaps, changeMap } = useApp()

  const handleClickMap = (map: Maps) => () => {
    props.close()
    changeMap(map)
  }

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      className={stylesModal.formContent}
    >
      <section className={stylesModal.formInner}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.headerTitle}>Choose map</h1>
            <hr />
          </div>
          <ul className={styles.list}>
            {availableMaps.map((map) => {
              return (
                <li
                  className={styles.item}
                  onClick={handleClickMap(map)}
                  key={map.id}
                >
                  <div className={styles.itemInner}>
                    <img
                      className={styles.itemImg}
                      src={map?.src || process.env.AVATAR_NULL}
                    />
                    <span className={styles.itemTitle}>{map.name}</span>
                    <div className={styles.itemBack} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
      <div className={stylesModal.formClose} onClick={props.close}>
        <IoIosClose />
      </div>
    </form>
  )
}
