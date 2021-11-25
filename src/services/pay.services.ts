// Libraries
import { axios } from '@/utils'
import { CorpTypeCd, FilingCodes } from '@/enums'
import { FeesIF } from '@/interfaces'

/**
 * Class that provides integration with the Pay API.
 */
export default class PayServices {
  /**
   * Fetches filing fees.
   * @returns a promise to return the fees for a filing
   */
  static async fetchFilingFees (
    filingCode: FilingCodes,
    entityType: CorpTypeCd,
    isFutureEffective: boolean
  ): Promise<FeesIF> {
    let url = sessionStorage.getItem('PAY_API_URL') + 'fees/' + entityType + '/' + filingCode
    if (isFutureEffective) {
      url += '?futureEffective=true'
    }
    return axios.get(url)
      .then(response => {
        const fees = response?.data
        if (!fees.filingFees) {
          throw new Error('Invalid API response')
        }
        return fees
      })
  }
}
