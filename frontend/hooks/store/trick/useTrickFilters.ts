import ActionCreators from '../../../stores/trick.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { FiltersTrick, Trick } from '@store'
import { useTypesSelector } from '../useTypesSelector'
import { Trigger } from '../../../types/store/tricks'

// Trick Filters Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useTrickFilters = () => {
  const dispatch = useDispatch()

  const { filtered } = bindActionCreators(ActionCreators.actions, dispatch)
  const { filters, tricks } = useTypesSelector((state) => state.trick)

  const addTriggerToFilters = (trigger: Trigger) => {
    filteringTricks(
      [...tricks],
      filters.triggers.find((x) => x.id === trigger.id)
        ? {
            ...filters,
            triggers: [...filters.triggers].filter((x) => x.id !== trigger.id),
          }
        : { ...filters, triggers: [...filters.triggers, trigger] }
    )
  }

  const filteringTricks = (tricks: Trick[], filters: FiltersTrick) => {
    const validName = (trick: Trick): boolean =>
      trick.name.toLowerCase().includes(filters.term.toLowerCase())

    const validPoints = (trick: Trick): boolean =>
      trick.point >= filters.pointsRange.min &&
      trick.point <= filters.pointsRange.max

    const validTriggers = (trick: Trick): boolean => {
      if (filters.triggers.length === 0) return true

      let isValid = true
      const triggerIds = trick.routeIds.split(',')

      for (let i = 0; i < filters.triggers.length; i++) {
        const isExist = triggerIds.find((id) => +id === filters.triggers[i].id)

        if (!isExist) {
          isValid = false
          break
        }
      }

      return isValid
    }

    const filteredTricks: Trick[] = []

    for (let i = 0; i < tricks.length; i++) {
      if (!validName(tricks[i])) continue
      if (!validPoints(tricks[i])) continue
      if (!validTriggers(tricks[i])) continue

      filteredTricks.push(tricks[i])
    }

    filtered({
      tricks: filteredTricks,
      filters,
    })
  }

  return {
    filters,
    filteringTricks,
    addTriggerToFilters,
  }
}
