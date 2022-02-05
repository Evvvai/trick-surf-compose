export enum Theme {
  default = 'default',
  light = 'light',
  dark = 'dark',
}

export interface GQLErrors {
  error: string
  message: string[]
  statusCode: number
}

export interface Maps {
  id: number
  name: string
  alternativeName: string | null
  src: string | null
  dateCreated: Date
}

export interface HostStatus {
  data: {
    s: {
      name: string
      map: string
      players: number
      playersmax: number
    }
  }
  online: number
  server_address: string
  server_dateblock: string
  server_daystoblock: number
  server_id: string
  server_location: string
  server_maxslots: number
  server_name: string
  server_type: string
  status: string
}
