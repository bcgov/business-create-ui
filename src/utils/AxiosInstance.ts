import axios from 'axios'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

/**
 * This file exports an instance of Axios with some extra request headers.
 */

function getAccountId (): string {
  // if we can't get account id from ACCOUNT_ID
  // then try to get it from CURRENT_ACCOUNT
  let accountId = sessionStorage.getItem('ACCOUNT_ID')
  if (!accountId) {
    const currentAccount = sessionStorage.getItem('CURRENT_ACCOUNT')
    accountId = JSON.parse(currentAccount)?.id
  }
  return accountId
}

const instance = axios.create()

// add request interceptor
instance.interceptors.request.use(
  request => {
    // don't add bearer token for Minio requests
    if (request.url?.startsWith('https://minio')) {
      return request
    }

    const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
    request.headers.common['Authorization'] = `Bearer ${kcToken}`
    request.headers.common['App-Name'] = import.meta.env.APP_NAME

    // add these headers only if Vitest isn't running as it breaks some tests
    if (import.meta.env.VITEST === undefined) {
      request.headers.common['Account-Id'] = getAccountId()
      switch (true) {
        case request.url.includes(sessionStorage.getItem('AUTH_API_URL')):
          console.log('Auth API URL') // TODO: Remove this log after debugging not required
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_AUTH_API_KEY
          break
        case request.url.includes(sessionStorage.getItem('AUTH_WEB_URL')):
          console.log('Auth web URL') // TODO: Remove this log after debugging not required
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_AUTH_API_KEY
          break
        case request.url.includes(sessionStorage.getItem('PAY_API_URL')):
          console.log('Pay API URL') // TODO: Remove this log after debugging not required
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_PAY_API_KEY
          break
        case request.url.includes(sessionStorage.getItem('REGISTRIES_SEARCH_API_URL')):
          console.log('Search API URL') // TODO: Remove this log after debugging not required
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_KEY
          break
        case request.url.includes(axios.defaults.baseURL):
          console.log('default API URL', axios.defaults.baseURL) // TODO: Remove this log after debugging not required
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_BUSINESS_API_KEY
          break
        default: // TODO: How to handle other request urls such as permissions/businesses etc.
          console.error('Unknown API URL', request.url) // TODO: Remove this log after debugging not required
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_BUSINESS_API_KEY

          // throw new Error(`Unknown API URL: ${request.url}`)
      }
    }

    return request
  },
  error => Promise.reject(error)
)

// add response interceptor
instance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export { instance as AxiosInstance }
