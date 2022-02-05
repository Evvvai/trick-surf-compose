import { GraphQLClient } from 'graphql-request'
import getBearerToken from 'utils/getBearerToken'
import Cookies, { parseCookies } from 'nookies'

const clientQL = new GraphQLClient(
  (process.env.NEXT_BACKEND_URL || 'https://apishka.xyz:8080') + '/graphql',
  {
    // headers: { authorization: getJwtToken() },
    headers: { authorization: getBearerToken() },
  }
)

interface GraphQLHandle {
  ql: any
  variables?: any
}

// Simplify error handle
export const clientHandle = async (ql, variables) => {
  let data: any = null
  let errors: any = null

  try {
    data = await clientQL.request(ql, variables)
  } catch (error) {
    errors = error
  }

  if (data && !errors) {
    data = data[Object.keys(data)[0]]
  } else errors = errors?.response?.errors[0]?.extensions?.response

  return [data, errors]
}

// Simplify error handle
export const serverHandle = async (ctx, ql, variables) => {
  const cookies = ctx ? Cookies.get(ctx) : parseCookies()
  const token = cookies.token

  clientQL.setHeaders({
    authorization: 'Bearer ' + token,
  })

  let data: any = null
  let errors: any = null

  try {
    data = await clientQL.request(ql, variables)
  } catch (error) {
    errors = error
  }

  if (data && !errors) data = data[Object.keys(data)[0]]

  return [data, errors?.response?.errors[0].extensions.response || null]
}

export default clientQL
