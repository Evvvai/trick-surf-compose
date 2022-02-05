import ActionCreators from '../../../stores/player.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { clientHandle } from 'utils/graphql'
import { SET_AVATAR, SET_DASHBOARD } from 'types/graphql/mutation'
import { useRouter } from 'next/dist/client/router'

// Player Preference Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const usePlayerPreference = () => {
  const router = useRouter()

  const dispatch = useDispatch()

  const { setAvatar, setDashboard } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )

  const changeAvatar = useCallback((url: string) => {
    setAvatar(url)
    clientHandle(SET_AVATAR, { url: url })
    router.reload()
  }, [])

  const changeDashboard = useCallback((url: string) => {
    setDashboard(url)
    clientHandle(SET_DASHBOARD, { url: url })
    router.reload()
  }, [])

  return { changeAvatar, changeDashboard }
}
