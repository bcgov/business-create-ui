/* eslint-disable no-console */
import { axiosInstance as axios } from '@/utils'

/**
 * Fetches config from environment and API.
 * @returns A promise to get & set session storage keys with appropriate values.
 */
export async function fetchConfig (): Promise<any> {
  // get config from environment
  const origin = window.location.origin
  const processEnvVueAppPath = process.env.VUE_APP_PATH as string
  const processEnvBaseUrl = process.env.BASE_URL as string

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
    Accept: 'application/json',
    ResponseType: 'application/json',
    'Cache-Control': 'no-cache'
  }

  const response = await axios.get(url, { headers }).catch(() => {
    return Promise.reject(new Error('Could not fetch configuration.json'))
  })

  const authWebUrl = response.data.AUTH_WEB_URL as string
  sessionStorage.setItem('AUTH_WEB_URL', authWebUrl)
  console.log('Set Auth Web URL to: ' + authWebUrl)

  const registryHomeUrl = response.data.REGISTRY_HOME_URL
  sessionStorage.setItem('REGISTRY_HOME_URL', registryHomeUrl)
  console.info('Set Registry Home URL to: ' + registryHomeUrl)

  const businessesUrl = response.data.BUSINESSES_URL as string
  sessionStorage.setItem('BUSINESSES_URL', businessesUrl)
  console.log('Set Businesses URL to: ' + businessesUrl)

  const dashboardUrl = response.data.DASHBOARD_URL as string
  sessionStorage.setItem('DASHBOARD_URL', dashboardUrl)
  console.log('Set Dashboard URL to: ' + dashboardUrl)

  const legalApiUrl = (response.data.LEGAL_API_URL + response.data.LEGAL_API_VERSION_2 + '/') as string
  // set base URL for axios calls
  axios.defaults.baseURL = legalApiUrl
  console.log('Set Legal API URL to: ' + legalApiUrl)

  const naicsUrl = (response.data.NAICS_API_URL + response.data.NAICS_API_VERSION + '/') as string
  sessionStorage.setItem('NAICS_URL', naicsUrl)
  console.log('Set NAICS URL to: ' + naicsUrl)

  const registriesSearchApiUrl =
    (response.data.REGISTRIES_SEARCH_API_URL + response.data.REGISTRIES_SEARCH_API_VERSION + '/') as string
  sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', registriesSearchApiUrl)
  console.log('Set Registries Search API URL to: ' + registriesSearchApiUrl)

  const businessApiKey = response.data.BUSINESS_API_KEY as string
  sessionStorage.setItem('BUSINESS_API_KEY', businessApiKey)

  const authApiUrl = (response.data.AUTH_API_URL + response.data.AUTH_API_VERSION + '/') as string
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)
  console.log('Set Auth API URL to: ' + authApiUrl)

  const payApiUrl = (response.data.PAY_API_URL + response.data.PAY_API_VERSION + '/') as string
  sessionStorage.setItem('PAY_API_URL', payApiUrl)
  console.log('Set Pay API URL to: ' + payApiUrl)

  // for system alert banner (sbc-common-components)
  const statusApiUrl = (response.data.STATUS_API_URL + response.data.STATUS_API_VERSION) as string
  sessionStorage.setItem('STATUS_API_URL', statusApiUrl)
  console.log('Set Status API URL to: ' + statusApiUrl)

  const keycloakConfigPath = response.data.KEYCLOAK_CONFIG_PATH as string
  sessionStorage.setItem('KEYCLOAK_CONFIG_PATH', keycloakConfigPath)
  console.info('Set Keycloak Config Path to: ' + keycloakConfigPath)

  const siteminderLogoutUrl = response.data.SITEMINDER_LOGOUT_URL as string
  if (siteminderLogoutUrl) {
    sessionStorage.setItem('SITEMINDER_LOGOUT_URL', siteminderLogoutUrl)
    console.info('Set Siteminder Logout URL to: ' + siteminderLogoutUrl)
  }

  const addressCompleteKey = response.data.ADDRESS_COMPLETE_KEY as string;
  (<any>window).addressCompleteKey = addressCompleteKey

  const ldClientId = response.data.BUSINESS_CREATE_LD_CLIENT_ID as string;
  (<any>window).ldClientId = ldClientId

  const sentryEnable = response.data.SENTRY_ENABLE;
  (<any>window).sentryEnable = sentryEnable

  const sentryDsn = response.data.SENTRY_DSN;
  (<any>window).sentryDsn = sentryDsn

  const webChatReason = response.data.WEBCHAT_REASON as string;
  (<any>window).webChatReason = webChatReason

  const webChatStatusUrl = response.data.WEBCHAT_STATUS_URL as string;
  (<any>window).webChatStatusUrl = webChatStatusUrl
  if (webChatStatusUrl) console.info('Set WebChat Status URL to: ' + webChatStatusUrl)

  const webChatUrl = response.data.WEBCHAT_URL as string;
  (<any>window).webChatUrl = webChatUrl
  if (webChatUrl) console.info('Set WebChat URL to: ' + webChatUrl)
}
