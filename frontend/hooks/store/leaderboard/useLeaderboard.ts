import ActionCreators from '../../../stores/leaderboard.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import { Pagination } from '../../../types/store'
import { clientHandle } from 'utils/graphql'
import { LEADERBOARD_CACHED } from 'types/graphql/quary'
import { useApp } from '../app'
import { Maps } from '@types'

// Leaderboard Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useLeaderboard = () => {
  const { currentMap } = useApp()
  const dispatch = useDispatch()

  const { loadedLeaderboard } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )

  const { pagination, top } = useTypesSelector((state) => state.leaderboard)

  const changePagination = useCallback(async (pagination: Pagination) => {
    const [data, errors] = await clientHandle(LEADERBOARD_CACHED, {
      mapId: currentMap?.id,
      limit: pagination.limit,
      offset: pagination.offset,
    })

    loadedLeaderboard({ top: data, pagination })
  }, [])

  const loadLeaderboard = useCallback(
    async (map: Maps, pagination: Pagination) => {
      const [top, errors] = await clientHandle(LEADERBOARD_CACHED, {
        mapId: map.id,
        limit: pagination.limit,
        offset: pagination.offset,
      })

      loadedLeaderboard({ top, pagination })
    },
    []
  )

  return {
    loadLeaderboard,
    loadedLeaderboard,
    changePagination,
    pagination,
    top,
  }
}
