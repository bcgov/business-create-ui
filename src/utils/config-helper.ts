/* eslint-disable no-console */

import axios from '@/utils/axios-auth'

/**
 * Fetches config from environment and API.
 * @returns A promise to get & set session storage keys with appropriate values.
 */
export function fetchConfig (): Promise<any> {
  const origin: string = window.location.origin
  const vueAppPath: string = process.env.VUE_APP_PATH

  if (!vueAppPath) {
    throw new Error('failed to get env variables')
  }

  const baseUrl: string = `${origin}/${vueAppPath}/`
  sessionStorage.setItem('BASE_URL', baseUrl)
  console.log('Set Base URL to: ' + baseUrl)

  const url = `${origin}/${vueAppPath}/config/configuration.json`
  const headers = {
    'Accept': 'application/json',
    'ResponseType': 'application/json',
    'Cache-Control': 'no-cache'
  }

  return axios
    .get(url, { headers })
    .then((response: any) => {
      const legalApiUrl: string = response.data['LEGAL_API_URL']
      // set base URL for axios calls
      axios.defaults.baseURL = legalApiUrl
      console.log('Set Legal API URL to: ' + legalApiUrl)

      const authUrl: string = response.data['AUTH_URL']
      sessionStorage.setItem('AUTH_URL', authUrl)
      console.log('Set Auth URL to: ' + authUrl)

      const authApiUrl: string = response.data['AUTH_API_URL']
      sessionStorage.setItem('AUTH_API_URL', authApiUrl)
      console.log('Set Auth API URL to: ' + authApiUrl)

      const payApiUrl: string = response.data['PAY_API_URL']
      sessionStorage.setItem('PAY_API_URL', payApiUrl)
      console.log('Set Pay API URL to: ' + payApiUrl)

      const keycloakConfigPath = response.data['KEYCLOAK_CONFIG_PATH']
      sessionStorage.setItem('KEYCLOAK_CONFIG_PATH', keycloakConfigPath)
      console.info('Set Keycloak Config Path to: ' + keycloakConfigPath)

      const addressCompleteKey = response.data['ADDRESS_COMPLETE_KEY'];
      (<any>window).addressCompleteKey = addressCompleteKey
      console.info('Set Address Complete Key.')

      const ldClientId = response.data['LD_CLIENT_ID'];
      (<any>window).ldClientId = ldClientId
      console.info('Set LD Client Id.')

      const businessesUrl = response.data['BUSINESSES_URL']
      sessionStorage.setItem('BUSINESSES_URL', businessesUrl)
      console.log('Set Businesses URL to: ' + businessesUrl)
    })
}
