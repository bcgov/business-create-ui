/* eslint-disable no-console */
import { axios } from '@/utils'

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

  const authWebUrl: string = response.data['AUTH_WEB_URL']
  sessionStorage.setItem('AUTH_WEB_URL', authWebUrl)
  console.log('Set Auth Web URL to: ' + authWebUrl)

  const registryHomeUrl = response.data['REGISTRY_HOME_URL']
  sessionStorage.setItem('REGISTRY_HOME_URL', registryHomeUrl)
  console.info('Set Registry Home URL to: ' + registryHomeUrl)

  const businessesUrl: string = response.data['BUSINESSES_URL']
  sessionStorage.setItem('BUSINESSES_URL', businessesUrl)
  console.log('Set Businesses URL to: ' + businessesUrl)

  const dashboardUrl: string = response.data['DASHBOARD_URL']
  sessionStorage.setItem('DASHBOARD_URL', dashboardUrl)
  console.log('Set Dashboard URL to: ' + dashboardUrl)

  const legalApiUrl: string = response.data['LEGAL_API_URL'] + response.data['LEGAL_API_VERSION'] + '/'
  // set base URL for axios calls
  axios.defaults.baseURL = legalApiUrl
  console.log('Set Legal API URL to: ' + legalApiUrl)

  const legalApiUrlV2: string = response.data['LEGAL_API_URL'] + response.data['LEGAL_API_VERSION_2'] + '/'
  sessionStorage.setItem('LEGAL_API_URL_V2', legalApiUrlV2)
  console.log('Set Legal API URL V2 URL to: ', legalApiUrlV2)

  const naicsUrl: string = response.data['NAICS_API_URL'] + response.data['NAICS_API_VERSION'] + '/'
  sessionStorage.setItem('NAICS_URL', naicsUrl)
  console.log('Set NAICS URL to: ' + naicsUrl)

  const registriesSearchUrl: string = response.data['REGISTRIES_SEARCH_API_URL'] +
                                    response.data['REGISTRIES_SEARCH_API_VERSION'] + '/'
  sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', registriesSearchUrl)
  console.log('Set REGISTRIES SEARCH API URL to: ' + registriesSearchUrl)

  const businessApiKey: string = response.data['BUSINESS_API_KEY']
  sessionStorage.setItem('BUSINESS_API_KEY', businessApiKey)
  console.log('Set BUSINESS API KEY to: ' + businessApiKey)

  const authApiUrl: string = response.data['AUTH_API_URL'] + response.data['AUTH_API_VERSION'] + '/'
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)
  console.log('Set Auth API URL to: ' + authApiUrl)

  const payApiUrl: string = response.data['PAY_API_URL'] + response.data['PAY_API_VERSION'] + '/'
  sessionStorage.setItem('PAY_API_URL', payApiUrl)
  console.log('Set Pay API URL to: ' + payApiUrl)

  // for system alert banner (sbc-common-components)
  const statusApiUrl: string = response.data['STATUS_API_URL'] + response.data['STATUS_API_VERSION']
  sessionStorage.setItem('STATUS_API_URL', statusApiUrl)
  console.log('Set Status API URL to: ' + statusApiUrl)

  const keycloakConfigPath: string = response.data['KEYCLOAK_CONFIG_PATH']
  sessionStorage.setItem('KEYCLOAK_CONFIG_PATH', keycloakConfigPath)
  console.info('Set Keycloak Config Path to: ' + keycloakConfigPath)

  const addressCompleteKey: string = response.data['ADDRESS_COMPLETE_KEY'];
  (<any>window).addressCompleteKey = addressCompleteKey
  console.info('Set Address Complete Key.')

  const ldClientId: string = response.data['BUSINESS_CREATE_LD_CLIENT_ID'];
  (<any>window).ldClientId = ldClientId
  console.info('Set Launch Darkly Client ID.')

  const sentryEnable = response.data['SENTRY_ENABLE'];
  (<any>window).sentryEnable = sentryEnable

  const sentryDsn = response.data['SENTRY_DSN'];
  (<any>window).sentryDsn = sentryDsn
  console.log('Set Sentry DSN.')
}
