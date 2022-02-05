// import { browserStorage } from './browser' // Obsolete
import { parseCookies } from 'nookies'

const getBearerToken = (): string => {
  const token = parseCookies().token
  return token ? `Bearer ${token}` : ''
}

export default getBearerToken
