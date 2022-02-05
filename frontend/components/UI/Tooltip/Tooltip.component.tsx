import styled from 'styled-components'
import {
  createRef,
  forwardRef,
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'react'
import React from 'react'
import { Portal } from 'utils/portal'

interface TooltipProps {
  theme?: boolean
  borders?: boolean
  className?: string
  delay?: any
  bg?: any

  posRef: any
  show: any
}

const StyledTooltip = styled.span<TooltipProps>`
  position: fixed;
  top: ${(p: any) => p.posRef.current.y}px;
  left: ${(p: any) => p.posRef.current.x}px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  background-color: rgba(var(--color-${(p) => p.bg}-rgb, 0, 0, 0), 0.9);
  color: var(--color-${(p) => p.bg}-contrast, 255, 255, 255);
  pointer-events: all;
  padding: 7px 10px;
  border-radius: 4px;
  z-index: 99999;
  display: inline-block;
  opacity: ${(p: any) => p.show}.0;

  transition-property: transform, opacity !important;
  transition-duration: 0.06s !important;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1) !important;
  transition-delay: ${(p: any) => (p.show ? p.delay : 0.02)}s !important;

  transform-origin: ${(p: any) => position(p.placment).negate()};
  transform: scale(${(p: any) => (p.show ? 1 : 0.7)});
`

const position = (p: any) => ({
  current: p,
  negate() {
    if (this.current === 'left') return 'right'
    if (this.current === 'right') return 'left'
    if (this.current === 'top') return 'bottom'
    if (this.current === 'bottom') return 'top'
  },
  isHorizontal() {
    return this.current === 'left' || this.current === 'right'
  },
  isVertical() {
    return this.current === 'top' || this.current === 'bottom'
  },
})

const point = () => ({
  x: 0,
  y: 0,
  reset(p: { x: number; y: number }) {
    this.x = p.x
    this.y = p.y
  },
  restrictRect(rect: any) {
    if (this.x < rect.l) this.x = rect.l
    else if (this.x > rect.r) this.x = rect.r
    if (this.y < rect.t) this.y = rect.t
    else if (this.y > rect.b) this.y = rect.b
  },
})

const getPoint = (el: any, tt: any, placement: any, space: any) => {
  let recurCount = 0
  const pt = point()
  const bdys = {
    l: space,
    t: space,
    r: document.body.clientWidth - (tt.clientWidth + space),
    b: window.innerHeight - (tt.clientHeight + space),
  }
  const elRect = el.getBoundingClientRect()

  return (function recursive(placement) {
    recurCount++
    const pos = position(placement)
    switch (pos.current) {
      case 'left':
        pt.x = elRect.left - (tt.offsetWidth + space)
        pt.y = elRect.top + (el.offsetHeight - tt.offsetHeight) / 2
        break
      case 'right':
        pt.x = elRect.right + space
        pt.y = elRect.top + (el.offsetHeight - tt.offsetHeight) / 2
        break
      case 'top':
        pt.x = elRect.left + (el.offsetWidth - tt.offsetWidth) / 2
        pt.y = elRect.top - (tt.offsetHeight + space)
        break
      default:
        pt.x = elRect.left + (el.offsetWidth - tt.offsetWidth) / 2
        pt.y = elRect.bottom + space
    }

    if (recurCount < 3) {
      if (
        (pos.isHorizontal() && (pt.x < bdys.l || pt.x > bdys.r)) ||
        (pos.isVertical() && (pt.y < bdys.t || pt.y > bdys.b))
      ) {
        // console.log('recurCount', recurCount)
        pt.reset(recursive(pos.negate()))
      }
    }

    // restrict to rect boundary
    pt.restrictRect(bdys)

    return pt
  })(placement)
}

interface ToolTipProps {
  content?: any
  children?: any
  placement?: string
  reset?: number
  space?: number
  delay?: number
  bg?: string
}

function ToolTip({
  content,
  children,
  reset = 500,
  delay = 50,
  placement = 'right',
  space = 5,
  bg = 'dark',
}: ToolTipProps) {
  const [show, setShow] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)
  const [target, setTarget] = useState<any>(null)
  const [saveTimerOut, setSaveTimerOut] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)
  const [saveTimerOver, setSaveTimerOver] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)

  const posRef = useRef({ x: 0, y: 0 })
  // const tooltipRef = useRef<any>(null)

  const tooltipRef = createRef()

  const handleMouseOver = (e: any) => {
    if (!active) {
      setSaveTimerOver(
        setTimeout(() => {
          setTarget(e.target)
          setActive(true)
        }, delay)
      )
    }
    if (saveTimerOut) clearTimeout(saveTimerOut)
  }

  const handleMouseOut = () => {
    if (!active && saveTimerOver) clearTimeout(saveTimerOver)
    setSaveTimerOut(
      setTimeout(() => {
        setTimeout(() => {
          setActive(false)
        }, 200)
        setShow(false)
      }, reset)
    )
  }

  useEffect(() => {
    if (tooltipRef.current && active && target && !show) {
      posRef.current = getPoint(target, tooltipRef.current, placement, space)
      setShow(true)
    }
  }, [tooltipRef.current, active, target])

  const Tip = forwardRef((props, ref: any) => (
    <StyledTooltip
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      ref={ref}
      posRef={posRef}
      show={show}
      bg={bg}
    >
      {content}
    </StyledTooltip>
  ))

  if (!active) {
    return React.cloneElement(children, {
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
    })
  }

  return (
    <Fragment>
      {React.cloneElement(children, {
        onMouseOver: handleMouseOver,
        onMouseOut: handleMouseOut,
      })}
      <Tip ref={tooltipRef} />
    </Fragment>
  )
}

export default ToolTip
