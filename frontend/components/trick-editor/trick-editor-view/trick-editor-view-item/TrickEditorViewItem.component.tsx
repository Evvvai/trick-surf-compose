import React, { useState } from 'react'

// Styles
import styles from './TrickEditorViewItem.module.scss'

// Components
import TriggerImage from '../../../UI/MyImage/TriggerImage/TriggerImage.component'

// Custom hooks
import { useTrickEditor } from 'hooks/store/trick-editor'

// Utils
import { Trigger } from '../../../../types/store'

// Interface
interface Props {
  trigger: Trigger
  index: number
  setCurrentDrag: any
  currentDrag: number
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function TrickEditorViewItem(props: Props): JSX.Element {
  const { route, setRouteTrick } = useTrickEditor()
  // const { trickCreator } = useTrick()
  // const { setRouteTrick } = useSetTrick()

  const handleClickUp = (key: any) => (e: any) => {
    let data = [...route]

    let firtsIndex = key
    let secondIndex = key == 0 ? data.length - 1 : key - 1

    let temp = data[secondIndex]
    data[secondIndex] = data[firtsIndex]
    data[firtsIndex] = temp

    setRouteTrick(data)
  }

  const handleClickDown = (key: any) => (e: any) => {
    let data = [...route]

    let firtsIndex = key
    var secondIndex = key == data.length - 1 ? 0 : Number(key) + 1

    let temp = data[secondIndex]
    data[secondIndex] = data[firtsIndex]
    data[firtsIndex] = temp

    setRouteTrick(data)
  }

  const handleClickRemove = (key: any) => (e: any) => {
    let data = [...route]
    data.splice(key, 1)
    setRouteTrick(data)
  }

  const handleClickSwitch = (firtsIndex: number, secondIndex: number) => {
    let data = [...route]

    let temp = data[secondIndex]
    data[secondIndex] = data[firtsIndex]
    data[firtsIndex] = temp

    setRouteTrick(data)
  }

  const dragStartHandler = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    props.setCurrentDrag(index)
  }

  const dragEndHandler = (e: React.DragEvent<HTMLDivElement> | any) => {
    // e.target.style.background = '#121212'
  }

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement> | any) => {
    // e.target.style.background = '#101010'
    e.preventDefault()
    e.stopPropagation()
  }

  const dropHandler = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    handleClickSwitch(index, props.currentDrag)
  }

  return (
    <div
      onDragStart={(e) => {
        dragStartHandler(e, props.index)
      }}
      onDragLeave={(e) => {
        dragEndHandler(e)
      }}
      onDragEnd={(e) => {
        dragEndHandler(e)
      }}
      onDragOver={(e) => {
        dragOverHandler(e)
      }}
      onDrop={(e) => {
        dropHandler(e, props.index)
      }}
      draggable={true}
      className={styles.item}
    >
      <div className={styles.title}>{props.trigger.name}</div>
      <div className={styles.img}>
        <TriggerImage photo={{ ...props.trigger }} />
      </div>
      <div className={styles.count}>{props.index + 1}</div>
      {/* <SpeedTimeStats load={true} routeStats={props.routeStats} /> */}
      <div className={styles.control}>
        <div onClick={handleClickUp(props.index)} className={styles.controlUp}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
          </svg>
        </div>
        <div
          onClick={handleClickDown(props.index)}
          className={styles.controlDown}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </div>
        <div
          onClick={handleClickRemove(props.index)}
          className={styles.controlRemove}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 13H5v-2h14v2z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
