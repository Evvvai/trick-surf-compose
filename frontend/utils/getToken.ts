// import { browserStorage } from './browser' // Obsolete
import { parseCookies } from 'nookies'

const getToken = (): string => {
  const token = parseCookies().token
  return token ? token : ''
}

export default getToken
