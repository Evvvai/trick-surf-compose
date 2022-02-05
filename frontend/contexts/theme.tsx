import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { browserStorage } from '../utils/browser'

export type ThemeProviderProps = {
  children: ReactNode
}

export type ThemeValue = {
  themeContext: ThemeVarious
  setThemeContext: Dispatch<SetStateAction<ThemeVarious>>
}

//** Alternative variant **/
// enum Theme {
//   system = 'system',
//   light = 'light',
//   dark = 'dark'
// }

export type ThemeVarious = 'system' | 'light' | 'dark' | 'blue'

export const ThemeContext = createContext<ThemeValue | null>(null)

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const theme: ThemeVarious = browserStorage.getItem('theme') || 'blue'
  const [themeContext, setThemeContext] = useState<ThemeVarious>(theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeContext)
    browserStorage.setItem('theme', themeContext)
  }, [themeContext])

  return (
    <ThemeContext.Provider value={{ themeContext, setThemeContext }}>
      {children}
    </ThemeContext.Provider>
  )
}
