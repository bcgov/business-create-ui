import 'core-js/stable' // to polyfill ECMAScript features
import 'regenerator-runtime/runtime' // to use transpiled generator functions

// Vue Libraries
import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import { store } from '@/store'
import Affix from 'vue-affix'
import Vue2Filters from 'vue2-filters'

// Styles
import '@/assets/styles/base.scss'
import '@/assets/styles/layout.scss'
import '@/assets/styles/overrides.scss'
import '@mdi/font/css/materialdesignicons.min.css' // ensure you are using css-loader

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
sessionStorage.setItem('KEYCLOAK_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiIwMmUyNzZhZi04ZDBkLTQzMjEtODZmOS0zNjk3YzA3M2Q2NzAiLCJleHAiOjE1Nzg3MDExNTYsIm5iZiI6MCwiaWF0IjoxNTc4Njk5MzU2LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOlsic2JjLWF1dGgtd2ViIiwiYWNjb3VudCJdLCJzdWIiOiJkOTZhM2NlNi1jMmMzLTQyZDUtOWFkZS02NTliMDZkMWU3NWEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzYmMtYXV0aC13ZWIiLCJub25jZSI6IjE2ZTFkMDkwLWUzNGItNGRmYy05Y2QwLWQxM2IwY2JlNjA2NSIsImF1dGhfdGltZSI6MTU3ODY5OTM0OCwic2Vzc2lvbl9zdGF0ZSI6IjczNjgwZGE4LWZhN2UtNDAzOC1iMDdlLTg5MjBiMjU5NzMwMSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzE5Mi4xNjguMC4xMzo4MDgwLyIsIjE5Mi4xNjguMC4xMyIsIioiLCJodHRwOi8vMTkyLjE2OC4wLjEzOjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInB1YmxpY191c2VyIiwiZWRpdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCIsImZpcnN0bmFtZSI6IkJDUkVHVEVTVCBMdWNpbGxlIiwicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdLCJuYW1lIjoiQkNSRUdURVNUIEx1Y2lsbGUgVFdFTlRZIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYmNzYy9wbWQzcWR6NGh6cjNocHdibTdqd3VmZWw2ZmxwcXR5aiIsImxvZ2luU291cmNlIjoiQkNTQyIsImxhc3RuYW1lIjoiVFdFTlRZIiwidXNlcm5hbWUiOiJiY3NjL3BtZDNxZHo0aHpyM2hwd2JtN2p3dWZlbDZmbHBxdHlqIn0.Q_jPYr2tIi2meOJC6cL8o_957xBOrauz-0jfHuIia0svRlNsPY8VBJvbjpgWlXFlLHJ2SSB60V9iMYGGcnPRojZzOcf-nl9V-pCgg5JC-a8sElnL3_fbkXturDU0r0iTTn1BKpUHChzfHjfDdYyzCDw-ZTuvNKk2bHSjGNHFtu3Dotn7UzyL5FMDUDV75yZdubIK1DLQa8X3WQQJBpcMa_kNrRj7rZj5mHOamWKtTC9qF-n9sq4680ttSZsVKv0i_hoBQRo9Y_TgKYaEsl051Cnv7kBrfF1-t7qRKF6kNK_picCwBkl7InqTIFq2t1dwL8OVC6j2TysWIKht2ZSk1A')
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_REFRESH_TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0YjYxZGViZi01M2NlLTQxODMtYWFhMS1jMmU2NjQxMDNhZWQifQ.eyJqdGkiOiIzOGRkMWM2NS02MmRhLTRmNDgtYmEyZi1hODQyYjhkZmJlM2QiLCJleHAiOjE1Nzg3MjgxNTYsIm5iZiI6MCwiaWF0IjoxNTc4Njk5MzU2LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJzdWIiOiJkOTZhM2NlNi1jMmMzLTQyZDUtOWFkZS02NTliMDZkMWU3NWEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoic2JjLWF1dGgtd2ViIiwibm9uY2UiOiIxNmUxZDA5MC1lMzRiLTRkZmMtOWNkMC1kMTNiMGNiZTYwNjUiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI3MzY4MGRhOC1mYTdlLTQwMzgtYjA3ZS04OTIwYjI1OTczMDEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIn0.kgduFoN3H_QH3zQAoipikpk8dJfitir9ShunQqXpp_c')
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_ID_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiJjNDY3MDM1YS0zYjMwLTRmYjEtYjE2Ny02NTNhZGQ2ZTA1NzciLCJleHAiOjE1Nzg3MDExNTYsIm5iZiI6MCwiaWF0IjoxNTc4Njk5MzU2LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOiJzYmMtYXV0aC13ZWIiLCJzdWIiOiJkOTZhM2NlNi1jMmMzLTQyZDUtOWFkZS02NTliMDZkMWU3NWEiLCJ0eXAiOiJJRCIsImF6cCI6InNiYy1hdXRoLXdlYiIsIm5vbmNlIjoiMTZlMWQwOTAtZTM0Yi00ZGZjLTljZDAtZDEzYjBjYmU2MDY1IiwiYXV0aF90aW1lIjoxNTc4Njk5MzQ4LCJzZXNzaW9uX3N0YXRlIjoiNzM2ODBkYTgtZmE3ZS00MDM4LWIwN2UtODkyMGIyNTk3MzAxIiwiYWNyIjoiMSIsImZpcnN0bmFtZSI6IkJDUkVHVEVTVCBMdWNpbGxlIiwibmFtZSI6IkJDUkVHVEVTVCBMdWNpbGxlIFRXRU5UWSIsInByZWZlcnJlZF91c2VybmFtZSI6ImJjc2MvcG1kM3FkejRoenIzaHB3Ym03and1ZmVsNmZscHF0eWoiLCJsb2dpblNvdXJjZSI6IkJDU0MiLCJsYXN0bmFtZSI6IlRXRU5UWSIsInVzZXJuYW1lIjoiYmNzYy9wbWQzcWR6NGh6cjNocHdibTdqd3VmZWw2ZmxwcXR5aiJ9.dHIwMKVzqmj1ND9jEysXFNUuhJKoo9shUTN1w7vm7S0DSCNVoNBfG2QelvSVLWD9xROtEYOC_5rOh_Q2i6I26kOBn9Z3ZRgn0I1AqLgCzZAsHu-aJg44rxJq18spOVjHp6pM4hpodAb0BvHCZFRz9aaUU9JHQvYgjdZhy8qW-bJG_UMiZXzoaVs-gso4keX5wqeYd-ajUU6rb770P7UbkMDv6I3EdWqC6g_DK48w4EDMQCcOf49OT-tQIa8WfDgSwTlcL13u1tLv6SMFFI-UwDJtvlvnG1TYTg-hZDfwIDfV-VI9wBNEFxLgJ9H1K7ALtmggyFtn9LA40--5YvUbMQ')
sessionStorage.setItem('BUSINESS_IDENTIFIER', 'CP0000393')
sessionStorage.setItem('USER_FULL_NAME', 'Firstname Lastname')
// ***************************************************************************************************

/**
 * Fetch config from server, then load Vue
 */
fetchConfig()
  .then(async () => {
    // ensure we have the necessary Keycloak tokens
    // if (!haveKcTokens()) {
    //   console.info('Redirecting to Auth URL...')
    //   const authUrl: string | null = sessionStorage.getItem('AUTH_URL')
    //   // assume Auth URL is always reachable
    //   authUrl && window.location.assign(authUrl)
    //   return // do not execute remaining code
    // }
    //
    // // start token service to refresh KC token periodically
    // console.info('Starting token refresh service...')
    // const tokenServices = new TokenServices()
    // await tokenServices.initUsingUrl(sessionStorage.getItem('KEYCLOAK_CONFIG_URL') || '')
    //   .then(() => tokenServices.scheduleRefreshTimer())
    //   .catch((err: string) => console.error(err))
    //
    // // Store KeyCloak & Auth roles
    // console.info('Fetching JWT Roles and Authentication roles...')
    // const authService = new AuthenticationService()
    // await authService.getJwtRoles()
    // await authService.getAuthorizations()

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
