import { AxiosInstance as axios } from '@/utils'
import { StatusCodes } from 'http-status-codes'
import { AmalgamationFilingIF, BusinessIF, DissolutionFilingIF, IncorporationFilingIF, NameRequestIF,
  RegistrationFilingIF, RestorationFilingIF } from '@/interfaces'
import { FilingTypes } from '@/enums'

/**
 * Class that provides integration with the Legal API.
 */
export default class LegalServices {
  /**
   * Fetches filings list.
   * @param businessId the business identifier (aka entity inc no)
   * @returns the filings list
   */
  static async fetchFilings (businessId: string): Promise<any[]> {
    const url = `businesses/${businessId}/filings`
    return axios.get(url)
      .then(response => {
        const filings = response?.data?.filings
        if (!filings) {
          // eslint-disable-next-line no-console
          console.log('fetchFilings() error - invalid response =', response)
          throw new Error('Invalid filings list')
        }
        return filings
      })
  }

  /**
   * Fetches the first or only filing.
   * This is expected to be a draft IA or Registration.
   * @param tempId the temp registration number
   * @returns a promise to return the draft filing, else exception
   */
  // eslint-disable-next-line max-len
  static async fetchFirstOrOnlyFiling (tempId: string): Promise<AmalgamationFilingIF | IncorporationFilingIF | RegistrationFilingIF> {
    const url = `businesses/${tempId}/filings`
    return axios.get(url)
      .then(response => {
        let filing
        // if response is a list then look at only the first filing
        if (Array.isArray(response?.data?.filings)) filing = response.data.filings[0].filing
        // otherwise expect response to be a single filing
        if (response?.data?.filing) filing = response.data.filing

        const filingName = filing?.header?.name as FilingTypes
        const filingId = +filing?.header?.filingId || 0

        if (!filing || !filingName || !filingId) {
          throw new Error('Invalid API response')
        }

        return filing
      })
  }

  /**
   * Fetches the first task.
   * This is expected to be a draft Dissolution or Restoration.
   * @param businessId the business identifier
   * @returns a promise to return the draft filing, else exception
   */
  // eslint-disable-next-line max-len
  static async fetchFirstTask (businessId: string): Promise<DissolutionFilingIF | RestorationFilingIF> {
    const url = `businesses/${businessId}/tasks`
    return axios.get(url)
      .then(response => {
        const filing = response?.data?.tasks?.[0]?.task.filing
        const filingName = filing?.header?.name as FilingTypes
        const filingId = +filing?.header?.filingId || 0

        if (!filing || !filingName || !filingId) {
          throw new Error('Invalid API response')
        }

        return filing
      })
  }

  /**
   * Fetches the specified filing.
   * @param businessId the business identifier
   * @param filingId the filing id
   * @returns a promise to return the filing, else exception
   */
  static async fetchFiling (businessId: string, filingId: number): Promise<any> {
    // get the draft filing from the tasks endpoint
    const url = `businesses/${businessId}/filings/${filingId}`
    return axios.get(url)
      .then(response => {
        const filing = response?.data?.filing
        if (!filing) throw new Error('Invalid API response')
        return filing
      })
  }

  /**
   * Updates an existing filing.
   * @param id the business identifier or temp registration number
   * @param filing the filing object
   * @param isDraft whether to save draft or complete the filing
   * @returns a promise to return the updated filing, else exception
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
   * Fetches name request data with phone and email validation.
   * @param nrNumber the name request number (eg, NR 1234567)
   * @param phone the name request phone (eg, 12321232)
   * @param email the name request email (eg, nr@example.com)
   * @returns a promise to return the NR data, or null if not found
   */
  static async fetchValidContactNr (nrNumber: string, phone = '', email = ''): Promise<NameRequestIF> {
    if (!nrNumber) throw new Error('Invalid parameter \'nrNumber\'')

    const url = `nameRequests/${nrNumber}/validate?phone=${phone}&email=${email}`
    return axios.get(url)
      .then(response => {
        const data = response?.data
        if (!data) throw new Error('Invalid API response')
        return data
      }).catch(error => {
        if (error?.response?.status === StatusCodes.NOT_FOUND) {
          return null // NR not found (not an error)
        } else if (error?.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error('Sent invalid email or phone number.') // Sent invalid email or phone
        } else if (error?.response?.status === StatusCodes.FORBIDDEN) {
          throw new Error('Not sent email or phone number.') // Not sent the email or phone
        }
        throw error
      })
  }

  /**
   * Fetches parties list.
   * @param businessId the business identifier
   * @returns a promise to return the parties from the response, else exception
   */
  static fetchParties (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/parties`
    return axios.get(url).then(response => {
      const data = response?.data
      if (!data) throw new Error('Invalid response data')
      return data
    })
  }

  /**
   * Fetches addresses.
   * @param businessId the business identifier
   * @returns a promise to return the addresses from the response, else exception
   */
  static fetchAddresses (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/addresses`
    return axios.get(url).then(response => {
      const data = response?.data
      if (!data) throw new Error('Invalid API response')
      return data
    }).catch(error => {
      if (error?.response?.status === StatusCodes.NOT_FOUND) {
        return null // Business or Address not found (not an error)
      }
      throw error
    })
  }

  /**
   * Fetches business info.
   * @param businessId the business identifier
   * @returns a promise to return the business info, else exception
   */
  static async fetchBusinessInfo (businessId: string): Promise<BusinessIF> {
    const url = `businesses/${businessId}`
    return axios.get(url).then(response => {
      const data = response?.data
      if (!data) throw new Error('Invalid API response')
      return data.business
    })
  }
}
