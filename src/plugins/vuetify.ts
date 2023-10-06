// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.min.css' // ensure you are using css-loader
import '@/assets/styles/base.scss'
import '@/assets/styles/layout.scss'
import '@/assets/styles/overrides.scss'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'bcgov',
    themes: {
      bcgov: {
        colors: {
          primary: '#1669bb', // same as $$primary-blue
          darkBlue: '#38598a',
          error: '#d3272c',
          success: '#1a9031',
          warning: '#ffc107'
        }
      }
    }
  },
  components,
  directives
})
