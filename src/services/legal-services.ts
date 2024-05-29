import { AxiosInstance as axios } from '@/utils'
import { StatusCodes } from 'http-status-codes'
import { BusinessIF, DissolutionFilingIF, IncorporationFilingIF, NameRequestIF, OrgPersonIF }
  from '@/interfaces'
import { FilingTypes, RoleTypes } from '@/enums'
import { ShareStructureIF } from '@bcrs-shared-components/interfaces'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

setActivePinia(createPinia())
const store = useStore()

/**
 * Class that provides integration with the Legal API.
 */
export default class LegalServices {
  /**
   * Fetches the filings list.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the filings list
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
   * This is probably a draft Amalgamation, IA or Registration.
   * @param tempId the temp registration number
   * @returns a promise to return the draft filing
   */
  static async fetchFirstOrOnlyFiling (tempId: string): Promise<any> {
    const url = `businesses/${tempId}/filings`

    return axios.get(url)
      .then(response => {
        let filing, filingName, filingId

        // if response is a list then look at only the first filing
        if (Array.isArray(response?.data?.filings)) {
          filing = response.data.filings[0]
          filingName = filing?.name as FilingTypes
          filingId = filing?.filingId
        }

        // otherwise expect response to be a single filing
        if (response?.data?.filing) {
          filing = response.data.filing
          filingName = filing?.header?.name as FilingTypes
          filingId = +filing?.header?.filingId || 0
        }

        if (!filing || !filingName || !filingId) {
          throw new Error('Invalid API response')
        }

        return filing
      })
  }

  /**
   * Fetches the first task.
   * This is probably a draft Dissolution or Restoration.
   * @param businessId the business identifier
   * @returns a promise to return the draft filing
   */
  static async fetchFirstTask (businessId: string): Promise<any> {
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
   * Fetches a filing.
   * @param url the full URL to fetch the filing
   * @returns a promise to return the filing object
   */
  static async fetchFiling (url: string): Promise<any> {
    return axios.get(url)
      .then(response => {
        const filing = response?.data?.filing
        if (!filing) {
          // eslint-disable-next-line no-console
          console.log('fetchFiling() error - invalid response =', response)
          throw new Error('Invalid filing')
        }
        return filing
      })
  }

  /**
   * Updates an existing filing.
   * @param id the business identifier or temp registration number
   * @param filing the filing object
   * @param isDraft whether to save draft or complete the filing
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
    const config = { headers: { 'Account-Id': store.getAccountId } }

    return axios.put(url, { filing }, config).then(response => {
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
   * Fetches a name request with optional phone and email for authorization.
   * @param nrNumber the name request number (eg, NR 1234567)
   * @param phone the name request phone number (eg, 123-4567)
   * @param email the name request email address (eg, me@example.com)
   * @returns a promise to return the NR data
   */
  static async fetchNameRequest (nrNumber: string, phone = '', email = ''): Promise<NameRequestIF> {
    if (!nrNumber) throw new Error('Invalid parameter \'nrNumber\'')

    const url = `nameRequests/${nrNumber}/validate?phone=${phone}&email=${email}`

    return axios.get(url)
      .then(response => {
        const data = response?.data
        if (!data) throw new Error('Invalid API response')
        return data
      })
  }

  /**
   * Fetches the parties list.
   * @param businessId the business identifier
   * @returns a promise to return the parties from the response
   */
  static async fetchParties (businessId: string): Promise<any> {
    const url = `businesses/${businessId}/parties`

    return axios.get(url).then(response => {
      const data = response?.data
      if (!data) throw new Error('Invalid API response')
      return data
    })
  }

  /**
   * Fetches the directors of the current business.
   * @param businessId the business identifier
   * @returns a promise to return the directors from the response
   */
  static async fetchDirectors (businessId: string): Promise<OrgPersonIF[]> {
    const url = `businesses/${businessId}/directors`

    return axios.get(url)
      .then(response => {
        const directors = response?.data?.directors as Array<any>

        if (!directors) throw new Error('Invalid API response')

        // return director list converted to org-person list
        return directors.map(director => {
          // WORK-AROUND WARNING !!!
          // convert directors from "middleInitial" to "middleName"
          const middleInitial = director.officer['middleInitial']
          if (middleInitial !== undefined) {
            director.officer.middleName = middleInitial
            delete director.officer['middleInitial']
          }

          const orgPerson: OrgPersonIF = {
            deliveryAddress: director.deliveryAddress,
            mailingAddress: director.mailingAddress,
            officer: director.officer,
            roles: [
              {
                appointmentDate: director.appointmentDate,
                cessationDate: director.cessationDate,
                roleType: RoleTypes.DIRECTOR
              }
            ]
          }

          return orgPerson
        })
      })
  }

  /**
   * Fetch the share structure of the current business.
   * @param businessId the business identifier
   * @returns a promise to return the share structure from the response
   */
  static async fetchShareStructure (businessId: string): Promise<ShareStructureIF> {
    const url = `businesses/${businessId}/share-classes`

    return axios.get(url)
      .then(response => {
        const shareStructure = response.data as ShareStructureIF

        if (!shareStructure) throw new Error('Invalid API response')

        // apply a type to share classes and series
        shareStructure.shareClasses.forEach(shareClass => {
          shareClass.type = 'Class'
          shareClass.series.forEach(shareSeries => { shareSeries.type = 'Series' })
        })

        return shareStructure
      })
  }

  /**
   * Fetches the addresses.
   * @param businessId the business identifier
   * @returns a promise to return the addresses from the response
   */
  static async fetchAddresses (businessId: string): Promise<any> {
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
   * Fetches the business info.
   * @param businessId the business identifier
   * @returns a promise to return the business info
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
