// Libraries
import axios from '@/utils/axios-auth'
import { Component, Vue } from 'vue-property-decorator'
import { State, Action, Getter } from 'vuex-class'

// Interfaces
import { StateModelIF, IncorporationFilingIF, ActionBindingIF, GetterIF } from '@/interfaces'

/**
 * Mixin that provides the integration with the legal api.
 */
@Component
export default class ApiMixin extends Vue {
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
      let filingData = await this.buildFiling()
      let filingId = this.getFilingId

      // If have a filing id, update an existing filing
      if (filingId && filingId > 0) {
        this.axiosPut(isDraft, filingData, filingId)
      } else {
        // Set the filingId to store
        const response = await this.axiosPost(isDraft, filingData)
        if (response && response.header) {
          this.setFilingId(response.header.filingId)
        }
      }
    } catch (e) {
      console.log(e)
      if (e) {
        // Trigger some error dialog
      }
    }
  }

  /**
   * Method to make a simple axios Post request.
   * @param isDraft Boolean indicating if this filing is a draft
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
   *  A method to retrieve the data from store and structure the Json
   *  This template is built off the current iteration of the schema.
   *  Subject to change.
   */
  buildFiling (): IncorporationFilingIF {
    // Filing Header
    // TODO: Data to be captured from store. Hardcoded data is placeholder.
    let header = {
      name: 'incorporationApplication',
      certifiedBy: this.stateModel.certifyState.certifiedBy as string,
      email: this.stateModel.defineCompanyStep.businessContact.email,
      date: this.stateModel.currentDate as string
    }

    // Incorporation Filing Body
    // TODO: Data to be captured from store. Hardcoded data is placeholder.
    let incorporation = {
      nameRequest: {
        legalType: this.stateModel.defineCompanyStep.nameRequest.entityType as string
      },
      offices: {
        registeredOffice: {
          deliveryAddress: {
            addressCity: 'someCity',
            addressCountry: 'someCountry',
            addressRegion: 'someRegion',
            postalCode: 'somePostalCode',
            streetAddress: 'someStreet'
          },
          mailingAddress: {
            addressCity: 'someCity',
            addressCountry: 'someCountry',
            addressRegion: 'someRegion',
            postalCode: 'somePostalCode',
            streetAddress: 'someStreet'
          }
        }
      },
      contactPoint: {
        email: this.stateModel.defineCompanyStep.businessContact.email,
        phone: this.stateModel.defineCompanyStep.businessContact.phone
      }
    }

    // Include record offices for the filing if BCOMP
    // TODO: Data to be captured from store. Hardcoded data is placeholder.
    if (this.isTypeBcomp) {
      Object.assign(incorporation.offices, {
        recordsOffice: {
          deliveryAddress: {
            addressCity: 'someCity',
            addressCountry: 'someCountry',
            addressRegion: 'someRegion',
            postalCode: 'somePostalCode',
            streetAddress: 'someStreet'
          },
          mailingAddress: {
            addressCity: 'someCity',
            addressCountry: 'someCountry',
            addressRegion: 'someRegion',
            postalCode: 'somePostalCode',
            streetAddress: 'someStreet'
          }
        }
      })
    }
    return { header, incorporation }
  }
}
