import { AxiosInstance as axios, GetFeatureFlag } from '@/utils'

/**
 * Fetches config from environment and sets items in session storage or window object.
 */
export function FetchConfig (): void {
  // get config from environment
  const origin = window.location.origin
  const processEnvVueAppPath: string = import.meta.env.VUE_APP_PATH
  const processEnvBaseUrl: string = import.meta.env.BASE_URL

  if (!origin || !processEnvVueAppPath || !processEnvBaseUrl) {
    throw new Error('Missing environment variables')
  }

  // set Base URL for fetching local documents and for returning from redirects
  const baseUrl = `${origin}${processEnvVueAppPath}`
  sessionStorage.setItem('BASE_URL', baseUrl)

  // set Base for Vue Router
  sessionStorage.setItem('VUE_ROUTER_BASE', processEnvBaseUrl)

  const authWebUrl: string = import.meta.env.VUE_APP_AUTH_WEB_URL
  sessionStorage.setItem('AUTH_WEB_URL', authWebUrl)

  const registryHomeUrl: string = import.meta.env.VUE_APP_REGISTRY_HOME_URL
  sessionStorage.setItem('REGISTRY_HOME_URL', registryHomeUrl)

  const businessesUrl: string = import.meta.env.VUE_APP_BUSINESSES_URL
  sessionStorage.setItem('BUSINESSES_URL', businessesUrl)

  const businessDashUrl: string = import.meta.env.VUE_APP_BUSINESS_DASH_URL
  sessionStorage.setItem('BUSINESS_DASH_URL', businessDashUrl)

  // set Legal API URL or Business API GW URL depending on FF
  if (GetFeatureFlag('use-business-api-gw-url')) {
    const businessApiGwUrl: string =
      (import.meta.env.VUE_APP_BUSINESS_API_GW_URL + import.meta.env.VUE_APP_BUSINESS_API_VERSION_2 + '/')
    sessionStorage.setItem('BUSINESS_API_GW_URL', businessApiGwUrl)
    // set base URL for axios calls
    axios.defaults.baseURL = businessApiGwUrl
  } else {
    const legalApiUrl: string =
      (import.meta.env.VUE_APP_LEGAL_API_URL + import.meta.env.VUE_APP_LEGAL_API_VERSION_2 + '/')
    sessionStorage.setItem('LEGAL_API_URL', legalApiUrl)
    // set base URL for axios calls
    axios.defaults.baseURL = legalApiUrl
  }

  const naicsUrl: string = (import.meta.env.VUE_APP_NAICS_API_URL + import.meta.env.VUE_APP_NAICS_API_VERSION_2 + '/')
  sessionStorage.setItem('NAICS_URL', naicsUrl)

  const registriesSearchApiUrl: string =
    (import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_URL + import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_VERSION + '/')
  sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', registriesSearchApiUrl)

  // WARNING: AUTH_API_URL is needed for SbcHeader common component to load CURRENT_ACCOUNT object into session storage
  // FUTURE: SBC Header component should use Auth API GW URL
  const authApiUrl: string = (import.meta.env.VUE_APP_AUTH_API_URL + import.meta.env.VUE_APP_AUTH_API_VERSION + '/')
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)

  const authApiGwUrl: string =
    (import.meta.env.VUE_APP_AUTH_API_GW_URL + import.meta.env.VUE_APP_AUTH_API_VERSION + '/')
  sessionStorage.setItem('AUTH_API_GW_URL', authApiGwUrl)

  const colinApiUrl: string = (import.meta.env.VUE_APP_COLIN_API_URL + import.meta.env.VUE_APP_COLIN_API_VERSION + '/')
  sessionStorage.setItem('COLIN_API_URL', colinApiUrl)

  // WARNING: PAY_API_URL is needed for SbcFeeSummary common component to fetch fees
  // FUTURE: Fee Summary component should use Pay API GW URL
  const payApiUrl: string = (import.meta.env.VUE_APP_PAY_API_URL + import.meta.env.VUE_APP_PAY_API_VERSION + '/')
  sessionStorage.setItem('PAY_API_URL', payApiUrl)

  const payApiGwUrl: string = (import.meta.env.VUE_APP_PAY_API_GW_URL + import.meta.env.VUE_APP_PAY_API_VERSION + '/')
  sessionStorage.setItem('PAY_API_GW_URL', payApiGwUrl)

  // for system alert banner (sbc-common-components)
  const statusApiUrl: string = (import.meta.env.VUE_APP_STATUS_API_URL + import.meta.env.VUE_APP_STATUS_API_VERSION)
  sessionStorage.setItem('STATUS_API_URL', statusApiUrl)

  const siteminderLogoutUrl: string = import.meta.env.VUE_APP_SITEMINDER_LOGOUT_URL
  if (siteminderLogoutUrl) {
    sessionStorage.setItem('SITEMINDER_LOGOUT_URL', siteminderLogoutUrl)
  }

  const keycloakAuthUrl: string = import.meta.env.VUE_APP_KEYCLOAK_AUTH_URL;
  (<any>window).keycloakAuthUrl = keycloakAuthUrl

  const keycloakRealm: string = import.meta.env.VUE_APP_KEYCLOAK_REALM;
  (<any>window).keycloakRealm = keycloakRealm

  const keycloakClientId: string = import.meta.env.VUE_APP_KEYCLOAK_CLIENTID;
  (<any>window).keycloakClientId = keycloakClientId

  const iaSurveyId: string = import.meta.env.VUE_APP_IA_SURVEY_ID
  // NB: set empty string if iaSurveyId is falsy (undefined, null or 0)
  sessionStorage.setItem('IA_SURVEY_ID', iaSurveyId || '')

  const hotjarId: string = import.meta.env.VUE_APP_HOTJAR_ID;
  (<any>window).hotjarId = hotjarId

  const addressCompleteKey: string = import.meta.env.VUE_APP_ADDRESS_COMPLETE_KEY;
  (<any>window).addressCompleteKey = addressCompleteKey

  const sentryDsn: string = import.meta.env.VUE_APP_SENTRY_DSN;
  (<any>window).sentryDsn = sentryDsn

  const genesysEnv: string = import.meta.env.VUE_APP_GENESYS_ENV;
  (<any>window).genesysEnv = genesysEnv

  const genesysId: string = import.meta.env.VUE_APP_GENESYS_ID;
  (<any>window).genesysId = genesysId

  const genesysUrl: string = import.meta.env.VUE_APP_GENESYS_URL;
  (<any>window).genesysUrl = genesysUrl

  const webChatReason: string = import.meta.env.VUE_APP_WEBCHAT_REASON;
  (<any>window).webChatReason = webChatReason

  const webChatStatusUrl: string = import.meta.env.VUE_APP_WEBCHAT_STATUS_URL;
  (<any>window).webChatStatusUrl = webChatStatusUrl
  if (webChatStatusUrl) {
    console.info('Set WebChat Status URL to: ' + webChatStatusUrl) // eslint-disable-line no-console
  }

  const webChatUrl: string = import.meta.env.VUE_APP_WEBCHAT_URL;
  (<any>window).webChatUrl = webChatUrl
  if (webChatUrl) {
    console.info('Set WebChat URL to: ' + webChatUrl) // eslint-disable-line no-console
  }
}
