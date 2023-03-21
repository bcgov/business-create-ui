/* eslint-disable no-console */
import { AxiosInstance as axios } from '@/utils'

/**
 * Fetches config from environment and API.
 * @returns A promise to get & set session storage keys with appropriate values.
 */
export async function FetchConfig (): Promise<any> {
  // get config from environment
  const origin = window.location.origin
  const processEnvVueAppPath: string = process.env.VUE_APP_PATH
  const processEnvBaseUrl: string = process.env.BASE_URL

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

  const authWebUrl: string = process.env.VUE_APP_AUTH_WEB_URL
  sessionStorage.setItem('AUTH_WEB_URL', authWebUrl)
  console.log('Set Auth Web URL to: ' + authWebUrl)

  const registryHomeUrl: string = process.env.VUE_APP_REGISTRY_HOME_URL
  sessionStorage.setItem('REGISTRY_HOME_URL', registryHomeUrl)
  console.info('Set Registry Home URL to: ' + registryHomeUrl)

  const businessesUrl: string = process.env.VUE_APP_BUSINESSES_URL
  sessionStorage.setItem('BUSINESSES_URL', businessesUrl)
  console.log('Set Businesses URL to: ' + businessesUrl)

  const dashboardUrl: string = process.env.VUE_APP_DASHBOARD_URL
  sessionStorage.setItem('DASHBOARD_URL', dashboardUrl)
  console.log('Set Dashboard URL to: ' + dashboardUrl)

  const legalApiUrl: string = (process.env.VUE_APP_LEGAL_API_URL + process.env.VUE_APP_LEGAL_API_VERSION_2 + '/')
  // set base URL for axios calls
  axios.defaults.baseURL = legalApiUrl
  console.log('Set Legal API URL to: ' + legalApiUrl)

  const naicsUrl: string = (process.env.VUE_APP_NAICS_API_URL + process.env.VUE_APP_NAICS_API_VERSION + '/')
  sessionStorage.setItem('NAICS_URL', naicsUrl)
  console.log('Set NAICS URL to: ' + naicsUrl)

  const registriesSearchApiUrl: string =
    (process.env.VUE_APP_REGISTRIES_SEARCH_API_URL + process.env.VUE_APP_REGISTRIES_SEARCH_API_VERSION + '/')
  sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', registriesSearchApiUrl)
  console.log('Set Registries Search API URL to: ' + registriesSearchApiUrl)

  const businessApiKey: string = process.env.VUE_APP_REGISTRIES_SEARCH_API_KEY
  sessionStorage.setItem('BUSINESS_API_KEY', businessApiKey)

  const authApiUrl: string = (process.env.VUE_APP_AUTH_API_URL + process.env.VUE_APP_AUTH_API_VERSION + '/')
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)
  console.log('Set Auth API URL to: ' + authApiUrl)

  const payApiUrl: string = (process.env.VUE_APP_PAY_API_URL + process.env.VUE_APP_PAY_API_VERSION + '/')
  sessionStorage.setItem('PAY_API_URL', payApiUrl)
  console.log('Set Pay API URL to: ' + payApiUrl)

  // for system alert banner (sbc-common-components)
  const statusApiUrl: string = (process.env.VUE_APP_STATUS_API_URL + process.env.VUE_APP_STATUS_API_VERSION)
  sessionStorage.setItem('STATUS_API_URL', statusApiUrl)
  console.log('Set Status API URL to: ' + statusApiUrl)

  const siteminderLogoutUrl: string = process.env.VUE_APP_SITEMINDER_LOGOUT_URL
  if (siteminderLogoutUrl) {
    sessionStorage.setItem('SITEMINDER_LOGOUT_URL', siteminderLogoutUrl)
    console.info('Set Siteminder Logout URL to: ' + siteminderLogoutUrl)
  }

  const iaSurveyId: string = process.env.VUE_APP_IA_SURVEY_ID
  // NB: set empty string if iaSurveyId is falsy (undefined, null or 0)
  sessionStorage.setItem('IA_SURVEY_ID', iaSurveyId || '')

  const hotjarId: string = process.env.VUE_APP_HOTJAR_ID;
  (<any>window).hotjarId = hotjarId

  const addressCompleteKey: string = process.env.VUE_APP_ADDRESS_COMPLETE_KEY;
  (<any>window).addressCompleteKey = addressCompleteKey

  const ldClientId: string = process.env.VUE_APP_BUSINESS_CREATE_LD_CLIENT_ID;
  (<any>window).ldClientId = ldClientId

  const sentryDsn: string = process.env.VUE_APP_SENTRY_DSN;
  (<any>window).sentryDsn = sentryDsn

  const genesysEnv: string = process.env.VUE_APP_GENESYS_ENV;
  (<any>window).genesysEnv = genesysEnv

  const genesysId: string = process.env.VUE_APP_GENESYS_ID;
  (<any>window).genesysId = genesysId

  const genesysUrl: string = process.env.VUE_APP_GENESYS_URL;
  (<any>window).genesysUrl = genesysUrl

  const webChatReason: string = process.env.VUE_APP_WEBCHAT_REASON;
  (<any>window).webChatReason = webChatReason

  const webChatStatusUrl: string = process.env.VUE_APP_WEBCHAT_STATUS_URL;
  (<any>window).webChatStatusUrl = webChatStatusUrl
  if (webChatStatusUrl) console.info('Set WebChat Status URL to: ' + webChatStatusUrl)

  const webChatUrl: string = process.env.VUE_APP_WEBCHAT_URL;
  (<any>window).webChatUrl = webChatUrl
  if (webChatUrl) console.info('Set WebChat URL to: ' + webChatUrl)
}
