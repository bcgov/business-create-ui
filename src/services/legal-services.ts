// Libraries
import { AxiosInstance as axios } from '@/utils'
import { StatusCodes } from 'http-status-codes'
import { DissolutionFilingIF, IncorporationFilingIF, NameRequestIF, RegistrationFilingIF } from '@/interfaces'
import { FilingTypes } from '@/enums'

/**
 * Class that provides integration with the Legal API.
 */
export default class LegalServices {
  /**
   * Fetches a draft filing using the temp reg number.
   * @param id the temp reg number
   * @returns a promise to return the formatted draft filing, else exception
   */
  static async fetchDraftApplication (id: string): Promise<IncorporationFilingIF | RegistrationFilingIF> {
    const url = `businesses/${id}/filings`
    return axios.get(url)
      .then(response => {
        let filing
        // if response is a list then look at only the first filing
        if (Array.isArray(response?.data?.filings)) filing = response.data.filings[0].filing
        // otherwise expect response to be a single filing
        if (response?.data?.filing) filing = response.data.filing
        const filingName = filing?.header?.name
        const filingId = +filing?.header?.filingId || 0

        if (!filing || !filingName || !filingId) {
          throw new Error('Invalid API response')
        }

        switch (filingName) {
          case FilingTypes.INCORPORATION_APPLICATION:
            return this.formatEmptyIncorporationApplication(filing)
          case FilingTypes.REGISTRATION:
            return this.formatEmptyRegistration(filing)
          default:
            throw new Error('Invalid filing name')
        }
      })
  }

  /**
   * Fetches a draft dissolution filing.
   * @param id the business id
   * @returns a promise to return the draft dissolution filing, else exception
   */
  static async fetchDraftDissolution (id: string): Promise<DissolutionFilingIF> {
    // get the draft filing from the tasks endpoint
    const url = `businesses/${id}/tasks`
    return axios.get(url)
      .then(response => {
        // look for dissolution task
        const filing = response?.data?.tasks
          // eslint-disable-next-line no-prototype-builtins
          ?.find(x => x.task.filing.hasOwnProperty(FilingTypes.VOLUNTARY_DISSOLUTION))?.task.filing
        const filingName = filing?.header?.name
        const filingId = +filing?.header?.filingId || 0

        if (!filing || filingName !== FilingTypes.VOLUNTARY_DISSOLUTION || !filingId) {
          throw new Error('Invalid API response')
        }

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
  static async updateFiling (
    id: string,
    filing: IncorporationFilingIF | DissolutionFilingIF,
    isDraft: boolean
  ): Promise<any> {
    if (!filing) throw new Error('updateFiling(), invalid filing')
    const filingId = +filing.header?.filingId || 0
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
  static async fetchNameRequest (nrNumber: string): Promise<NameRequestIF> {
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
        if (error?.response?.status === StatusCodes.NOT_FOUND) {
          return null // NR not found
        }
        throw error
      })
  }

  /**
   * Fetches parties list.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the parties from the response
   */
  static fetchParties (businessId: string): Promise<any> {
    // need to get the parties from the legal endpoint v2
    const url = `businesses/${businessId}/parties`

    return axios.get(url).then(response => {
      if (response?.data) return response.data
      throw new Error('Invalid response data')
    })
  }

  /**
   * Fetches addresses.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the addresses from the response
   */
  static fetchAddresses (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/addresses`
    return axios.get(url).then(response => {
      const data = response?.data
      if (!data) {
        throw new Error('Invalid API response')
      }
      return data
    }).catch(error => {
      if (error?.response?.status === StatusCodes.NOT_FOUND) {
        return null // Business or Address not found
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
  private static formatEmptyIncorporationApplication (filing: any): IncorporationFilingIF {
    const toReturn = filing
    if (toReturn.incorporationApplication) {
      // set offices
      if (!toReturn.incorporationApplication?.offices) {
        toReturn.incorporationApplication.offices = []
      }
      // set contact point
      if (!toReturn.incorporationApplication?.contactPoint) {
        toReturn.incorporationApplication.contactPoint = {
          email: '',
          phone: ''
        }
      }
      // set parties
      if (!toReturn.incorporationApplication?.parties) {
        toReturn.incorporationApplication.parties = []
      }
      // set share classes
      if (!toReturn.incorporationApplication?.shareClasses) {
        toReturn.incorporationApplication.shareClasses = []
      }
    }
    return toReturn
  }

  /**
   * Ensure consistent object structure for a registration application,
   * whether it contains a Name Request or not, and whether it is an initial
   * draft or it has been previously saved. Object merging does not
   * work very well otherwise due to nested properties.
   * @param filing the filing fetched from legal-api
   * @returns the filing in safe-empty state if applicable
   */
  private static formatEmptyRegistration (filing: any): RegistrationFilingIF {
    const toReturn = filing
    if (toReturn.registration) {
      // set offices
      if (!toReturn.registration?.offices) {
        toReturn.registration.offices = {}
      }
      // set contact point
      if (!toReturn.registration?.contactPoint) {
        toReturn.registration.contactPoint = {
          email: '',
          phone: ''
        }
      }
      // set parties
      if (!toReturn.registration?.parties) {
        toReturn.registration.parties = []
      }
    }
    return toReturn
  }

  /**
   * Fetches business info.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the info from the response
   */
  static async fetchBusinessInfo (businessId: string): Promise<any> {
    const url = `businesses/${businessId}`
    return axios.get(url)
  }
}
