import 'core-js/stable' // to polyfill ECMAScript features
import 'regenerator-runtime/runtime' // to use transpiled generator functions

// Vue Libraries
import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
//
// TODO: add Vuelidate
//
import router from '@/router'
import { store } from '@/store'
import Affix from 'vue-affix'
import Vue2Filters from 'vue2-filters'

// Styles
// NB: order matters - do not change
import '@mdi/font/css/materialdesignicons.min.css' // ensure you are using css-loader
import '@/assets/styles/base.scss'
import '@/assets/styles/layout.scss'
import '@/assets/styles/overrides.scss'

// Base App
import App from './App.vue'

// Helpers
import { fetchConfig, haveKcTokens, AuthenticationService } from '@/utils'
import TokenServices from 'sbc-common-components/src/services/token.services'

// get rid of "You are running Vue in development mode" console message
Vue.config.productionTip = false

Vue.use(Affix)
Vue.use(Vue2Filters)

// ********************** THIS IS FOR TESTING & DEVELOPMENT ONLY ***************************************
// The following information allows the front to bypass authentication when developing locally
// whilst still being able to consume the entities and relationships apis.

// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiJkNDgxMjE2ZC1kODI3LTQ3MjUtYTVkZi01NjdjZWUyZTkxN2UiLCJleHAiOjE1NzkwMjM1ODcsIm5iZiI6MCwiaWF0IjoxNTc5MDIxNzg3LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOlsic2JjLWF1dGgtd2ViIiwiYWNjb3VudCJdLCJzdWIiOiJkOTZhM2NlNi1jMmMzLTQyZDUtOWFkZS02NTliMDZkMWU3NWEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzYmMtYXV0aC13ZWIiLCJub25jZSI6ImYzNWViNzA5LTcxZTAtNDg5OC1hNzFlLWRmMzg5MWM4YTY5NCIsImF1dGhfdGltZSI6MTU3OTAyMTc4MSwic2Vzc2lvbl9zdGF0ZSI6ImQ3ZTk5ZTcyLTFlNDQtNDBlOS1iZmYyLWZmNjg4Y2RmYzg2NCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzE5Mi4xNjguMC4xMzo4MDgwLyIsIjE5Mi4xNjguMC4xMyIsIioiLCJodHRwOi8vMTkyLjE2OC4wLjEzOjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInB1YmxpY191c2VyIiwiZWRpdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCIsImZpcnN0bmFtZSI6IkJDUkVHVEVTVCBMdWNpbGxlIiwicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdLCJuYW1lIjoiQkNSRUdURVNUIEx1Y2lsbGUgVFdFTlRZIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYmNzYy9wbWQzcWR6NGh6cjNocHdibTdqd3VmZWw2ZmxwcXR5aiIsImxvZ2luU291cmNlIjoiQkNTQyIsImxhc3RuYW1lIjoiVFdFTlRZIiwidXNlcm5hbWUiOiJiY3NjL3BtZDNxZHo0aHpyM2hwd2JtN2p3dWZlbDZmbHBxdHlqIn0.ALuNIJlwEZOQwJ1dPK8W6--Do0dwPnf-vSpW8jTQRVWOl3J9wzjaxw3mWW_MEDHxzMCQRPVVsXGbjUhBJ_v7z-fn1HYPjeQjA2OjdALhp5L1aTeNqkAUUT6jaFvxPneOqkd8EYC4sVR_Wdmtk9UrESK32Mg7dYaNBTI8sgoFdZNcOXowZ4clFKq8O3GlH-rCs2cRQMDPaGiVpCQZ7MTxJBXeruk1EbqYPCLdEuh0MUoamkeSWrXpWMlpQCdw-r5BnPb33pMsOflNkTX3vJ_jdSIX94ZT1enjFfRT2i0osTcrOHG4x-udNy88ikzBird3h-fIRSWxbkT3JZP4qVLNEQ')
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_REFRESH_TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0YjYxZGViZi01M2NlLTQxODMtYWFhMS1jMmU2NjQxMDNhZWQifQ.eyJqdGkiOiI4OTY4MmE1Ni0yNTlhLTRhNzgtODE1MC05MDRjMTExYzZhNDAiLCJleHAiOjE1NzkwNTA1ODcsIm5iZiI6MCwiaWF0IjoxNTc5MDIxNzg3LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJzdWIiOiJkOTZhM2NlNi1jMmMzLTQyZDUtOWFkZS02NTliMDZkMWU3NWEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoic2JjLWF1dGgtd2ViIiwibm9uY2UiOiJmMzVlYjcwOS03MWUwLTQ4OTgtYTcxZS1kZjM4OTFjOGE2OTQiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJkN2U5OWU3Mi0xZTQ0LTQwZTktYmZmMi1mZjY4OGNkZmM4NjQiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIn0.wU9MCR8iTpb2XFrh_FrpljDa61a8RIeprn3OaGsEIsA')
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_ID_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiJiZThlZmVkZS01ZjM3LTRlMDUtYWYwZC04NGY3NjU0ODg1YjgiLCJleHAiOjE1NzkwMjM1ODcsIm5iZiI6MCwiaWF0IjoxNTc5MDIxNzg3LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOiJzYmMtYXV0aC13ZWIiLCJzdWIiOiJkOTZhM2NlNi1jMmMzLTQyZDUtOWFkZS02NTliMDZkMWU3NWEiLCJ0eXAiOiJJRCIsImF6cCI6InNiYy1hdXRoLXdlYiIsIm5vbmNlIjoiZjM1ZWI3MDktNzFlMC00ODk4LWE3MWUtZGYzODkxYzhhNjk0IiwiYXV0aF90aW1lIjoxNTc5MDIxNzgxLCJzZXNzaW9uX3N0YXRlIjoiZDdlOTllNzItMWU0NC00MGU5LWJmZjItZmY2ODhjZGZjODY0IiwiYWNyIjoiMSIsImZpcnN0bmFtZSI6IkJDUkVHVEVTVCBMdWNpbGxlIiwibmFtZSI6IkJDUkVHVEVTVCBMdWNpbGxlIFRXRU5UWSIsInByZWZlcnJlZF91c2VybmFtZSI6ImJjc2MvcG1kM3FkejRoenIzaHB3Ym03and1ZmVsNmZscHF0eWoiLCJsb2dpblNvdXJjZSI6IkJDU0MiLCJsYXN0bmFtZSI6IlRXRU5UWSIsInVzZXJuYW1lIjoiYmNzYy9wbWQzcWR6NGh6cjNocHdibTdqd3VmZWw2ZmxwcXR5aiJ9.CotnsnOCM6QGIM2OUC7cTxBNnorOBvH-RGG0ZpP7DvmGG-5223mawTyGqOGrGo7cruRmdTfu6Vsuyxs5XPHSLX5rVUjGPaeJSHCbI_KXPvM2ebNelIo3CvGrVl5Z7MSx9uAIQ2y64KN9yKIuTsernt4WI_RuygrbSxbu98aMECYqgIu9ZukD443qyk3a2MGkZ6wUfLMpQ2l9EmbFBSqRDK72x11duKQtF7zYW3uGyv3Q6yYD0hKiXSHLhky02y_sQYkKwh2l5gryf0NW-GzNmTuRguowo33wXoc4j0Ejp9gE9cKQJxZvcZbua0fqrNqXnmXqAEIAVXvoA-7pV0V7hQ')
sessionStorage.setItem('BUSINESS_IDENTIFIER', 'CP0000393')
sessionStorage.setItem('USER_FULL_NAME', 'Firstname Lastname')
// ***************************************************************************************************

/**
 * Fetch config from server, then load Vue
 */
fetchConfig()
  .then(async () => {
    // ensure we have the necessary Keycloak tokens
    if (!haveKcTokens()) {
      console.info('Redirecting to Auth URL...')
      const authUrl: string | null = sessionStorage.getItem('AUTH_URL')
      // assume Auth URL is always reachable
      authUrl && window.location.assign(authUrl)
      return // do not execute remaining code
    }

    // start token service to refresh KC token periodically
    console.info('Starting token refresh service...')
    const tokenServices = new TokenServices()
    await tokenServices.initUsingUrl(sessionStorage.getItem('KEYCLOAK_CONFIG_URL') || '')
      .then(() => tokenServices.scheduleRefreshTimer())
      .catch((err: string) => console.error(err))

    // Store KeyCloak & Auth roles
    console.info('Fetching JWT Roles and Authentication roles...')
    const authService = new AuthenticationService()
    await authService.getJwtRoles()
    await authService.getAuthorizations()

    // Mount Vue
    new Vue({
      vuetify,
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
  .catch((error: string) => {
    console.error('error fetching config -', error)
    alert('Fatal error loading app')
  })
