import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import EnvironmentPlugin from 'vite-plugin-environment'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import vuetify from 'vite-plugin-vuetify'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const appName = JSON.parse(packageJson).appName
const appVersion = JSON.parse(packageJson).version
const sbcName = JSON.parse(packageJson).sbcName
const sbcVersion = JSON.parse(packageJson).dependencies['sbc-common-components']
const aboutText1 = (appName && appVersion) ? `${appName} v${appVersion}` : ''
const aboutText2 = (sbcName && sbcVersion) ? `${sbcName} v${sbcVersion}` : ''

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    define: {
      'import.meta.env.ABOUT_TEXT':
        (aboutText1 && aboutText2) ? `"${aboutText1}<br>${aboutText2}"`
          : aboutText1 ? `"${aboutText1}"`
            : aboutText2 ? `"${aboutText2}"`
              : ''
    },
    envPrefix: 'VUE_APP_', // Need to remove this after fixing vaults. Use import.meta.env with VUE_APP.
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
      EnvironmentPlugin({
        BUILD: 'web' // Fix for Vuelidate, allows process.env with Vite.
      }),
      ViteRequireContext() // Support require.context in vite.
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    build: {
      rollupOptions: {
        external: [
          'vuetify/lib/components/VBtn/index.mjs',
          'vuetify/lib/components/VGrid/index.mjs',
          'vuetify/lib/components/VIcon/index.mjs',
          'vuetify/lib/components/VAlert/index.mjs',
          'vuetify/lib/components/VCard/index.mjs',
          'vuetify/lib/components/transitions/index.mjs'
        ]
      }
    },
    server: {
      host: true,
      port: 8080
    },
    test: {
      // simulate DOM with jsdom
      environment: 'jsdom',
      // enable jest-like global test APIs
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      // enable threads to speed up test running
      threads: true,
      // hide Vue Devtools message
      onConsoleLog: function (log) {
        if (log.includes('Download the Vue Devtools extension')) {
          return false
        }
      }
    }
  }
})
