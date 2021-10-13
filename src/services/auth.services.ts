// Libraries
import axios from '@/utils/axios-auth'
import { AuthInformationIF, BusinessContactIF } from '@/interfaces'
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
   * Fetches the auth info of the current business.
   * @returns a promise to return the data
   */
  static async fetchBusinessInfo (businessId: string): Promise<AuthInformationIF> {
    if (!businessId) throw new Error('Invalid business id')

    const url = `entities/${businessId}`
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }

    return axios.get(url, config)
      .then(response => {
        if (response?.data) {
          return {
            contacts: response.data.contacts,
            folioNumber: response.data.folioNumber
          }
        }
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

  /**
   * Updates the businesses contact information.
   * @param businessId The business identifier.
   * @param contactInfo the contact information object.
   */
  static async updateContactInfo (businessId: string, contactInfo: BusinessContactIF): Promise<BusinessContactIF> {
    if (!businessId) throw new Error('Invalid business id')

    const data = {
      email: contactInfo.email,
      phone: contactInfo.phone,
      phoneExtension: contactInfo.extension
    }
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authUrl}entities/${businessId}/contacts`

    return axios.put(url, data).then(response => {
      if (response?.data) return response.data.contacts[0]
      throw new Error('Invalid response data')
    })
  }
}
