import axios from 'axios'
import { BusinessLookupResultIF } from '@/interfaces'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

setActivePinia(createPinia())
const store = useStore()

/**
 * Class that provides integration with the Business Lookup API.
 */
export default class BusinessLookupServices {
  /** The Registries Search API URL, from session storage. */
  static get searchApiUrl (): string {
    return sessionStorage.getItem('REGISTRIES_SEARCH_API_URL')
  }

  /** The Registries Search API Key, from session storage. */
  static get searchApiKey (): string {
    return sessionStorage.getItem('REGISTRIES_SEARCH_API_KEY')
  }

  /**
   * Searches for business by code or words.
   * @param query - code or words to search
   * @param status - status to match (ACTIVE or HISTORICAL or '' to match all statuses)
   * @param legalTypes - the legal types we're searching for
   * @returns a promise to return the search results
   */
  static async search (query: string, status: string, legalTypes: string): Promise<BusinessLookupResultIF[]> {
    let url = this.searchApiUrl + 'businesses/search/facets?start=0&rows=20'
    url += `&categories=legalType:${legalTypes}${status ? '::status:' + status : ''}`
    url += `&query=value:${encodeURIComponent(query)}`

    const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)

    const config = {
      headers: {
        Authorization: `Bearer ${kcToken}`,
        'X-Apikey': this.searchApiKey,
        'Account-Id': store.getAccountId
      }
    }

    // NOTE: this service uses a separate Axios instance from the rest of the app
    return axios.get(url, config).then(response => {
      const results: Array<BusinessLookupResultIF> = response?.data?.searchResults?.results
      if (!results) {
        throw new Error('Invalid API response')
      }

      // filter out results without a valid identifier
      return results.filter(result => {
        const pattern = /^[A-Z]{1,3}[0-9]{7}$/
        return pattern.test(result.identifier)
      })
    })
  }
}
