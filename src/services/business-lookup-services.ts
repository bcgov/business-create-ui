import { BusinessLookupResultIF } from '@/interfaces'
import { AxiosInstance as axios } from '@/utils'

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
    let accountId = sessionStorage.getItem('ACCOUNT_ID')
    if (!accountId) {
      const currentAccount = sessionStorage.getItem('CURRENT_ACCOUNT')
      accountId = JSON.parse(currentAccount)?.id
    }
    return accountId
  }

  /**
   * Searches for business by code or words.
   * @param query code or words to search
   * @param searchStatus not used here but needed as it's a parameter needed for other UIs
   * @param legalTypes the legal types we're searching for
   * @returns a promise to return the search results
   */
  static async search (query: string, searchStatus: string, legalTypes: string): Promise<BusinessLookupResultIF[]> {
    const url = this.businessApiUrl +
      `businesses/search/facets?start=0&rows=20&categories=legalType:${legalTypes}::status:ACTIVE` +
      `&query=value:${encodeURIComponent(query)}`

    return axios.get(url, {
      headers: {
        'x-apikey': this.businessApiKey,
        'Account-Id': this.accountId
      }
    }).then(response => {
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
