// Libraries
import axios from '@/utils/axios-auth'
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { State, Action, Getter } from 'vuex-class'

// Interfaces
import { StateModelIF, ActionBindingIF, GetterIF } from '@/interfaces'

// Utils
import { FilingTemplateMixin } from '@/mixins'

/**
 * Mixin that provides the integration with the legal api.
 */
@Component
export default class ApiMixin extends Mixins(FilingTemplateMixin) {
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
   * Method to save a draft or real filing.
   * @param isDraft Boolean indicating if this filing is a draft
   * @param filingId Optional filing id if this resuming an existing draft
   */
  async saveFiling (isDraft: boolean): Promise<any> {
    try {
      // Construct Filing from Store based on entity type
      const filingData = await this.buildfiling()
      let filingId = this.getFilingId
      console.log(filingData)
      // If have a filing id, update an existing filing
      if (filingId && filingId > 0) {
        this.axiosPut(isDraft, filingData, filingId)
      } else {
        // Set the filingId to store
        const response = await this.axiosPost(isDraft, filingData)
        // Assign a filing Id from the response to the state
        if (response && response.header) {
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
   * Method to get a filing in progress.
   * Future: We can use this method to parse and sort the data into store.
   * @param filingId filing id if this resuming an existing draft
   */
  async getFiling (filingId: number): Promise<any> {
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
   * @param isDraft Boolean indicating if this filing is a draft.
   * @param data The object body of the request.
   */
  axiosPost (isDraft: boolean, data: object): Promise<any> {
    // Assign the url business identifier
    let url = this.getBusinessIdentifier

    // Append URL appropriately if Draft
    if (isDraft) url += `?draft=true`

    return axios.post(url, data).then(res => {
      if (!res) {
        throw new Error('invalid API response')
      }
    })
  }

  /**
   * Method to make a simple axios Put request.
   * @param isDraft Boolean indicating if this filing is a draft
   * @param data The object body of the request.
   * @param filingId Optional filing id if this resuming an existing draft
   */
  axiosPut (isDraft: boolean, data: object, filingId: number): Promise<any> {
    // Assign the url business identifier
    let url = `${this.getBusinessIdentifier}/filings/`

    // Append URL appropriately if Draft
    isDraft ? url += `${filingId}?draft=true` : url += filingId

    return axios.put(url, data).then(res => {
      if (!res) {
        throw new Error('invalid API response')
      }
    })
  }

  /**
   * Method to make a simple axios Get request.
   * @param filingId Optional filing id if this resuming an existing draft
   */
  axiosGet (filingId: number): Promise<any> {
    // Assign the url business identifier
    let url = `${this.getBusinessIdentifier}/filings/${filingId}`

    return axios.get(url).then(res => {
      if (!res) {
        throw new Error('invalid API response')
      }
    })
  }
}
