import axios from 'axios'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

/**
 * This file exports an instance of Axios with some extra request headers,
 * which is used by the various services (Legal, Auth, etc).
 */

// this is a function because a getter doesn't work reliably on app start
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

// create a new, independent instance of Axios
const instance = axios.create()

// add request interceptor
instance.interceptors.request.use(
  request => {
    // don't add headers (esp bearer token) for Minio requests
    if (request.url?.startsWith('https://minio')) {
      return request
    }

    // add these headers only if Vitest isn't running as it breaks some tests
    if (import.meta.env.VITEST === undefined) {
      const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)

      request.headers.common['Account-Id'] = getAccountId()
      request.headers.common['App-Name'] = import.meta.env.APP_NAME
      request.headers.common['Authorization'] = `Bearer ${kcToken}`

      // this default API key is used for Staff Comments, COLIN API and NAICS API
      // some services (eg, Auth, Pay, Search) override this
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
