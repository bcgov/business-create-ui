import Axios from 'axios'
import { FilingCodes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { FeesIF } from '@/interfaces'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

const axios = Axios.create()
setActivePinia(createPinia())
const store = useStore()

/**
 * Class that provides integration with the Pay API.
 * Note that SbcFeeSummary uses its own Axios call.
 */
export default class PayServices {
  /** The Pay API Gateway URL. */
  static get payApiGwUrl (): string {
    return sessionStorage.getItem('PAY_API_GW_URL')
  }

  /** The Axios config (request headers). */
  static get config (): any {
    const kcToken = sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)
    const payApiKey = import.meta.env.VUE_APP_PAY_API_KEY
    return {
      headers: {
        'Account-Id': store.getAccountId,
        'App-Name': import.meta.env.APP_NAME,
        'Authorization': `Bearer ${kcToken}`,
        'X-Apikey': payApiKey
      }
    }
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

    return axios.get(url, this.config)
      .then(response => {
        const fees = response?.data
        if (!fees) {
          throw new Error('Invalid API response')
        }
        return fees
      })
  }
}
