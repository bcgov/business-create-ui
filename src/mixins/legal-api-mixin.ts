// Libraries
import axios from '@/utils/axios-auth'
import { Component, Vue } from 'vue-property-decorator'
import { State, Action, Getter } from 'vuex-class'

// Interfaces
import { StateModelIF, ActionBindingIF, GetterIF, IncorporationFilingIF } from '@/interfaces'

/**
 * Mixin that provides the integration with the legal api.
 */
@Component
export default class LegalApiMixin extends Vue {
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
   * Method to save a filing.
   * @param isDraft Boolean indicating whether to complete filing.
   * @param filing Filing body to be saved.
   */
  async saveFiling (filing: IncorporationFilingIF, isDraft: boolean): Promise<any> {
    let filingId = this.getFilingId
    let filingComplete
    // If have a filing id, update an existing filing
    if (filingId && filingId > 0) {
      filingComplete = await this.updateFiling(filing, isDraft)
    } else {
      // Set the filingId to store
      filingComplete = await this.createFiling(filing, isDraft)
    }

    if (!isDraft && filingComplete) {
      const paymentToken = filingComplete.header.paymentToken
      const businessUrl: string = sessionStorage.getItem('BUSINESSES_URL') || ''
      const returnURL = encodeURIComponent(businessUrl) // Future: Redirect to Dashboard
      const authUrl = sessionStorage.getItem('AUTH_URL')
      const payURL = authUrl + 'makepayment/' + paymentToken + '/' + returnURL

      // assume Pay URL is always reachable
      // otherwise, user will have to retry payment later
      window.location.assign(payURL)
    }
  }

  /**
   * Method to get a filing in progress.
   * Future: We can use this method to parse and sort the data into store.
   */
  async fetchDraft (): Promise<any> {
    try {
      // Retrieve the Draft filingId from this identifiers tasks
      return await this.getDraftFiling()
    } catch (e) {
      // TODO: Throw a flag to the ui from here, if we want to trigger error handling in ui
    }
  }

  /**
   * Method to make a simple axios Post request.
   * @param data The object body of the request.
   * @param isDraft Boolean indicating whether to complete filing.
   */
  private createFiling (data: object, isDraft: boolean): Promise<any> {
    let url = 'businesses'
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.post(url, data).then(res => {
      // Assign a filing Id from the response to the state
      if (res && res.data && res.data.filing && res.data.filing.header && res.data.filing.header.filingId) {
        this.setFilingId(res.data.filing.header.filingId)
      } else {
        throw new Error('invalid API response')
      }
    })
  }

  /**
   * Method to make a simple axios Put request.
   * @param data The object body of the request.
   * @param isDraft Boolean indicating whether to complete filing.
   */
  private updateFiling (filing: IncorporationFilingIF, isDraft: boolean): Promise<any> {
    let filingId = this.getFilingId

    // Assign the url business identifier
    let url = `businesses/${this.getBusinessIdentifier}/filings/${filingId}`

    // Complete a filing if not draft
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.put(url, filing).then(res => {
      if (!res) {
        throw new Error('invalid API response')
      }
    })
  }

  /**
   * Method to make a simple axios Get request on the draft filings.
   */
  private getDraftFiling (): Promise<any> {
    // Assign the url business identifier
    let url = `businesses/${this.getBusinessIdentifier}/tasks`

    return axios.get(url).then(res => {
      if (res.data.tasks) {
        this.setFilingId(res.data.tasks[0].task.filing.header.filingId)
        return res.data.tasks[0].task.filing
      } else {
        throw new Error('invalid API response')
      }
    })
  }

  /**
   * Fetch Authorizations by NR number
   * @param nr the name request number (e.g NR 1234567)
   */
  getNRAuthorizations (nrNumber: string): Promise<any> {
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const url = `${nrNumber}/authorizations`
    const config = {
      baseURL: authUrl + 'entities/'
    }
    return axios.get(url, config)
  }

  /**
   * Method to query name request results.
   * @param nrNumber the name request number. eg: NR 123456789
   */
  async queryNameRequest (nrNumber: string): Promise<any> {
    if (nrNumber) {
      let url = `nameRequests/${nrNumber}`

      return axios.get(url).then(res => {
        if (!res) {
          throw new Error('invalid API response')
        }
        return res.data
      }).catch(err => {
        if (err && !err.response) {
          return undefined
        }
      })
    } else {
      throw new Error('NR number is required.')
    }
  }
}
