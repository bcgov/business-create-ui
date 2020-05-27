// Libraries
import axios from '@/utils/axios-auth'
import { Component, Vue } from 'vue-property-decorator'
import { State, Action, Getter } from 'vuex-class'
import { NOT_FOUND } from 'http-status-codes'

// Interfaces
import { StateModelIF, ActionBindingIF, GetterIF, IncorporationFilingIF } from '@/interfaces'

/**
 * Mixin that provides the integration with the legal api.
 */
@Component({})
export default class LegalApiMixin extends Vue {
  readonly NAME_REQUEST = 'nameRequest'
  readonly INCORPORATION_APPLICATION = 'incorporationApplication'

  // Global state
  @State stateModel!: StateModelIF

  // Global Getters
  @Getter isTypeBcomp!: GetterIF
  @Getter getFilingId!: number
  @Getter getBusinessIdentifier!: string

  // Store Actions
  @Action setNameRequestState!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF

  /**
   * Saves a filing.
   * @param isDraft boolean indicating whether to complete filing
   * @param filing filing body to be saved
   * @returns a promise to return the saved filing
   */
  async saveFiling (filing: IncorporationFilingIF, isDraft: boolean): Promise<any> {
    if (!filing) throw new Error('Invalid parameter \'filing\'')
    if (typeof isDraft !== 'boolean') throw new Error('Invalid parameter \'isDraft\'')

    // if we have a Filing ID, update an existing filing
    if (this.getFilingId && this.getFilingId > 0) {
      return this.updateFiling(filing, isDraft)
    } else {
      // otherwise create a new filing
      return this.createFiling(filing, isDraft)
    }
  }

  /**
   * Fetches a draft filing.
   * @returns a promise to return the draft filing, or null if not found
   */
  async fetchDraft (): Promise<any> {
    // get the draft filing from the tasks endpoint
    const url = `businesses/${this.getBusinessIdentifier}/filings`
    return axios.get(url)
      .then(response => {
        // look at only the first task
        const todoName = response?.data?.filing?.header?.name
        const filing = response?.data?.filing
        const filingName = filing?.header?.name
        const filingId = +filing?.header?.filingId // may be NaN

        if (filingName !== this.INCORPORATION_APPLICATION || !filingId) {
          throw new Error('Invalid API response')
        }
        // save Filing ID from the header
        this.setFilingId(filingId)
        return filing
      })
      .catch((error) => {
        if (error?.response?.status === NOT_FOUND) {
          return null // NR not found
        }
        throw error
      })
  }

  /**
   * Creates a new filing.
   * @param data the object body of the request
   * @param isDraft boolean indicating whether to save draft or complete filing
   * @returns a promise to return the created filing
   */
  private createFiling (data: object, isDraft: boolean): Promise<any> {
    // post new filing to businesses endpoint
    let url = 'businesses'
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.post(url, data).then(response => {
      // save Filing ID from the header
      const filing = response?.data?.filing
      const filingId = +filing?.header?.filingId
      if (!filing || !filingId) {
        throw new Error('Invalid API response')
      }
      this.setFilingId(filingId)
      return filing
    })
  }

  /**
   * Updates an existing filing.
   * @param data the object body of the request
   * @param isDraft boolean indicating whether to save draft or complete filing
   * @returns a promise to return the updated filing
   */
  private updateFiling (filing: IncorporationFilingIF, isDraft: boolean): Promise<any> {
    // put updated filing to filings endpoint
    let url = `businesses/${this.getBusinessIdentifier}/filings/${this.getFilingId}`
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
  }

  /**
   * Fetches authorizations.
   * @param nrNumber the name request number (eg, NR 1234567)
   * @returns a promise to return the authorizations object
   */
  getNrAuthorizations (nrNumber: string): Promise<any> {
    if (!nrNumber) throw new Error('Invalid parameter \'nrNumber\'')

    const url = `${nrNumber}/authorizations`
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = {
      baseURL: authUrl + 'entities/'
    }
    return axios.get(url, config)
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
}
