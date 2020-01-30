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
   * @param filing Filing body to be saved.
   */
  async saveFiling (filing: IncorporationFilingIF): Promise<any> {
    try {
      let filingId = this.getFilingId

      // If have a filing id, update an existing filing
      if (filingId && filingId > 0) {
        await this.updateFiling(filing)
      } else {
        // Set the filingId to store
        const response = await this.createFiling(filing)

        // Assign a filing Id from the response to the state
        if (response && response.header && response.header.filingId) {
          this.setFilingId(response.header.filingId)
        } else {
          throw new Error('invalid API response')
        }
      }
    } catch (e) {
      if (e) {
        // TODO:  Trigger some error dialog. Will catch any errors from the Api calls
      }
    }
  }

  /**
   * Method to complete a filing.
   * @param filing The filing body to be saved and submitted.
   */
  async completeFiling (filing: IncorporationFilingIF): Promise<any> {
    try {
      await this.saveFiling(filing)
      let filingId = this.getFilingId

      if (filingId) {
        // Assign the url business identifier
        let url = `${this.getBusinessIdentifier}/filings/${filingId}`

        return axios.put(url, filing).then(res => {
          if (!res) {
            throw new Error('invalid API response')
          }
        })
      }
    } catch (e) {
      if (e) {
        // TODO:  Trigger some error dialog. Will catch any errors from the Api calls
      }
    }
  }

  /**
   * Method to get a filing in progress.
   * Future: We can use this method to parse and sort the data into store.
   * @param filingId filing id if this resuming an existing draft.
   */
  async fetchDraft (filingId: number): Promise<any> {
    try {
      const filing = await this.getFiling(filingId)
      // TODO: Parse the filing into store. Either here or using another method.
    } catch (e) {
      if (e) {
        // TODO:  Trigger some error dialog. Will catch any errors from the Api calls
      }
    }
  }

  /**
   * Method to make a simple axios Post request.
   * @param data The object body of the request.
   */
  private createFiling (data: object): Promise<any> {
    return axios.post('', data).then(res => {
      if (!res) {
        throw new Error('invalid API response')
      }
    })
  }

  /**
   * Method to make a simple axios Put request.
   * @param data The object body of the request.
   * @param filingId Optional filing id if this resuming an existing draft.
   */
  private updateFiling (data: object): Promise<any> {
    // Assign the url business identifier
    let url = `${this.getBusinessIdentifier}`

    return axios.put(url, data).then(res => {
      if (!res) {
        throw new Error('invalid API response')
      }
    })
  }

  /**
   * Method to make a simple axios Get request.
   * @param filingId Optional filing id if this resuming an existing draft.
   */
  private getFiling (filingId: number): Promise<any> {
    // Assign the url business identifier
    let url = `${this.getBusinessIdentifier}/filings/${filingId}`

    return axios.get(url).then(res => {
      if (!res) {
        throw new Error('invalid API response')
      }
    })
  }
}
