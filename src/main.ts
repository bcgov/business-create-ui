// Core Libraries
import 'core-js/stable' // to polyfill ECMAScript features
import 'regenerator-runtime/runtime' // to use transpiled generator functions

// Vue Libraries
import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import Vuelidate from 'vuelidate'
import router from '@/router'
import { store } from '@/store'
import Affix from 'vue-affix'
import Vue2Filters from 'vue2-filters' // needed by SbcFeeSummary
import { featureFlags, initLDClient } from '@/common/FeatureFlags'

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

Vue.use(Affix)
Vue.use(Vuelidate)
Vue.use(Vue2Filters)

/**
 * Fetch config from server, then load Vue.
 */
fetchConfig()
  .then(async () => {
    await initLDClient()

    // set keycloak config file's location to the sbc-common-components
    await KeycloakService.setKeycloakConfigUrl(sessionStorage.getItem('KEYCLOAK_CONFIG_URL'))

    if (featureFlags.getFlag('bcrs-create-ui-enabled')) {
      new Vue({
        vuetify,
        router,
        store,
        render: h => h(App)
      }).$mount('#app')
    }
  })
  .catch((error: string) => {
    /**
     * This catches any un-handled errors from fetchConfig()
     * or anything else in then() block above.
     */
    console.error(error) // eslint-disable-line no-console
    alert('There was an error starting this page. (See console for details.)' +
      '\n\n' +
      'Click OK to go to Cooperatives Online.')
    window.location.assign('/cooperatives/auth/') // TODO: update this when new URLs are in place
  })
