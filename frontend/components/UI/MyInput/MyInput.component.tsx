import { useCallback, useEffect, useRef, useState } from 'react'
import style from './MyInput.module.scss'

// Style
const { formGroup, formGroup__input, formGroup__label, Error } = style

// Utils
import cn from 'classnames'
import debounce from '../../../utils/browser/debounce'

// Interface
interface Props {
  label: string
  model: {
    value: string | number
    setValue: any
  }
  type: typeInput
  name: nameInput
  autoComplete?: autoCompleteInput
  isError?: boolean
  callback?: (term: string) => void
  debounce?: number
  className?: any
  dependencies?: any[]
}

type typeInput = 'password' | 'text' | 'email'
type nameInput =
  | 'username'
  | 'password'
  | 'new-password'
  | 'password-confirm'
  | 'email'
  | 'search'
type autoCompleteInput = 'username' | 'new-password' | 'password' | 'email'

// Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function MyInput(props: Props): JSX.Element {
  const debounceCallback = props.callback || (() => {})
  const debounceTime = props.debounce || 100

  const dFuncCallback = debounce<typeof debounceCallback>(
    debounceCallback,
    debounceTime
  )

  const dFunc = useCallback(
    (term: string) => {
      dFuncCallback(term)
    },
    [...(props?.dependencies || [])]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.model.setValue(e.target.value)
    dFunc(e.target.value)
  }

  return (
    <div className={formGroup}>
      <label className={formGroup__label}>{props.label}</label>
      <input
        className={cn(formGroup__input, { [Error]: props?.isError })}
        value={props.model.value}
        onChange={handleChange}
        type={props.type}
        name={props.name}
        autoComplete={props?.autoComplete}
      />
    </div>
  )
}
