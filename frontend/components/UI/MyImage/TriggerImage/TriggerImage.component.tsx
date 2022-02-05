import {
  Fragment,
  useEffect,
  useState,
  useRef,
  createRef,
  forwardRef,
  FC,
} from 'react'

// Style
import styles from './TriggerImage.module.scss'

// Utils
import cn from 'classnames'

// Interface
interface Props {
  photo: Photo
  style?: any
}

interface Photo {
  src: string | null
}

// Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const TriggerImage: FC<Props> = (props: Props) => {
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  const ref = useRef<HTMLDivElement | null>(null)

  const src = props.photo?.src || (process.env.NOT_TRIGGER as string)

  useEffect(() => {
    if (!mounted) setMounted(true)
    else {
      const image = new Image()
      image.src = src
      image.onload = () => setIsLoad(true)
    }
  }, [mounted])

  return (
    <div ref={ref} className={styles.content}>
      {!isLoad && mounted ? (
        <div
          className={styles.isLoading}
          style={{ width: ref?.current?.clientHeight + 'px' }}
        />
      ) : (
        <img
          className={styles.image}
          src={src}
          alt="."
          style={{ width: ref?.current?.clientHeight }}
        />
      )}
    </div>
  )
}

export default TriggerImage
