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
   * This is probably a draft Amalgamation, IA or Registration.
   * @param tempId the temp registration number
   * @returns a promise to return the draft filing, else exception
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
   * @returns a promise to return the draft filing, else exception
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
   * @returns the filing object
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
   * @returns a promise to return the directors from the response, else exception
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
            ],
            isLookupBusiness: null
          }

          return orgPerson
        })
      })
  }

  /**
   * Fetch the share structure of the current business.
   * @param businessId the business identifier
   * @returns a promise to return the share structure from the response, else exception
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
   * Fetches addresses.
   * @param businessId the business identifier
   * @returns a promise to return the addresses from the response, else exception
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
