import { AxiosInstance as axios } from '@/utils'
import { FilingCodes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { FeesIF } from '@/interfaces'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

setActivePinia(createPinia())
const store = useStore()

/**
 * Class that provides integration with the Pay API.
 */
export default class PayServices {
  /** The Pay API Gateway URL, from session storage. */
  static get payApiGwUrl (): string {
    return sessionStorage.getItem('PAY_API_GW_URL')
  }

  /** The Pay API Key, from the environment. */
  static get payApiKey (): string {
    return import.meta.env.VUE_APP_PAY_API_KEY
  }

  /**
   * Fetches filing fees.
   * @returns a promise to return the fees for a filing
   */
  static async fetchFilingFees (
    filingCode: FilingCodes,
    entityType: CorpTypeCd,
    isFutureEffective: boolean
  ): Promise<FeesIF> {
    let url = this.payApiGwUrl + 'fees/' + entityType + '/' + filingCode
    if (isFutureEffective) {
      url += '?futureEffective=true'
    }
    const config = {
      headers: {
        'Account-Id': store.getAccountId,
        'X-Apikey': this.payApiKey
      }
    }

    return axios.get(url, config)
      .then(response => {
        const fees = response?.data
        if (!fees) {
          throw new Error('Invalid API response')
        }
        return fees
      })
  }
}
