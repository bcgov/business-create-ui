import { BusinessLookupResultIF } from '@/interfaces'
import { axios } from '@/utils'

/**
 * Class that provides integration with the BusinessLookup API.
 */
export default class BusinessLookupServices {
  /**
   * Searches for code or words.
   * @param query words to search
   * @returns a promise to return the search results
   */
  static async search (query: string): Promise<BusinessLookupResultIF[]> {
    const businessApiKey = sessionStorage.getItem('BUSINESS_API_KEY')
    const accountId = sessionStorage.getItem('ACCOUNT_ID')
    const legalType = 'BC' // Will be updating to a list once search api support it.
    let url = sessionStorage.getItem('REGISTRIES_SEARCH_API_URL')
    url = `${url}businesses/search/facets?num_of_rows=20&status=active&legalType=${legalType}`
    url = `${url}&query=${encodeURIComponent(query)}`

    return axios.get(url, {
      headers: {
        'x-apikey': businessApiKey,
        'Account-Id': accountId
      }
    }).then(response => {
      const results: Array<BusinessLookupResultIF> = response?.data?.results
      if (!results) {
        throw new Error('Invalid API response')
      }
      return results
    })
  }
}
