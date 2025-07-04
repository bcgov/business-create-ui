import Axios from 'axios'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

/**
 * This file exports an instance of Axios with some extra request headers.
 * This Axios instance is used by Staff Comments and maybe others...
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

const instance = Axios.create()

// add request interceptor
instance.interceptors.request.use(
  request => {
    // don't add headers (esp bearer token) for Minio requests
    if (request.url?.startsWith('https://minio')) {
      return request
    }

    // add these headers only if Vitest isn't running as it breaks some tests
    // TODO: check if this is still true
    if (import.meta.env.VITEST === undefined) {
      const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
      request.headers.common['Authorization'] = `Bearer ${kcToken}`
      request.headers.common['App-Name'] = import.meta.env.APP_NAME
      request.headers.common['Account-Id'] = getAccountId()
      request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_BUSINESS_API_KEY
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
