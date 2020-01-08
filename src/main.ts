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
sessionStorage.setItem('KEYCLOAK_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiJiMmUxMzhjMS01ZTk3LTQ5YTYtYTRiNy01ZTEzNGFiY2Q1NjYiLCJleHAiOjE1Nzg1MjY0NDYsIm5iZiI6MCwiaWF0IjoxNTc4NTI0NjQ2LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOlsic2JjLWF1dGgtd2ViIiwiYWNjb3VudCJdLCJzdWIiOiI4YjgwZWM1ZC01YzUzLTRmOTMtYWJjNC1kMjE2MGU5ZTE1NjEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzYmMtYXV0aC13ZWIiLCJub25jZSI6IjFkY2VhZDAzLTgwOTUtNGVmNi04NTUzLTc5NjcxOGIxMjhhNyIsImF1dGhfdGltZSI6MTU3ODUyMzg5MCwic2Vzc2lvbl9zdGF0ZSI6IjBmN2YwYWU0LWFhMTItNGNhZC05YzkyLWQ2MjYxYzg1ZDU4NCIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzE5Mi4xNjguMC4xMzo4MDgwLyIsIjE5Mi4xNjguMC4xMyIsIioiLCJodHRwOi8vMTkyLjE2OC4wLjEzOjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInB1YmxpY191c2VyIiwiZWRpdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCIsImZpcnN0bmFtZSI6IkJDUkVHVEVTVCBHcmVnb3J5Iiwicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdLCJuYW1lIjoiQkNSRUdURVNUIEdyZWdvcnkgVFdFTlRZT05FIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYmNzYy9vaWMzbmhvM3Fqdm5qY2ZpcXl5dXJ6NGR4Y3Jibmk2eSIsImxvZ2luU291cmNlIjoiQkNTQyIsImxhc3RuYW1lIjoiVFdFTlRZT05FIiwidXNlcm5hbWUiOiJiY3NjL29pYzNuaG8zcWp2bmpjZmlxeXl1cno0ZHhjcmJuaTZ5In0.YIrK9EUHvhmdIyKKCoy-ug3sUJPgqBlMLs1hD3EGGJe_rDvt-P8Id3dhF2lIiS9jiVqjbz3s2uVGWzbii5sdoz9dnaS-8xQ7pSkkHjf-F8arxIJjBcFtBd697MG_xiiDwGPiinhlYmnSo2Mo4juifdRobnJexH3ubng2omFx12Oyby80nLuAirnIiWFtagvdm6Cg5Ss0Io13tnUJEOUuTTHbHLwSuhsGuSnPtoP4O433ZeS5tE9fgVtR2CvJHJ0wGKz2JII4NOW8z06E6KcglBjtwX6aZaF-4YC4yw2hn7YBSo14wRMg2YRZf9dEZnhbyizttg1mlGoSHpmLRAiAsw')
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_REFRESH_TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0YjYxZGViZi01M2NlLTQxODMtYWFhMS1jMmU2NjQxMDNhZWQifQ.eyJqdGkiOiJiNTdjZjAyMC00ZWQxLTQ1NGItODk0My1mNmQ5MzM3ZDM1MmUiLCJleHAiOjE1Nzg1NTM0NDYsIm5iZiI6MCwiaWF0IjoxNTc4NTI0NjQ2LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJzdWIiOiI4YjgwZWM1ZC01YzUzLTRmOTMtYWJjNC1kMjE2MGU5ZTE1NjEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoic2JjLWF1dGgtd2ViIiwibm9uY2UiOiIxZGNlYWQwMy04MDk1LTRlZjYtODU1My03OTY3MThiMTI4YTciLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiIwZjdmMGFlNC1hYTEyLTRjYWQtOWM5Mi1kNjI2MWM4NWQ1ODQiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIn0.Zuvu8jQckcMhOUmjA4kOxc3dx5kBSyCXniox6MR2y-s')
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
