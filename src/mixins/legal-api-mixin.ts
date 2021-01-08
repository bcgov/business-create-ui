// Libraries
import axios from '@/utils/axios-auth'
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { NOT_FOUND } from 'http-status-codes'

// Interfaces
import { ActionBindingIF, IncorporationFilingIF } from '@/interfaces'

/**
 * Mixin that provides integration with the Legal API.
 */
@Component({})
export default class LegalApiMixin extends Vue {
  readonly INCORPORATION_APPLICATION = 'incorporationApplication'

  // Global Getters
  @Getter getFilingId!: number
  @Getter getTempId!: string

  // Store Actions
  @Action setFilingId!: ActionBindingIF

  /**
   * Fetches a draft filing.
   * @returns a promise to return the draft filing, or null if not found
   */
  async fetchDraft (): Promise<any> {
    // get the draft filing from the tasks endpoint
    const url = `businesses/${this.getTempId}/filings`
    return axios.get(url)
      .then(response => {
        // look at only the first task
        const filing = response?.data?.filing
        const filingName = filing?.header?.name
        const filingId = +filing?.header?.filingId || 0

        if (!filing || filingName !== this.INCORPORATION_APPLICATION || !filingId) {
          throw new Error('Invalid API response')
        }
        // save Filing ID from the header
        this.setFilingId(filingId)
        return this.formatEmptyFiling(filing)
      })
      .catch((error) => {
        if (error?.response?.status === NOT_FOUND) {
          return null // IA not found
        }
        throw error
      })
  }

  /**
   * Updates an existing filing.
   * @param filing the object body of the request
   * @param isDraft boolean indicating whether to save draft or complete the filing
   * @returns a promise to return the updated filing
   */
  async updateFiling (filing: IncorporationFilingIF, isDraft: boolean): Promise<any> {
    if (!filing) throw new Error('updateFiling(), invalid filing')
    const filingId = this.getFilingId
    if (!filingId) throw new Error('updateFiling(), invalid filing id')

    // put updated filing to filings endpoint
    let url = `businesses/${this.getTempId}/filings/${filingId}`
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.put(url, filing).then(response => {
      const filing = response?.data?.filing
      const filingId = +filing?.header?.filingId
      if (!filing || !filingId) {
        throw new Error('Invalid API response')
      }
      return filing
    })
    // NB: for error handling, see "save-error-event"
  }

  /**
   * Fetches authorizations.
   * @param iaNumber the temporary registration id for this IA (eg, T1234567)
   * @returns a promise to return the authorizations object
   */
  getNrAuthorizations (iaNumber: string): Promise<any> {
    if (!iaNumber) throw new Error('Invalid parameter \'nrNumber\'')

    const url = `entities/${iaNumber}/authorizations`
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }
    return axios.get(url, config)
  }

  /**
   * Fetches current user data.
   * @returns a promise to return the user data
   */
  getCurrentUser (): Promise<any> {
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }
    return axios.get('users/@me', config)
  }

  /**
   * Fetches name request data.
   * @param nrNumber the name request number (eg, NR 1234567)
   * @returns a promise to return the NR data, or null if not found
   */
  fetchNameRequest (nrNumber: string): Promise<any> {
    if (!nrNumber) throw new Error('Invalid parameter \'nrNumber\'')

    const url = `nameRequests/${nrNumber}`
    return axios.get(url)
      .then(response => {
        const data = response?.data
        if (!data) {
          throw new Error('Invalid API response')
        }
        return data
      }).catch(error => {
        if (error?.response?.status === NOT_FOUND) {
          return null // NR not found
        }
        throw error
      })
  }

  /**
    * Ensure consisent object structure for an incorporation application
    * whether it contains a Name Request or not, and whether it is an initial
    * draft or it has been previously saved. Object merging does not
    * work very well otherwise (due to nested properties)
    * @param filing The filing fetched from legal-api
    * @returns the filing in safe-empty state if applicable
  */
  formatEmptyFiling (filing: any): IncorporationFilingIF {
    let toReturn = filing
    if (toReturn.incorporationApplication) {
      if (!toReturn.incorporationApplication?.offices) {
        toReturn.incorporationApplication.offices = []
      }
      if (!toReturn.incorporationApplication?.contactPoint) {
        toReturn.incorporationApplication.contactPoint = {
          email: '',
          phone: '',
          extension: ''
        }
      }
      if (!toReturn.incorporationApplication?.parties) {
        toReturn.incorporationApplication.parties = []
      }
      if (!toReturn.incorporationApplication?.shareClasses) {
        toReturn.incorporationApplication.shareClasses = []
      }
    }
    return toReturn
  }
}
