// Vue Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import router from './router'
import { store } from '@/store'

// Styles
import '@/assets/styles/base.scss'
import '@/assets/styles/layout.scss'
import '@/assets/styles/overrides.scss'

// Base App
import App from './App.vue'

// Helpers
import { fetchConfig } from '@/utils'

Vue.config.productionTip = false
Vue.use(Vuetify)
const vuetify = new Vuetify()

/**
 * Fetch config from server, then load Vue
 */
fetchConfig()
  .then(() => {
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
