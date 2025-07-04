import { AxiosInstance as axios } from '@/utils'
import { ColinBusinessIF } from '@/interfaces'

/**
 * Class that provides integration with the COLIN API.
 */
export default class ColinServices {
  /** The COLIN API URL. */
  static get colinApiUrl (): string {
    return sessionStorage.getItem('COLIN_API_URL')
  }

  /**
   * Fetches the public business data from COLIN.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the data
   */
  static async fetchPublicBusiness (businessId: string): Promise<ColinBusinessIF> {
    const url = `${this.colinApiUrl}businesses/${businessId}/public`

    // *** TODO: test this common axio instance
    return axios.get(url).then(response => {
      const data = response?.data
      if (!data) throw new Error('Invalid API response')
      return data.business
    })
  }
}
