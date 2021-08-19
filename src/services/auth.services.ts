// Libraries
import axios from '@/utils/axios-auth'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

/**
 * Class that provides integration with the Auth API.
 */
export default class AuthServices {
  /**
   * Fetches authorizations.
   * @param iaNumber the temporary registration id for this IA (eg, T1234567)
   * @returns a promise to return the roles object
   */
  static async fetchNrAuthorizations (iaNumber: string): Promise<any> {
    if (!iaNumber) throw new Error('Invalid parameter \'iaNumber\'')
    const authApiUrl = sessionStorage.getItem(SessionStorageKeys.AuthApiUrl)
    const url = `${authApiUrl}entities/${iaNumber}/authorizations`
    return axios.get(url)
      .then(response => {
        if (response?.data?.roles) return response.data.roles
        throw new Error('Invalid response data ')
      })
  }

  /**
   * Fetches current user's info.
   * @returns a promise to return the user info object
   */
  static async fetchUserInfo (): Promise<any> {
    const authApiUrl = sessionStorage.getItem(SessionStorageKeys.AuthApiUrl)
    const url = `${authApiUrl}users/@me`
    return axios.get(url)
      .then(response => {
        if (response?.data) return response.data
        throw new Error('Invalid response data ')
      })
  }

  /**
   * Fetches specified org's info.
   * @param orgId the id of the current Org
   * @returns a promise to return the org info object
   */
  static async fetchOrgInfo (orgId: number): Promise<any> {
    const authApiUrl = sessionStorage.getItem(SessionStorageKeys.AuthApiUrl)
    const url = `${authApiUrl}orgs/${orgId}`
    return axios.get(url)
      .then(response => {
        if (response?.data) return response.data
        throw new Error('Invalid response data')
      })
  }
}
