// Core Libraries
import 'core-js/stable' // to polyfill ECMAScript features
import 'regenerator-runtime/runtime' // to use transpiled generator functions

// Vue Libraries
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import Vuelidate from 'vuelidate'
import { getVueRouter } from '@/router'
import { getPiniaStore, getVuexStore } from '@/store'
import Affix from 'vue-affix'
import Vue2Filters from 'vue2-filters' // needed by SbcFeeSummary
import * as Sentry from '@sentry/vue'
import VueObserveVisibility from 'vue-observe-visibility' // added to help with rendering of text area heights properly
import Hotjar from 'vue-hotjar'

// Styles
// NB: order matters - do not change
import '@mdi/font/css/materialdesignicons.min.css' // ensure you are using css-loader
import '@/assets/styles/base.scss'
import '@/assets/styles/layout.scss'
import '@/assets/styles/overrides.scss'

// Base App
import App from '@/App.vue'

// Helpers
import { FetchConfig, GetFeatureFlag, InitLdClient, Navigate } from '@/utils'
import KeycloakService from 'sbc-common-components/src/services/keycloak.services'

// get rid of "You are running Vue in development mode" console message
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(Affix)
Vue.use(Vuelidate)
Vue.use(Vue2Filters)
Vue.use(VueObserveVisibility)

// main code
async function start () {
  // fetch config from environment and API
  // must come first as inits below depend on config
  await FetchConfig()

  // initialize Launch Darkly
  if ((window as any).ldClientId) {
    console.info('Initializing Launch Darkly...') // eslint-disable-line no-console
    await InitLdClient()
  }

  if (GetFeatureFlag('sentry-enable')) {
    // initialize Sentry
    console.info('Initializing Sentry...') // eslint-disable-line no-console
    Sentry.init({
      Vue,
      dsn: (window as any).sentryDsn
    })
  }

  // initialize Hotjar
  const hotjarId: string = (window as any).hotjarId
  if (hotjarId) {
    console.info('Initializing Hotjar...') // eslint-disable-line no-console
    Vue.use(Hotjar, { id: hotjarId })
  }

  // configure KeyCloak Service
  console.info('Starting Keycloak service...') // eslint-disable-line no-console
  const keycloakConfig: any = {
    url: `${window['keycloakAuthUrl']}`,
    realm: `${window['keycloakRealm']}`,
    clientId: `${window['keycloakClientId']}`
  }

  await KeycloakService.setKeycloakConfigUrl(keycloakConfig)

  // initialize token service which will do a check-sso to initiate session
  // don't start during Jest tests as it messes up the test JWT
  if (process.env.JEST_WORKER_ID === undefined) {
    console.info('Starting token refresh service...') // eslint-disable-line no-console
    await KeycloakService.initializeToken()
  }

  // start Vue application
  console.info('Starting app...') // eslint-disable-line no-console
  new Vue({
    vuetify: new Vuetify({
      iconfont: 'mdi',
      theme: {
        themes: {
          light: {
            primary: '#1669bb', // same as $app-blue
            appDkBlue: '#38598a', // same as $app-dk-blue
            success: '#1a9031', // same as $app-green
            successCheckmark: '#2e8540', // same as $app-dk-green
            error: '#d3272c', // same as $app-red
            gray7: '#495057', // same as $gray7
            gray9: '#212529' // same as $gray9
          }
        }
      }
    }),
    router: getVueRouter(),
    store: getVuexStore(),
    pinia: getPiniaStore(),
    render: h => h(App)
  }).$mount('#app')
}

// execution and error handling
start().catch(error => {
  // log any error after configuring sentry.
  // it helps to identify configuration issues specific to the environment.
  // note that it won't log anything related to `FetchConfig()` since sentry is depending on a config value.
  Sentry.captureException(error)
  console.error(error) // eslint-disable-line no-console
  alert('There was an error starting this page. (See console for details.)\n' +
    'Please try again later.')
  // try to navigate to Business Registry home page
  Navigate(sessionStorage.getItem('BUSINESSES_URL'))
})
