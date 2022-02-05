import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

// Style
import style from './MySlider.module.scss'

// Custom hooks
import { useResizeContent, useResizeWindow } from 'hooks/events'
import { debounce } from 'utils/browser'

// Utils

// Interface
interface Props {
  min: number
  max: number
  currentMin: number
  currentMax: number
  thumbsize?: number
  callback?: (min: number, max: number) => void | null
  debounceDelay?: number
  dependencies?: any
}

export default function MySlider({
  min,
  max,
  currentMax,
  currentMin,
  thumbsize = 14,
  callback,
  debounceDelay,
  dependencies,
}: Props): JSX.Element {
  const debounceCallback = callback || (() => {})
  const debounceTime = debounceDelay || 100

  const dFuncCallback = debounce<typeof debounceCallback>(
    debounceCallback,
    debounceTime
  )

  const dFunc = useCallback(
    (min: number, max: number) => {
      dFuncCallback(min, max)
    },
    [...(dependencies || [])]
  )

  const ref = useRef(null)
  const { width } = useResizeContent(ref)

  const [avg, setAvg] = useState((min + max) / 2)
  const [minVal, setMinVal] = useState(currentMin)
  const [maxVal, setMaxVal] = useState(currentMax)

  const minWidth =
    thumbsize + ((avg - min) / (max - min)) * (width - 2 * thumbsize)
  const minPercent = ((minVal - min) / (avg - min)) * 100
  const maxPercent = ((maxVal - avg) / (max - avg)) * 100

  const styles = {
    min: {
      width: minWidth || 0,
      left: 0,
      '--minRangePercent': `${minPercent}%`,
    },
    max: {
      width:
        thumbsize + ((max - avg) / (max - min)) * (width - 2 * thumbsize) || 0,
      left: minWidth || 0,
      '--maxRangePercent': `${maxPercent}%`,
    },
  }

  const mounted = useRef<boolean | null>(null)
  useEffect(() => {
    if (!mounted.current) mounted.current = true
    else if (callback) dFunc(~~minVal, ~~maxVal)

    setAvg((maxVal + minVal) / 2)
  }, [minVal, maxVal])

  return (
    <Fragment>
      <div className={style.range}>
        <span className={style.rangeMin}>{min}</span>
        <div className={style.rangeCurrent}>
          <span>{~~minVal}</span>
          <span> - </span>
          <span>{~~maxVal}</span>
        </div>
        <span className={style.rangeMax}>{max}</span>
      </div>
      <div
        ref={ref}
        className={style.minMaxSlider}
        data-legendnum="2"
        data-rangemin={min}
        data-rangemax={max}
        data-thumbsize={thumbsize}
        data-rangewidth={width}
      >
        <input
          className={style.min}
          style={styles.min}
          name="min"
          type="range"
          step="1"
          min={min}
          max={avg}
          value={minVal}
          onChange={({ target }) => setMinVal(Number(target.value))}
        />
        <input
          className={style.max}
          style={styles.max}
          name="max"
          type="range"
          step="1"
          min={avg}
          max={max}
          value={maxVal}
          onChange={({ target }) => setMaxVal(Number(target.value))}
        />
      </div>
    </Fragment>
  )
}
