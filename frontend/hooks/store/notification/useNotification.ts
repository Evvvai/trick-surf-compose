import ActionCreators from '../../../stores/notification.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'

// Notification Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useNotification = () => {
  const dispatch = useDispatch()
  const { openNotification, closeNotification } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )
  const { isNotificationLoad, isNotificationOpen } = useTypesSelector(
    (state) => state.notification
  )

  return {
    openNotification,
    closeNotification,
    isNotificationLoad,
    isNotificationOpen,
  }
}
