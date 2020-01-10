import 'core-js/stable' // to polyfill ECMAScript features
import 'regenerator-runtime/runtime' // to use transpiled generator functions

// Vue Libraries
import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import { store } from '@/store'

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

// ********************** THIS IS FOR TESTING & DEVELOPMENT ONLY ***************************************
// The following information allows the front to bypass authentication when developing locally
// whilst still being able to consume the entities and relationships apis.

// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiJjY2IyMjc2OS1hNDljLTQzMjItOWIzNC1mMWFmMmRjOTlhY2YiLCJleHAiOjE1Nzg1OTQ1NzAsIm5iZiI6MCwiaWF0IjoxNTc4NTkyNzcwLCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOlsic2JjLWF1dGgtd2ViIiwiYWNjb3VudCJdLCJzdWIiOiI4YjgwZWM1ZC01YzUzLTRmOTMtYWJjNC1kMjE2MGU5ZTE1NjEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzYmMtYXV0aC13ZWIiLCJub25jZSI6IjUyYTFjZDBlLWU5MjktNGY5Yi1iN2Q1LTYwOGY4MmZkMTY5YiIsImF1dGhfdGltZSI6MTU3ODU5Mjc2Niwic2Vzc2lvbl9zdGF0ZSI6ImMwODI3NjNhLWJkYzAtNGQ1Ny1hNTcxLTM1NDAwYWI5MzEwOCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzE5Mi4xNjguMC4xMzo4MDgwLyIsIjE5Mi4xNjguMC4xMyIsIioiLCJodHRwOi8vMTkyLjE2OC4wLjEzOjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInB1YmxpY191c2VyIiwiZWRpdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCIsImZpcnN0bmFtZSI6IkJDUkVHVEVTVCBHcmVnb3J5Iiwicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdLCJuYW1lIjoiQkNSRUdURVNUIEdyZWdvcnkgVFdFTlRZT05FIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYmNzYy9vaWMzbmhvM3Fqdm5qY2ZpcXl5dXJ6NGR4Y3Jibmk2eSIsImxvZ2luU291cmNlIjoiQkNTQyIsImxhc3RuYW1lIjoiVFdFTlRZT05FIiwidXNlcm5hbWUiOiJiY3NjL29pYzNuaG8zcWp2bmpjZmlxeXl1cno0ZHhjcmJuaTZ5In0.etbo9RFIv5_RexOy-o85kQSRlZtHup8yMNUG7mfYRM6o8jD34o0cnmV_8ub5gA9iNqdKNGZOzuhddNVSN6B0-TtJhXPrKPBjFvLSpcRDHvctxwVNUfp8JxQw6qGW74pYHwWpxgkMcZ_ICBnhtC1yeJ5sVGCZ69HImKcFGLAtB6L797eXlqep7UijJ6_ob4GTO_Vk-ovhMl_DLTeHMvN9NdWOfc5e7F1p6Gb7JbcBEOaJdl8T6antxF_5EpMwaxPDKtcMeofLVklf0a58R6q1_MCgwaxcOe3i0zjebHDlF_R7-sBXcoE9s_0eMXxZWzi8FIw7DxFnDqLW5VoTECRA0g')
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_REFRESH_TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0YjYxZGViZi01M2NlLTQxODMtYWFhMS1jMmU2NjQxMDNhZWQifQ.eyJqdGkiOiIyMjJhNjVjNC1iMGY4LTQ0MjAtOTNiZi1jNjU5NmQ4ZDBlOTQiLCJleHAiOjE1Nzg2MjE1NzAsIm5iZiI6MCwiaWF0IjoxNTc4NTkyNzcwLCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJzdWIiOiI4YjgwZWM1ZC01YzUzLTRmOTMtYWJjNC1kMjE2MGU5ZTE1NjEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoic2JjLWF1dGgtd2ViIiwibm9uY2UiOiI1MmExY2QwZS1lOTI5LTRmOWItYjdkNS02MDhmODJmZDE2OWIiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJjMDgyNzYzYS1iZGMwLTRkNTctYTU3MS0zNTQwMGFiOTMxMDgiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIn0.FjqEJr7gjQjOhyZhARBI-nECIi2zdUk_AHjc1wk-EIw')
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_ID_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiI4YWFhMTRhMC02Njk4LTQ1ZjktOTNmZi03MjZhYjM5NWMxNDciLCJleHAiOjE1Nzg1MjY0NDYsIm5iZiI6MCwiaWF0IjoxNTc4NTI0NjQ2LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOiJzYmMtYXV0aC13ZWIiLCJzdWIiOiI4YjgwZWM1ZC01YzUzLTRmOTMtYWJjNC1kMjE2MGU5ZTE1NjEiLCJ0eXAiOiJJRCIsImF6cCI6InNiYy1hdXRoLXdlYiIsIm5vbmNlIjoiMWRjZWFkMDMtODA5NS00ZWY2LTg1NTMtNzk2NzE4YjEyOGE3IiwiYXV0aF90aW1lIjoxNTc4NTIzODkwLCJzZXNzaW9uX3N0YXRlIjoiMGY3ZjBhZTQtYWExMi00Y2FkLTljOTItZDYyNjFjODVkNTg0IiwiYWNyIjoiMCIsImZpcnN0bmFtZSI6IkJDUkVHVEVTVCBHcmVnb3J5IiwibmFtZSI6IkJDUkVHVEVTVCBHcmVnb3J5IFRXRU5UWU9ORSIsInByZWZlcnJlZF91c2VybmFtZSI6ImJjc2Mvb2ljM25obzNxanZuamNmaXF5eXVyejRkeGNyYm5pNnkiLCJsb2dpblNvdXJjZSI6IkJDU0MiLCJsYXN0bmFtZSI6IlRXRU5UWU9ORSIsInVzZXJuYW1lIjoiYmNzYy9vaWMzbmhvM3Fqdm5qY2ZpcXl5dXJ6NGR4Y3Jibmk2eSJ9.HUWiLsy9KnqEl6oBlLOzzwRvyTFSYQnO-Arjjc9T7Cqyxz9G0mmtLJakx0ep03c4kIgfFkzjFON1Wb0oLCiseYiDtUkoS1lCoJGeOThu-Axa270dJWKovKJZDvfDONpKqfqZ0gBqYobqIH4q8c5s18bnjnoBZrC7vRx1QOw0KvJwfO_tdusyjAmtXtaa1WX-GRnXC8DWecbETVKuDAoUY0uTq2KleHtB0wD9YhK01d2ygh7OPRYDP9oGuhV12nydqrXNhsOkgRn2sTLl3NN4TKK8d7fgLq8RLdij644c3S-WcQ3vtBJGcEWXUM_MCV_VbAJ5TnGVVS7cfz7dvkuw6w')
sessionStorage.setItem('BUSINESS_IDENTIFIER', 'BC0000301')
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
