import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useState,
} from 'react'
import style from './Modal.module.scss'

// Style
const { modal, modal_open, modal_close, modal__inner, modal__content } = style

// Utils
import cn from 'classnames'

// Interface
interface Props {
  isOpen: any
  setOpen: any
  children: JSX.Element

  setOuterIsLock?: any

  customClass?: any
}

// Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function Modal(props: Props): JSX.Element {
  const [isLock, setIsLock] = useState<boolean>(false)

  const handleClickClose = useCallback(() => {
    if (!isLock) {
      setIsLock(true)
      if (props?.setOuterIsLock) props.setOuterIsLock(true)

      setTimeout(() => {
        setIsLock(false)
        if (props?.setOuterIsLock) props.setOuterIsLock(false)

        props.setOpen(false)
      }, 400)
    }
  }, [])

  const childrenWithProps = Children.map(props.children, (child) => {
    if (isValidElement(child)) {
      return cloneElement<any>(child, {
        close: handleClickClose,
        isOpen: props.isOpen,
      })
    }
    return child
  })

  return (
    <div
      onMouseDown={handleClickClose}
      className={cn(
        modal,
        { [modal_open]: props.isOpen },
        { [modal_close]: isLock },
        props.customClass
      )}
    >
      <div className={modal__inner}>
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className={modal__content}
        >
          {childrenWithProps}
        </div>
      </div>
    </div>
  )
}
