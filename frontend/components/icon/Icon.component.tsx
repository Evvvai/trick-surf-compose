import React, { createElement } from 'react'
import dynamic from 'next/dynamic'
import styles from './Icon.module.scss'
import cn from 'classnames'

const { icon, loader } = styles

type IconProps = {
  asset: string
  className?: string
}

const Loader = ({ className = '' }: IconProps): JSX.Element => (
  <span className={cn(icon, loader, className)} />
)

export default function Icon(props: IconProps): JSX.Element {
  const { asset, className: argClassName = '' } = props
  const className = cn(icon, argClassName)

  return createElement(
    dynamic<IconProps>(() => import(`assets/icon/${asset}.svg`), {
      loading: () => <Loader {...props} />,
    }),
    { ...props, className }
  )
}
