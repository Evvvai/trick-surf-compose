import React, { FC } from 'react'

// Styles
import styles from './NotificationAside.module.scss'
const {
  Open,
  notificationAside,
  content,
  title,
  hrH,
  list,
  notFound,
  item,
  Empty,
} = styles

// Components
import { MdPersonAdd } from 'react-icons/md'

// Custom hooks
import { useNotification } from 'hooks/store/notification'

// Utils
import cn from 'classnames'
import { useRouter } from 'next/dist/client/router'

///////////////////////////////////////////////////////////////////////////////////////////
const NotificationAside: FC = () => {
  const {
    openNotification,
    closeNotification,
    isNotificationLoad,
    isNotificationOpen,
  } = useNotification()

  const router = useRouter()

  const handleClickClose = () => {}

  return (
    <div className={cn(notificationAside, { [Open]: isNotificationOpen })}>
      <div className={content}>
        <div className={title}>
          <h1>Notifications</h1>
        </div>
        <hr className={hrH} />
        <div></div>
        <ul className={list}>
          <div className={notFound}>
            <h1>No one needs you</h1>
            <img src={process.env.NOT_INVITES} />
          </div>
        </ul>
      </div>
    </div>
  )
}

export default React.memo(NotificationAside)
