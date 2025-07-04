import Axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { AuthInformationIF, ContactPointIF } from '@/interfaces'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

const axios = Axios.create()
setActivePinia(createPinia())
const store = useStore()

/**
 * Class that provides integration with the Auth API.
 */
export default class AuthServices {
  /** The Auth API Gateway URL. */
  static get authApiGwUrl (): string {
    return sessionStorage.getItem('AUTH_API_GW_URL')
  }

  /** The Axios config (request headers). */
  static get config (): any {
    const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
    const authApiKey = import.meta.env.VUE_APP_AUTH_API_KEY
    return {
      headers: {
        'Account-Id': store.getAccountId,
        'App-Name': import.meta.env.APP_NAME,
        'Authorization': `Bearer ${kcToken}`,
        'X-Apikey': authApiKey
      }
    }
  }

  /**
   * Fetches auth info of the specified business.
   * @param businessId the business id
   * @returns a promise to return the data
   */
  static async fetchAuthInfo (businessId: string): Promise<AuthInformationIF> {
    if (!businessId) throw new Error('Invalid business id')

    const url = `${this.authApiGwUrl}entities/${businessId}`

    return axios.get(url, this.config)
      .then(response => {
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
    const url = `${this.authApiGwUrl}users/@me`

    return axios.get(url, this.config)
      .then(response => {
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

    const url = `${this.authApiGwUrl}orgs/${orgId}`

    return axios.get(url, this.config)
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

    const data = {
      email: contactInfo.email,
      phone: contactInfo.phone,
      // map extension -> phoneExtension
      phoneExtension: contactInfo.extension
    }
    const url = `${this.authApiGwUrl}entities/${businessId}/contacts`

    return axios.put(url, data, this.config)
      .then(response => {
        const contacts = response?.data?.contacts[0]
        if (!contacts) throw new Error('Invalid response data')
        return {
          email: contacts.email,
          phone: contacts.phone,
          // map phoneExtension -> extension
          extension: contacts.phoneExtension
        }
      })
  }
}
