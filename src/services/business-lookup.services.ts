import { BusinessLookupResultIF } from '@/interfaces'
import { axios } from '@/utils'

/**
 * Class that provides integration with the BusinessLookup API.
 */
export default class BusinessLookupServices {
  /** The Business API URL, from session storage. */
  static get businessApiUrl (): string {
    return sessionStorage.getItem('REGISTRIES_SEARCH_API_URL')
  }

  /** The Business API Key, from session storage. */
  static get businessApiKey (): string {
    return sessionStorage.getItem('BUSINESS_API_KEY')
  }

  /** The Account ID, from session storage. */
  static get accountId (): string {
    // if we can't get account id from ACCOUNT_ID
    // then try to get it from CURRENT_ACCOUNT
    let accountId: string = sessionStorage.getItem('ACCOUNT_ID')
    if (!accountId) {
      const currentAccount = sessionStorage.getItem('CURRENT_ACCOUNT')
      accountId = JSON.parse(currentAccount)?.id
    }
    return accountId
  }

  /**
   * Searches for code or words.
   * @param query words to search
   * @returns a promise to return the search results
   */
  static async search (query: string): Promise<BusinessLookupResultIF[]> {
    const legalType = 'BC' // Will be updating to a list once search api support it.
    const url = this.businessApiUrl +
      `businesses/search/facets?num_of_rows=20&status=active&legalType=${legalType}` +
      `&query=${encodeURIComponent(query)}`

    return axios.get(url, {
      headers: {
        'x-apikey': this.businessApiKey,
        'Account-Id': this.accountId
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
