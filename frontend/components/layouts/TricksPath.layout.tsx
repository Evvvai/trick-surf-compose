import { FC, Fragment, useEffect, useState } from 'react'

// Styles
import styles from '../../styles/layouts/Layouts.module.scss'

// Icons
// import { AiOutlineAppstoreAdd } from 'react-icons/ai'

// Component

// Custom hooks
import { useRouter } from 'next/dist/client/router'
import { useApp } from 'hooks/store/app'
import Link from 'next/link'
import cn from 'classnames'

// Utils

//////////////////////////////////////////////////////////////////////////////////////
const TricksPath: FC = ({ children }) => {
  const { currentMap } = useApp()
  const router = useRouter()

  const [section, setSection] = useState<number | undefined>(undefined)

  useEffect(() => {
    const pathSplit = router.pathname.split('/').splice(1, 3)

    if (pathSplit[0] === 'tricks') {
      setSection(TricksSection[router.pathname.split('/')[2]])
    } else {
      if (section !== undefined) setSection(undefined)
    }
  }, [router.pathname])

  return (
    <Fragment>
      <div
        className={cn(styles.layoutsTricks, {
          [styles.hide]: section === undefined,
        })}
      >
        <div className={styles.layoutsTricksTitle}>
          <h1>Tricks</h1>
        </div>
        <ul className={styles.layoutsTricksVarious}>
          <span
            style={{ transform: 'translateX(' + 100 * (section || 0) + 'px)' }}
          />
          <li className={styles.layoutsTricksVariousItem}>
            <Link
              href={{
                pathname: '/tricks/' + currentMap?.name,
              }}
            >
              <a>Tricks</a>
            </Link>
          </li>
          <li className={styles.layoutsTricksVariousItem}>
            <Link
              href={{
                pathname: '/tricks/triggers/' + currentMap?.name,
              }}
            >
              <a>Triggers</a>
            </Link>
          </li>
          <li className={styles.layoutsTricksVariousItem}>
            <Link
              href={{
                pathname: '/tricks/suggested/' + currentMap?.name,
              }}
            >
              <a>Suggested</a>
            </Link>
          </li>
        </ul>
      </div>
      {children}
    </Fragment>
  )
}
export default TricksPath

const TricksSection: Record<string, number> = {
  '[map]': 0,
  triggers: 1,
  suggested: 2,
}
