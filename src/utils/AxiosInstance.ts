import axios from 'axios'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

/**
 * This file exports an instance of Axios with a bearer token added to the request
 * headers.
 */

const instance = axios.create()

instance.interceptors.request.use(
  request => {
    // don't add bearer token for Minio requests
    if (request.url?.startsWith('https://minio') || request.url.startsWith(sessionStorage.getItem('DRS_API_URL'))) {
      return request
    }

    const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
    request.headers.common['Authorization'] = `Bearer ${kcToken}`
    return request
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export { instance as AxiosInstance }
