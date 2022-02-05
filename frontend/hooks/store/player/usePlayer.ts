import ActionCreators from '../../../stores/player.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import client, { clientHandle } from 'utils/graphql'
import { AUTH } from 'types/graphql/mutation'
import { setCookie } from 'nookies'
import { useApp } from '../app/useApp'
import { PLAYER_STATS } from 'types/graphql/quary'

// Player Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const usePlayer = () => {
  const { currentMap } = useApp()

  const dispatch = useDispatch()

  const { setPlayerSetting, removePlayerSetting } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )
  const { isLoggedIn, playerInfo } = useTypesSelector((state) => state.player)

  const logOut = useCallback(() => {
    removePlayerSetting()
    // destroyCookie(null, 'token')
    // browserStorage.removeItem('token') // Obsolete
  }, [])

  const authPlayer = useCallback(async (token: string): Promise<boolean> => {
    client.setHeader('authorization', token)
    const [data, errors] = await clientHandle(AUTH, {})

    if (!errors && data) setPlayer(data)
    else logOut()

    return !errors && data ? true : false
  }, [])

  const setPlayer = useCallback(async (data: any) => {
    // browserStorage.setItem('token', data.token)  // Obsolete
    setCookie(null, 'token', data.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })
    setPlayerSetting(data)
  }, [])

  const loadPlayerStats = useCallback(
    async (steamid: string) => {
      // browserStorage.setItem('token', data.token)  // Obsolete
      const [playerStats, playerStatsErrors] = await clientHandle(
        PLAYER_STATS,
        {
          steamid64: steamid,
          mapId: currentMap.id,
        }
      )

      return playerStats
    },
    [currentMap]
  )

  return {
    isLoggedIn,
    playerInfo,
    authPlayer,
    logOut,
    setPlayer,
    loadPlayerStats,
  }
}
