import React, { useState } from 'react'

// Styles
import styles from './TrickEditorSubmit.module.scss'

// Components

// Custom hooks

// Utils
import { useRouter } from 'next/dist/client/router'
import cn from 'classnames'
import { useTrickEditor } from 'hooks/store/trick-editor'
import { usePlayer } from '../../../hooks/store/player/usePlayer'
import { clientHandle } from 'utils/graphql'
import { SEND_TRICK } from 'types/graphql/mutation/trick-editor'
import { useApp } from '../../../hooks/store/app/useApp'

interface Props {}

///////////////////////////////////////////////////////////////////////////////////////////
export default function TrickEditorSubmit(props: Props): JSX.Element {
  const {
    name,
    points,
    route,
    velocity,
    setNameTrick,
    setPointsTrick,
    setVelocityTrick,
    sendTrick,
  } = useTrickEditor()
  const { isLoggedIn, playerInfo } = usePlayer()
  const { currentMap } = useApp()
  const router = useRouter()

  const handleClickSumbit = async (e: any) => {
    var regName = /^[A-Za-z0-9 ]*$/
    var regPoints = /^[0-9]*$/

    if (!isLoggedIn) {
      // setError('Log in to be able to suggest tricks')
      return
    }

    let errors: string | null = null

    if (!name) errors = 'Name trick cannot be empty'
    else if (!regName.test(name)) errors = 'Name trick incorrect'
    if (!points) errors = 'Points trick cannot be empty'
    else if (!regPoints.test(points.toString()))
      errors = 'Points trick can only store numbers'
    if (route.length < 2) errors = 'Route have less than 2 triggers'

    if (errors) {
      // Staff
    } else {
      const [data, errors] = await clientHandle(SEND_TRICK, {
        name: name,
        point: points,
        velocity: velocity ? 1 : 0,
        authorId: playerInfo.id,
        mapId: currentMap?.id,
        route: route.map((trigger) => trigger.id).join(','),
      })

      if (data && !errors) {
        router.push('/tricks/suggested/' + currentMap?.name)
        sendTrick()
      } else {
        // setError('')
      }
      // isTrickEditing !== TrickEditing.NONE
      //   ? sendEditedTrick(trickCreator, map, isTrickEditing)
      //   : sendTrick(trickCreator, map)
    }
  }

  return (
    <div className={styles.content}>
      <div> Summary </div>
      <div className={styles.name}>
        <div> Name </div>
        <input
          onChange={(event) => setNameTrick(event.target.value)}
          value={name || ''}
          maxLength={32}
          type="text"
          placeholder="write name of trick"
        />
      </div>
      <div className={styles.points}>
        <div> Points </div>
        <input
          onChange={(event) => {
            if (event.target.valueAsNumber > 9999) return
            setPointsTrick(event.target.valueAsNumber)
          }}
          value={points || ''}
          type="number"
          placeholder="write amount points for trick"
        />
      </div>
      <div className={styles.velocity}>
        <div> Velocity </div>
        <div
          onClick={() => setVelocityTrick(!velocity)}
          className={styles.velocityControl}
        >
          {/* <input
            checked={velocity}
            className={styles.velocityControlInput}
            type="radio"
            onClick={() => setVelocityTrick(!velocity)}
          /> 
          <span className={styles.velocityControlIndicator}></span>*/}
          <div className={styles.velocityControlText}>
            {velocity ? 'unlimited speed' : 'pre-strafe'}
          </div>
        </div>
      </div>
      <div className={styles.route}>
        <div> Route </div>
        <div>
          {route.length === 0
            ? 'youre route empty'
            : route.map((val, key) => {
                return <div key={key}>{val.name + ','}</div>
              })}
        </div>
      </div>

      {/* <FormControlLabelSwitch
        control={
          <CyanSwitch
            checked={!velocity}
            onChange={(e) => setVelocityTrick(!velocity)}
            color="primary"
            name="checkedB"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        label="Pre-Strafe"
        labelPlacement="start"
      /> */}
      <div onClick={handleClickSumbit} className={styles.submit}>
        Submit for review
      </div>
    </div>
  )
}
