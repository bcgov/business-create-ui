import Axios from 'axios'
import { addAxiosInterceptors } from 'sbc-common-components/src/util/interceptors'

const axios = addAxiosInterceptors(Axios.create())

export default class AuthServices {
  /** The Auth API URL. */
  static authApiUrl = sessionStorage.getItem('AUTH_API_URL')

  /** Fetches current user's info. */
  static async fetchUserInfo (): Promise<any> {
    const url = `${this.authApiUrl}users/@me`
    return axios.get(url)
      .then(response => {
        if (response?.data) return response.data
        throw new Error('Invalid user info')
      })
  }

  /** Fetches specified org's info. */
  static async fetchOrgInfo (orgId: number): Promise<any> {
    const url = `${this.authApiUrl}orgs/${orgId}`
    return axios.get(url)
      .then(response => {
        if (response?.data) return response.data
        throw new Error('Invalid org info')
      })
  }
}
