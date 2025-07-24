import { AxiosInstance as axios } from '@/utils'
import { NaicsResultIF } from '@/interfaces'

/**
 * Class that provides integration with the NAICS API.
 */
export default class NaicsServices {
  /** The NAICS URL, from session storage. */
  static get naicsUrl (): string {
    return sessionStorage.getItem('NAICS_URL')
  }

  /**
   * Searches for code or words.
   * @param searchTerm the code or words to search
   * @returns a promise to return the search results
   */
  static async search (searchTerm: string): Promise<NaicsResultIF[]> {
    const naics = this.naicsUrl + 'naics'
    const url = `${naics}?search_term=${encodeURIComponent(searchTerm)}`

    return axios.get(url)
      .then(response => {
        const results: Array<NaicsResultIF> = response?.data?.results
        if (!results) {
          throw new Error('Invalid API response')
        }
        return results
      })
  }
}
