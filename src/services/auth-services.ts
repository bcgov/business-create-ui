import { AxiosInstance as axios } from '@/utils'
import { StatusCodes } from 'http-status-codes'
import { AuthInformationIF, ContactPointIF } from '@/interfaces'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

setActivePinia(createPinia())
const store = useStore()

/**
 * Class that provides integration with the Auth API.
 */
export default class AuthServices {
  /**
   * Fetches authorizations of the specified entity.
   * @param id the temp or business identifier (eg, T1234567 or BC1219948)
   * @returns a promise to return the roles object
   */
  static async fetchAuthorizations (id: string): Promise<any> {
    if (!id) throw new Error('Invalid id')

    const authApiUrl = sessionStorage.getItem(SessionStorageKeys.AuthApiUrl)
    const url = `${authApiUrl}entities/${id}/authorizations`

    return axios.get(url).then(response => {
      if (response?.data?.roles) return response.data.roles
      throw new Error('Invalid response data')
    })
  }

  /**
   * Fetches auth info of the specified business.
   * @param businessId the business id
   * @returns a promise to return the data
   */
  static async fetchAuthInfo (businessId: string): Promise<AuthInformationIF> {
    if (!businessId) throw new Error('Invalid business id')

    const authApiUrl = sessionStorage.getItem(SessionStorageKeys.AuthApiUrl)
    const url = `${authApiUrl}entities/${businessId}`
    const config = { headers: { 'Account-Id': store.getAccountId } }

    return axios.get(url, config).then(response => {
      if (response?.data) {
        return {
          contacts: response.data.contacts
            // map phoneExtension -> extension in every element
            .map(contact => ({
              email: contact.email,
              phone: contact.phone,
              extension: contact.phoneExtension
            })),
          folioNumber: response.data.folioNumber
        }
      }
      throw new Error('Invalid response data')
    }).catch(error => {
      if (error?.response?.status === StatusCodes.FORBIDDEN) {
        return { status: 'FORBIDDEN' } as AuthInformationIF
      } else if (error?.response?.status === StatusCodes.NOT_FOUND) {
        return { status: 'NOT_FOUND' } as AuthInformationIF
      }
      throw error
    })
  }

  /**
   * Fetches user info of the current user.
   * @returns a promise to return the user info object
   */
  static async fetchUserInfo (): Promise<any> {
    const authApiUrl = sessionStorage.getItem(SessionStorageKeys.AuthApiUrl)
    const url = `${authApiUrl}users/@me`

    return axios.get(url).then(response => {
      if (response?.data) return response.data
      throw new Error('Invalid response data')
    })
  }

  /**
   * Fetches org info of specified organization.
   * @param orgId the org id (aka account id)
   * @returns a promise to return the org info object
   */
  static async fetchOrgInfo (orgId: number): Promise<any> {
    if (!orgId) throw new Error('Invalid org id')

    const authApiUrl = sessionStorage.getItem(SessionStorageKeys.AuthApiUrl)
    const url = `${authApiUrl}orgs/${orgId}`

    return axios.get(url)
      .then(response => {
        if (response?.data) return response.data
        throw new Error('Invalid response data')
      })
  }

  /**
   * Updates contact info of the specified business.
   * @param businessId the business id
   * @param contactInfo the contact point object
   * @returns a promise to return the updated contact point object
   */
  static async updateContactInfo (businessId: string, contactInfo: ContactPointIF): Promise<ContactPointIF> {
    if (!businessId) throw new Error('Invalid business id')
    if (!contactInfo) throw new Error('Invalid contact info')

    // map extension -> phoneExtension
    const data = {
      email: contactInfo.email,
      phone: contactInfo.phone,
      phoneExtension: contactInfo.extension
    }
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${authUrl}entities/${businessId}/contacts`

    return axios.put(url, data).then(response => {
      const contacts = response?.data?.contacts[0]
      if (!contacts) throw new Error('Invalid response data')
      // map phoneExtension -> extension
      return {
        email: contacts.email,
        phone: contacts.phone,
        extension: contacts.phoneExtension
      }
    })
  }
}
