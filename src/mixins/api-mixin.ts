// Libraries
import axios from '@/utils/axios-auth'
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

// Enums
import { EntityTypes } from '@/enums'

// Interfaces
import { StateModelIF, IncorporationFilingIF, NameRequestIF, ActionBindingIF } from '@/interfaces'

/**
 * Mixin that provides some useful common utilities.
 */
@Component
export default class ApiMixin extends Vue {
  // Global state
  @State stateModel!: StateModelIF
  @State nameRequestModel!: NameRequestIF

  @Action setNameRequestState!: ActionBindingIF

  /**
   * Method to save a draft or real filing.
   * @param isDraft Boolean indicating if this filing is a draft
   * @param filingId Optional filing id if this resuming an existing draft
   */
  async saveFiling (isDraft: boolean, filingId?: number | null): Promise<any> {
    // Construct Filing from Store based on entity type
    let filingData = await this.buildFiling()

    // If have a filing id, update an existing filing
    if (filingId && filingId > 0) {
      return this.axiosPut(isDraft, filingData, filingId)
    } else {
      return this.axiosPost(isDraft, filingData)
    }
  }

  /**
   * Method to make a simple axios Post request.
   * @param isDraft Boolean indicating if this filing is a draft
   * @param data The object body of the request.
   */
  axiosPost (isDraft: boolean, data: object) {
    // Base Url Identifier
    let url = this.nameRequestModel.nrNumber

    // Append URL appropriately if Draft
    if (isDraft) url += `?draft=true`

    axios.post(url, data).then(res => {
      if (!res) {
        throw new Error('invalid API response')
      }
      return res
    }).catch(error => {
      console.log(`Post Error: ${error}`)
    })
  }

  /**
   * Method to make a simple axios Put request.
   * @param isDraft Boolean indicating if this filing is a draft
   * @param data The object body of the request.
   * @param filingId Optional filing id if this resuming an existing draft
   */
  axiosPut (isDraft: boolean, data: object, filingId: number) {
    // Base Url Identifier
    let url = this.nameRequestModel.nrNumber

    // Append URL appropriately if Draft
    isDraft ? url += `/${filingId}?draft=true` : url += filingId

    axios.put(url, data).then(res => {
      if (!res) {
        throw new Error('invalid API response')
      }
      return res
    }).catch(error => {
      console.log(`Put Error: ${error}`)
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
      email: 'someEmail', // eg. this.stateModel.contactPoint.email
      date: this.stateModel.currentDate as string
    }

    // Incorporation Filing Body
    // TODO: Data to be captured from store. Hardcoded data is placeholder.
    let incorporation = {
      nameRequest: {
        legalType: this.nameRequestModel.entityType as string
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
        email: 'someEmail', // eg. this.stateModel.contactPoint.email,
        phone: 'somePhone' // eg. this.stateModel.contactPoint.phone
      }
    }

    // Include record offices for the filing if BCOMP
    // TODO: Data to be captured from store. Hardcoded data is placeholder.
    if (this.nameRequestModel.entityType === EntityTypes.BCOMP) {
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
