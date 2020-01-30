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
      const apiUrl: string = response.data['API_URL']
      axios.defaults.baseURL = apiUrl
      console.log('Set Legal API URL to: ' + apiUrl)

      const authUrl: string = response.data['AUTH_URL']
      sessionStorage.setItem('AUTH_URL', authUrl)
      console.log('Set Auth URL to: ' + authUrl)

      const signinUrl: string = response.data['SIGNIN_URL']
      sessionStorage.setItem('SIGNIN_URL', signinUrl)
      console.log('Set Signin URL to: ' + signinUrl)

      const authApiUrl: string = response.data['AUTH_API_URL']
      sessionStorage.setItem('AUTH_API_URL', authApiUrl)
      console.log('Set Auth API URL to: ' + authApiUrl)

      const payApiUrl: string = response.data['PAY_API_URL']
      sessionStorage.setItem('PAY_API_URL', payApiUrl)
      console.log('Set Pay API URL to: ' + payApiUrl)

      const keycloakConfigUrl = response.data['KEYCLOAK_CONFIG_URL']
      sessionStorage.setItem('KEYCLOAK_CONFIG_URL', keycloakConfigUrl)
      console.info('Set Keycloak config URL to: ' + keycloakConfigUrl)

      const addressCompleteKey = response.data['ADDRESS_COMPLETE_KEY']
      window['addressCompleteKey'] = addressCompleteKey
      console.info('Set Address Complete Key.')
    })
}

/**
 * Verifies that we have all the Keycloak tokens.
 * @returns A boolean indicating if all Keycloak keys exist.
 */
export function haveKcTokens (): boolean {
  return Boolean(sessionStorage.getItem('KEYCLOAK_TOKEN') &&
    sessionStorage.getItem('KEYCLOAK_REFRESH_TOKEN') &&
    sessionStorage.getItem('KEYCLOAK_ID_TOKEN'))
}
