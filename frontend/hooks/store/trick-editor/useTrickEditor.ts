import ActionCreators from '../../../stores/trick-editor.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import { Maps } from '@types'
import { useTrick } from '../trick/useTrick'
import { usePlayer } from '../player/usePlayer'

// Trick Editor Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useTrickEditor = () => {
  const { playerInfo } = usePlayer()
  const { loadTricks } = useTrick()
  const dispatch = useDispatch()

  const {
    setRouteTrick,
    setTriggerTrick,
    setPointsTrick,
    setNameTrick,
    clearTrickEditor,
    sendTrick,
    loadedTrickEditor,
    setVelocityTrick,
  } = bindActionCreators(ActionCreators.actions, dispatch)

  const { name, points, route, trickEditingId, trigger, velocity } =
    useTypesSelector((state) => state.trickEditor)

  const loadTrickEditor = useCallback(async (map: Maps) => {
    const { tricks, triggers } = await loadTricks(map, playerInfo?.steamid64)
    loadedTrickEditor(triggers)
  }, [])

  return {
    loadTrickEditor,
    sendTrick,
    setVelocityTrick,
    clearTrickEditor,
    setPointsTrick,
    setNameTrick,
    setTriggerTrick,
    setRouteTrick,
    name,
    points,
    route,
    trickEditingId,
    trigger,
    velocity,
  }
}
