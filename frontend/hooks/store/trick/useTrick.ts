import ActionCreators from '../../../stores/trick.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback, useEffect } from 'react'
import { Maps } from '@types'
import { clientHandle } from 'utils/graphql'
import { TRICKS_STATS, TRIGGERS } from 'types/graphql/quary'
import { UPDATE_TRIGGER } from '../../../types/graphql/mutation/triggers'
import { useTrickFilters } from './useTrickFilters'
import { SortingTricksOptions, SortTrickSetting, Trick } from '@store'

// Trick Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useTrick = () => {
  const { filteringTricks } = useTrickFilters()

  const dispatch = useDispatch()

  const { loadedTricks, filtered, updatedTrigger, updatedTrick, sorted } =
    bindActionCreators(ActionCreators.actions, dispatch)
  const { tricks, filteredTricks, triggers, sortSettings, filters } =
    useTypesSelector((state) => state.trick)

  const loadTricks = useCallback(
    async (map: Maps, steamid64: string | null) => {
      const [tricks, tricksErrors] = await clientHandle(TRICKS_STATS, {
        mapId: map.id,
        steamId: steamid64,
      })
      const [triggers, triggersErrors] = await clientHandle(TRIGGERS, {
        mapId: map.id,
      })
      // console.log('mounted', tricks, triggers, map)
      loadedTricks({ tricks, triggers })
      return { tricks, triggers }
    },
    []
  )

  const updatingTrigger = async (name: string, id: number, src: string) => {
    const [trigger, triggerErrors] = await clientHandle(UPDATE_TRIGGER, {
      id,
      name,
      src,
    })

    updatedTrigger(trigger)
  }

  // const filteringTricks = (tricks: Trick[], filters: FiltersTrick) => {
  //   const filteredTricks = tricks.filter(
  //     (val) =>
  //       val.name.toLowerCase().includes(filters.term.toLowerCase()) &&
  //       val.point >= filters.pointsRange.min &&
  //       val.point <= filters.pointsRange.max
  //   )

  //   filtered({
  //     tricks: filteredTricks,
  //     filters,
  //   })
  // }

  const sortingTricks = (
    tricks: Trick[],
    sortingTricksOption: SortingTricksOptions
  ) => {
    const sortSetting: SortTrickSetting = {
      sort: sortingTricksOption,
      dir:
        sortSettings.sort === sortingTricksOption
          ? sortSettings.dir === 'desc'
            ? 'asc'
            : 'desc'
          : 'desc',
    }

    const sortedTricks = tricks.sort((a: any, b: any) => {
      if (a[sortSetting.sort] < b[sortSetting.sort]) {
        return sortSetting.dir === 'asc' ? -1 : 1
      }
      if (a[sortSetting.sort] > b[sortSetting.sort]) {
        return sortSetting.dir === 'asc' ? 1 : -1
      }
      return -1
    })

    sorted({
      tricks: sortedTricks,
      sortSetting,
    })

    filteringTricks(sortedTricks, filters)
  }

  return {
    updatedTrick,
    updatingTrigger,
    tricks,
    filteredTricks,
    triggers,
    loadedTricks,
    loadTricks,
    sortSettings,
    filters,
    sortingTricks,
  }
}
