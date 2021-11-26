// Libraries
import { axios } from '@/utils'
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { NOT_FOUND } from 'http-status-codes'

// Interfaces
import { ActionBindingIF, DissolutionFilingIF, IncorporationFilingIF } from '@/interfaces'
import { FilingTypes } from '@/enums'

/**
 * Mixin that provides integration with the Legal API.
 */
@Component({})
export default class LegalApiMixin extends Vue {
  @Getter getBusinessId!: string
  @Getter getFilingId!: number
  @Getter getTempId!: string

  @Action setFilingId!: ActionBindingIF

  /**
   * Fetches the draft IA filing.
   * This is a unique request using the temp reg number.
   * This assumes a single filing is returned.
   * @returns a promise to return the draft filing, or null if not found
   */
  async fetchDraftIA (): Promise<any> {
    const url = `businesses/${this.getTempId}/filings`
    return axios.get(url)
      .then(response => {
        // look at only the first filing
        const filing = response?.data?.filing
        const filingName = filing?.header?.name
        const filingId = +filing?.header?.filingId || 0

        if (!filing || filingName !== FilingTypes.INCORPORATION_APPLICATION || !filingId) {
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
   * Fetches a draft dissolution filing.
   * @returns a promise to return the draft filing, or null if not found
   */
  async fetchDraftDissolution (): Promise<DissolutionFilingIF> {
    // get the draft filing from the tasks endpoint
    const url = `businesses/${this.getBusinessId}/tasks`
    return axios.get(url)
      .then(response => {
        const { filing } = response?.data?.tasks?.find(x => x.task.filing.hasOwnProperty(FilingTypes.DISSOLUTION))?.task
        const filingName = filing?.header?.name
        const filingId = +filing?.header?.filingId || 0

        if (!filing || filingName !== FilingTypes.DISSOLUTION || !filingId) {
          throw new Error('Invalid API response')
        }

        // save Filing ID from the header
        this.setFilingId(filingId)
        return filing
      })
  }

  /**
   * Updates an existing filing.
   * @param id The entity identifier or temp registration number
   * @param filing the object body of the request
   * @param isDraft boolean indicating whether to save draft or complete the filing
   * @returns a promise to return the updated filing
   */
  async updateFiling (id: string, filing: IncorporationFilingIF | DissolutionFilingIF, isDraft: boolean): Promise<any> {
    if (!filing) throw new Error('updateFiling(), invalid filing')
    const filingId = this.getFilingId
    if (!filingId) throw new Error('updateFiling(), invalid filing id')

    // put updated filing to filings endpoint
    let url = `businesses/${id}/filings/${filingId}`
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.put(url, { filing }).then(response => {
      const filing = response?.data?.filing
      const filingId = +filing?.header?.filingId || 0

      if (!filing || !filingId) {
        throw new Error('Invalid API response')
      }

      return filing
    })
    // NB: for error handling, see "save-error-event"
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
    * Ensure consistent object structure for an incorporation application,
    * whether it contains a Name Request or not, and whether it is an initial
    * draft or it has been previously saved. Object merging does not
    * work very well otherwise due to nested properties.
    * @param filing the filing fetched from legal-api
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
          phone: ''
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
