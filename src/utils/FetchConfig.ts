import { AxiosInstance as axios } from '@/utils'

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

  const businessRegistryUrl: string = import.meta.env.VUE_APP_BUSINESS_REGISTRY_URL
  sessionStorage.setItem('BUSINESS_REGISTRY_URL', businessRegistryUrl)

  const businessDashUrl: string = import.meta.env.VUE_APP_BUSINESS_DASH_URL
  sessionStorage.setItem('BUSINESS_DASH_URL', businessDashUrl)

  const businessApiUrl: string =
    (import.meta.env.VUE_APP_BUSINESS_API_GW_URL + import.meta.env.VUE_APP_BUSINESS_API_VERSION_2 + '/')
  sessionStorage.setItem('BUSINESS_API_URL', businessApiUrl)
  // set base URL for axios calls
  axios.defaults.baseURL = businessApiUrl

  const registriesSearchApiUrl: string =
    (import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_URL + import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_VERSION_2 + '/')
  sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', registriesSearchApiUrl)

  const authApiUrl: string =
    (import.meta.env.VUE_APP_AUTH_API_GW_URL + import.meta.env.VUE_APP_AUTH_API_VERSION + '/')
  // note: AUTH_API_URL is also used for settings call (SbcHeader)
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)

  const colinApiUrl: string = (import.meta.env.VUE_APP_COLIN_API_URL + import.meta.env.VUE_APP_COLIN_API_VERSION + '/')
  sessionStorage.setItem('COLIN_API_URL', colinApiUrl)

  const payApiUrl: string = (import.meta.env.VUE_APP_PAY_API_GW_URL + import.meta.env.VUE_APP_PAY_API_VERSION + '/')
  // note: PAY_API_URL is also used for SbcFeeSummary
  sessionStorage.setItem('PAY_API_URL', payApiUrl)

  // for system alert banner (sbc-common-components)
  const statusApiUrl: string = (import.meta.env.VUE_APP_STATUS_API_URL + import.meta.env.VUE_APP_STATUS_API_VERSION)
  // note: STATUS_API_URL is needed for whatsnew (SbcHeader)
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
