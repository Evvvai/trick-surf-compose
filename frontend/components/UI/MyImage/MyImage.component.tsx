import { useEffect, useState } from 'react'

// Style
import styles from './MyImage.module.scss'

// Utils
import cn from 'classnames'

// Interface
interface Props {
  photo: Photo
  style?: any
}

interface Photo {
  src: string
}

// Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function MyImage(props: Props): JSX.Element {
  const [isLoad, setIsLoad] = useState<boolean>(false)

  useEffect(() => {
    const image = new Image()
    image.src = props.photo.src
    image.onload = () => {
      setIsLoad(true)
    }
  }, [])
  return (
    <img
      className={cn([styles.image], [props?.style], {
        [styles.isLoading]: !isLoad,
      })}
      src={props.photo.src}
      alt="img"
    />
  )
}
