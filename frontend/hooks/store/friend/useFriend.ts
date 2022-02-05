import ActionCreators from '../../../stores/friend.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback, useMemo } from 'react'
import { clientHandle } from '../../../utils/graphql/index'
import { PLAYER_NEW_FRIENDS } from 'types/graphql/mutation'
import { Friend } from '@store'

// Friend Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useFriend = () => {
  const dispatch = useDispatch()
  const { openFriend, closeFriend, updatedFriends } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )
  const { isFriendOpen, friends, isFriendLoad } = useTypesSelector(
    (state) => state.friend
  )

  const updateFriends = useCallback(async (): Promise<Friend[]> => {
    const [data, errors] = await clientHandle(PLAYER_NEW_FRIENDS, {})

    // Must be create sync callback
    if (data && !errors) updatedFriends(data)

    return data
  }, [])

  return {
    isFriendOpen,
    openFriend,
    closeFriend,
    updateFriends,
    friendsList: friends,
    isFriendLoad,
  }
}
