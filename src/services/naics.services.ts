import { axios } from '@/utils'

/**
 * Class that provides integration with the NAICS API.
 */
export default class NaicsServices {
  /**
   * Searches for code or words.
   * @param searchTerm the code or words to search
   * @returns a promise to return the search results
   */
  static async search (searchTerm: string): Promise<any> {
    const naics = sessionStorage.getItem('NAICS_URL')
    const url = `${naics}?search_term=${encodeURIComponent(searchTerm)}`

    return axios.get(url)
      .then(response => {
        const results = response?.data?.results
        if (!results) {
          throw new Error('Invalid API response')
        }
        return results
      })
  }
}
