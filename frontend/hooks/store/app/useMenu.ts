import ActionCreatorsApp from '../../../stores/app.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'

// Menu Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useMenu = () => {
  const dispatch = useDispatch()
  const { openMenu, closeMenu } = bindActionCreators(
    ActionCreatorsApp.actions,
    dispatch
  )
  const { isMenuOpen } = useTypesSelector((state) => state.app)

  return { isMenuOpen, openMenu, closeMenu }
}
