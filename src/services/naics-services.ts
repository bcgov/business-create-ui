import { NaicsResultIF } from '@/interfaces'
import { AxiosInstance as axios } from '@/utils'
import { AxiosRequestConfig } from 'axios'

/**
 * Class that provides integration with the NAICS API.
 */
export default class NaicsServices {
  /** The NAICS URL, from session storage. */
  static get naicsUrl (): string {
    return sessionStorage.getItem('NAICS_URL')
  }

  /**
   * Additional or overridden Axios request headers.
   * See default Axios headers in AxiosInstance.ts.
   */
  static get config (): AxiosRequestConfig {
    // this service doesn't need to add to or override the default config
    return {}
  }

  /**
   * Searches for code or words.
   * @param searchTerm the code or words to search
   * @returns a promise to return the search results
   */
  static async search (searchTerm: string): Promise<NaicsResultIF[]> {
    const naics = this.naicsUrl + 'naics'
    const url = `${naics}?search_term=${encodeURIComponent(searchTerm)}`

    return axios.get(url, this.config)
      .then(response => {
        const results: Array<NaicsResultIF> = response?.data?.results
        if (!results) {
          throw new Error('Invalid API response')
        }
        return results
      })
  }
}
