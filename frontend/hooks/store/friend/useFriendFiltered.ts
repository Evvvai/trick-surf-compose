import ActionCreators from '../../../stores/friend.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'

// Friend filtered Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useFriendFiltered = () => {
  const dispatch = useDispatch()
  const { filteredFriends } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )
  const { friends, filteredFriendsIds, term } = useTypesSelector(
    (state) => state.friend
  )

  const filteringFriends = useCallback(async (term: string) => {
    filteredFriends({
      term,
      ids: friends
        .filter((key) => key.nick.includes(term))
        .map((friend) => friend.id),
    })
  }, [])

  return { termFriend: term, filteredFriendsIds, filteringFriends }
}
