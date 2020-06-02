/* eslint-disable no-console */

import axios from '@/utils/axios-auth'

/**
 * Fetches config from environment and API.
 * @returns A promise to get & set session storage keys with appropriate values.
 */
export async function fetchConfig (): Promise<any> {
  // get config from environment
  const origin: string = window.location.origin
  const processEnvVueAppPath: string = process.env.VUE_APP_PATH
  const processEnvBaseUrl = process.env.BASE_URL

  if (!origin || !processEnvVueAppPath || !processEnvBaseUrl) {
    return Promise.reject(new Error('Missing environment variables'))
  }

  // set Base URL for returning from redirects
  const baseUrl = `${origin}/${processEnvVueAppPath}/`
  sessionStorage.setItem('BASE_URL', baseUrl)
  console.log('Set Base URL to: ' + baseUrl)

  // set Base for Vue Router
  sessionStorage.setItem('VUE_ROUTER_BASE', processEnvBaseUrl)
  console.log('Set Vue Router Base to: ' + processEnvBaseUrl)

  // fetch config from API
  // eg, http://localhost:8080/basePath/config/configuration.json
  // eg, https://business-create-dev.pathfinder.gov.bc.ca/businesses/create/config/configuration.json
  const url = `${origin}/${processEnvVueAppPath}/config/configuration.json`
  const headers = {
    'Accept': 'application/json',
    'ResponseType': 'application/json',
    'Cache-Control': 'no-cache'
  }

  const response = await axios.get(url, { headers }).catch(() => {
    return Promise.reject(new Error('Could not fetch configuration.json'))
  })

  /**
   * authConfig is a workaround to fix the user settings call as it expects a URL with no trailing slash.
   * This will be removed when a fix is made to sbc-common-components to handle this
   */
  const authConfig = {
    'VUE_APP_AUTH_ROOT_API': response.data['SBC_CONFIG_AUTH_API_URL']
  }
  const authConfigString = JSON.stringify(authConfig)
  sessionStorage.setItem('AUTH_API_CONFIG', authConfigString)
  console.log('AUTH_API_CONFIG: ' + JSON.stringify(authConfigString))

  const businessesUrl: string = response.data['BUSINESSES_URL']
  sessionStorage.setItem('BUSINESSES_URL', businessesUrl)
  console.log('Set Businesses URL to: ' + businessesUrl)

  const authUrl: string = response.data['AUTH_URL']
  sessionStorage.setItem('AUTH_URL', authUrl)
  console.log('Set Auth URL to: ' + authUrl)

  const dashboardUrl: string = response.data['DASHBOARD_URL']
  sessionStorage.setItem('DASHBOARD_URL', dashboardUrl)
  console.log('Set Dashboard URL to: ' + dashboardUrl)

  const legalApiUrl: string = response.data['LEGAL_API_URL']
  // set base URL for axios calls
  axios.defaults.baseURL = legalApiUrl
  console.log('Set Legal API URL to: ' + legalApiUrl)

  const authApiUrl: string = response.data['AUTH_API_URL']
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)
  console.log('Set Auth API URL to: ' + authApiUrl)

  const payApiUrl: string = response.data['PAY_API_URL']
  sessionStorage.setItem('PAY_API_URL', payApiUrl)
  console.log('Set Pay API URL to: ' + payApiUrl)

  const keycloakConfigPath: string = response.data['KEYCLOAK_CONFIG_PATH']
  sessionStorage.setItem('KEYCLOAK_CONFIG_PATH', keycloakConfigPath)
  console.info('Set Keycloak Config Path to: ' + keycloakConfigPath)

  const addressCompleteKey: string = response.data['ADDRESS_COMPLETE_KEY'];
  (<any>window).addressCompleteKey = addressCompleteKey
  console.info('Set Address Complete Key.')

  const ldClientId: string = response.data['LD_CLIENT_ID'];
  (<any>window).ldClientId = ldClientId
  console.info('Set Launch Darkly Client ID.')

  const sentryDsn = response.data['SENTRY_DSN'];
  (<any>window).sentryDsn = sentryDsn
  console.log('Set Sentry DSN.')
}
