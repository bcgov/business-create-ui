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
import { fetchConfig, haveKcTokens, getJwtRoles } from '@/utils'
import TokenServices from 'sbc-common-components/src/services/token.services'

// get rid of "You are running Vue in development mode" console message
Vue.config.productionTip = false

// ********************** THIS IS FOR TESTING & DEVELOPMENT ONLY ***************************************
// The following information allows the front to bypass authentication when developing locally
// whilst still being able to consume the entities and relationships apis.

// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiJhZmI3ODM5Mi1kNDAzLTRlZmYtODM4Ni0yOWRiZDgxZjgwZTIiLCJleHAiOjE1Nzg0Mjc5NTEsIm5iZiI6MCwiaWF0IjoxNTc4NDI2MTUxLCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOlsic2JjLWF1dGgtd2ViIiwiYWNjb3VudCJdLCJzdWIiOiI4YjgwZWM1ZC01YzUzLTRmOTMtYWJjNC1kMjE2MGU5ZTE1NjEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzYmMtYXV0aC13ZWIiLCJub25jZSI6IjVhOTE3ZmRkLTA2MzYtNDQzOS05MDFjLTQ3ZTNjZTk3NWFkMCIsImF1dGhfdGltZSI6MTU3ODQyMzgyMSwic2Vzc2lvbl9zdGF0ZSI6IjBlZTdiYzQ0LTViNjAtNGNkZi05YTEyLWM3MWZmZjVmY2IwMyIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzE5Mi4xNjguMC4xMzo4MDgwLyIsIjE5Mi4xNjguMC4xMyIsIioiLCJodHRwOi8vMTkyLjE2OC4wLjEzOjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInB1YmxpY191c2VyIiwiZWRpdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCIsImZpcnN0bmFtZSI6IkJDUkVHVEVTVCBHcmVnb3J5Iiwicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdLCJuYW1lIjoiQkNSRUdURVNUIEdyZWdvcnkgVFdFTlRZT05FIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYmNzYy9vaWMzbmhvM3Fqdm5qY2ZpcXl5dXJ6NGR4Y3Jibmk2eSIsImxvZ2luU291cmNlIjoiQkNTQyIsImxhc3RuYW1lIjoiVFdFTlRZT05FIiwidXNlcm5hbWUiOiJiY3NjL29pYzNuaG8zcWp2bmpjZmlxeXl1cno0ZHhjcmJuaTZ5In0.DQ74pX1bk0Gy-Fd1fMrxdDr6fcgiqBDQIq9j-2oG4gf-uSXRsv2apCfzUN8jEf3mMmRHnD_NyJ-clZXhVod7spwNwvPOnB8gIl9i6dyT7RRK6Ps6_26IJd45Wc7mE1Ni2g0vJtjZriWENcBLQBrLOqGc3NQhEzW-TBnHXeeDP1u3hFcJgQa0ueOfwc9FApBm1ttmeVqevl4eZzIHXEne8jE4xHsqNcJP0A-i7gHcogcAYNZQ5UVLrnrCBnnwqi6Zw1cNZ9MBAS3iXFT5IIX4FGsIuLV24xSrFg0oLo_jzXtbg1BNHN1xFoutBxFcnz8nhAYleVB82JPYB41cnzmSAg')
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_REFRESH_TOKEN', '...')
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_ID_TOKEN', '...')
sessionStorage.setItem('BUSINESS_IDENTIFIER', 'CP...')
sessionStorage.setItem('USER_FULL_NAME', 'Firstname Lastname')
// ***************************************************************************************************

/**
 * Fetch config from server, then load Vue
 */
fetchConfig()
  .then(() => {
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
    tokenServices.initUsingUrl(sessionStorage.getItem('KEYCLOAK_CONFIG_URL') || '')
      .then(() => tokenServices.scheduleRefreshTimer())
      .catch((err: string) => console.error(err))

    // Set and Store Key Cloak roles
    getJwtRoles()

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
