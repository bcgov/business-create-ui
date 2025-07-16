import { AxiosInstance as axios } from '@/utils'
import { BusinessLookupResultIF } from '@/interfaces'
import { AxiosRequestConfig } from 'axios'

/**
 * Class that provides integration with the Registries Search API.
 */
export default class RegistriesSearchServices {
  /** The Registries Search API URL. */
  static get searchApiUrl (): string {
    return sessionStorage.getItem('REGISTRIES_SEARCH_API_URL')
  }

  /**
   * Additional or overridden Axios request headers.
   * See default Axios headers in AxiosInstance.ts.
   */
  static get config (): AxiosRequestConfig {
    return {
      headers: {
        'X-Apikey': import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_KEY
      }
    }
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

    return axios.get(url, this.config)
      .then(response => {
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
