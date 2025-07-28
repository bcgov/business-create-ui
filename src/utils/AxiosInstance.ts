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

const authApiGwUrl = sessionStorage.getItem('AUTH_API_GW_URL')
const registriesSearchApiUrl = sessionStorage.getItem('REGISTRIES_SEARCH_API_URL')
const payApiGwUrl = sessionStorage.getItem('PAY_API_GW_URL')

// create a new, independent instance of Axios
const instance = axios.create()

// add request interceptor
instance.interceptors.request.use(
  request => {
    // don't add headers for Minio requests
    if (request.url?.startsWith('https://minio')) {
      return request
    }

    // add headers only if Vitest isn't running as it breaks some tests
    if (import.meta.env.VITEST === undefined) {
      // add headers common to all APIs
      const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
      request.headers.common['Authorization'] = `Bearer ${kcToken}`
      request.headers.common['App-Name'] = import.meta.env.APP_NAME
      request.headers.common['Account-Id'] = getAccountId()

      // add headers specific to various APIs
      switch (true) {
        case request.url?.startsWith(authApiGwUrl):
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_AUTH_API_KEY
          break

        case request.url?.startsWith(registriesSearchApiUrl):
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_KEY
          break

        case request.url?.startsWith(payApiGwUrl):
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_PAY_API_KEY
          break

        default:
          // used by Business API GW, COLIN API, NAICS API and StaffComments
          request.headers.common['X-Apikey'] = import.meta.env.VUE_APP_BUSINESS_API_KEY
          break
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
