import ActionCreatorsApp from '../../../stores/app.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import { clientHandle } from 'utils/graphql'
import { AUTH } from 'types/graphql/mutation'
import { Maps } from '@types'
import { setCookie } from 'nookies'
import { resetLeaderboard } from 'stores/leaderboard.slice'
import { resetTrickEditor } from 'stores/trick-editor.slice'
import { resetTricks } from 'stores/trick.slice'

// Application Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useApp = () => {
  const dispatch = useDispatch()
  const { appLoaded, changedMap } = bindActionCreators(
    ActionCreatorsApp.actions,
    dispatch
  )
  const { isLoad, currentMap, availableMaps } = useTypesSelector(
    (state) => state.app
  )

  const changeMap = (map: Maps) => {
    dispatch(resetLeaderboard())
    dispatch(resetTrickEditor())
    dispatch(resetTricks())
    changedMap(map)
    setCookie(null, 'map', map.id.toString(), {
      path: '/',
    })
  }

  return { currentMap, availableMaps, isLoad, appLoaded, changeMap }
}
