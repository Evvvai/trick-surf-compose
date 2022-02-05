import React, { Fragment, useState, useEffect, useRef } from 'react'

// Styles
import styles from './TricksFiltersTriggersSelector.module.scss'

// Icons
import { MdClose } from 'react-icons/md'

// Components
import MyInput from '../../UI/MyInput/MyInput.component'
import TriggerImage from '../../UI/MyImage/TriggerImage/TriggerImage.component'

// Custom hooks
import { useTrick } from 'hooks/store/trick'
import { useTrickFilters } from '../../../hooks/store/trick/useTrickFilters'
import { useOutsideClick } from '../../../hooks/events/useOutsideClick'

// Utils
import cn from 'classnames'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { Trigger } from '@store'

interface Props {
  isSuggestOpen: any
  setIsSuggestOpen: any
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function TricksFiltersTriggersSelector({
  isSuggestOpen,
  setIsSuggestOpen,
}: Props): JSX.Element {
  const { triggers, tricks } = useTrick()
  const { filters, addTriggerToFilters } = useTrickFilters()

  const ref = useRef(null)
  const [term, setTerm] = useState<string>('')
  const [filteredTriggers, setFilteredTriggers] = useState<Trigger[]>([
    ...triggers,
  ])

  useOutsideClick([ref], () => setIsSuggestOpen(false))

  const handleFilteringTriggers = (term: string) =>
    setFilteredTriggers([...triggers.filter((x) => x.name.includes(term))])

  return (
    <div
      ref={ref}
      className={cn(styles.list, {
        [styles.listActive]: isSuggestOpen,
      })}
    >
      <div className={styles.listHeader}>
        <h1>Available triggers</h1>
        <hr />
      </div>
      <div className={styles.listInput}>
        <MyInput
          label={'write trigger name'}
          model={{ value: term, setValue: setTerm }}
          type={'text'}
          name={'search'}
          callback={(term: string) => handleFilteringTriggers(term)}
          debounce={350}
          dependencies={[tricks]}
        />
      </div>
      <div className={styles.listContent}>
        {filteredTriggers.map((triggerItem) => {
          const matches = match(triggerItem.name, term)
          const parts = parse(triggerItem.name, matches)

          return (
            <div
              onClick={() => addTriggerToFilters(triggerItem)}
              key={triggerItem.id}
              className={styles.listItem}
            >
              <div
                className={cn(styles.listItemInner, {
                  [styles.listItemInnerActive]: filters.triggers.find(
                    (trigger) => trigger.id === triggerItem.id
                  ),
                })}
              >
                <div className={styles.listItemText}>
                  {parts.map((part, key) => (
                    <span
                      key={key}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                        color: part.highlight
                          ? 'var(--color-highlight)'
                          : 'var(--color-text)',
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
                <TriggerImage photo={{ ...triggerItem }} />
              </div>
            </div>
          )
        })}
      </div>
      <MdClose
        onClick={() => setIsSuggestOpen(false)}
        className={styles.close}
      />
    </div>
  )
}
