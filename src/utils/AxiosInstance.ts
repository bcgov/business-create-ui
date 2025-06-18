import axios from 'axios'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

/**
 * This file exports an instance of Axios with some extra request headers.
 */

setActivePinia(createPinia())
const store = useStore()

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
      request.headers.common['Account-Id'] = store.getCurrentAccountId
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
