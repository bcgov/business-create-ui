// Core Libraries
import 'core-js/stable' // to polyfill ECMAScript features
import 'regenerator-runtime/runtime' // to use transpiled generator functions

// Vue Libraries
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import Vuelidate from 'vuelidate'
import { getVueRouter } from '@/router'
import { getVuexStore } from '@/store'
import Affix from 'vue-affix'
import Vue2Filters from 'vue2-filters' // needed by SbcFeeSummary
import { featureFlags, initLDClient } from '@/common/FeatureFlags'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

// Styles
// NB: order matters - do not change
import '@mdi/font/css/materialdesignicons.min.css' // ensure you are using css-loader
import '@/assets/styles/base.scss'
import '@/assets/styles/layout.scss'
import '@/assets/styles/overrides.scss'

// Base App
import App from './App.vue'

// Helpers
import { fetchConfig } from '@/utils'
import KeycloakService from 'sbc-common-components/src/services/keycloak.services'

// get rid of "You are running Vue in development mode" console message
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(Affix)
Vue.use(Vuelidate)
Vue.use(Vue2Filters)

// main code
async function start () {
  // fetch config from environment and API
  // must come first as inits below depend on config
  await fetchConfig()

  // initialize Sentry
  console.info('Initializing Sentry...') // eslint-disable-line no-console
  Sentry.init({
    dsn: window['sentryDsn'],
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })

  // initialize Launch Darkly
  await initLDClient()

  // check app feature flag
  if (featureFlags.getFlag('bcrs-create-ui-enabled')) {
    // configure KeyCloak Service
    console.info('Starting Keycloak service...') // eslint-disable-line no-console
    await KeycloakService.setKeycloakConfigUrl(sessionStorage.getItem('KEYCLOAK_CONFIG_PATH'))

    // start Vue application
    console.info('Starting app...') // eslint-disable-line no-console
    new Vue({
      vuetify: new Vuetify({ iconfont: 'mdi' }),
      router: getVueRouter(),
      store: getVuexStore(),
      render: h => h(App)
    }).$mount('#app')
  }
}

// execution and error handling
start().catch(error => {
  // log any error after configuring sentry.
  // it helps to identify configuration issues specific to the environment.
  // note that it won't log anything related to `fetchConfig()` since sentry is depending on a config value.
  Sentry.captureException(error)
  console.error(error) // eslint-disable-line no-console
  alert('There was an error starting this page. (See console for details.)\n' +
    'Please try again later.')
  // try to redirect to Business Registry home page
  const businessesUrl = sessionStorage.getItem('BUSINESSES_URL')
  if (businessesUrl) {
    // assume Businesses URL is always reachable
    window.location.assign(businessesUrl)
  }
})
