const webpack = require('webpack')
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const packageName = JSON.parse(packageJson).friendlyName || 0
const packageVersion = JSON.parse(packageJson).version || 0

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
          'process.env': {
              PACKAGE_NAME:  '"' + packageName + '"',
              PACKAGE_VERSION: '"' + packageVersion + '"'
          }
      })
    ],
    devtool: 'source-map'
  },
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: `/${process.env.VUE_APP_PATH}`,
  devServer: {
    proxy: {
      // this is needed to prevent a CORS error when running locally
      '/local-keycloak-config-url/*': {
        target: 'https://business-create-dev.pathfinder.gov.bc.ca/businesses/create/config/kc/',
        pathRewrite: {
          '/local-keycloak-config-url': ''
        }
      }
    }
  }
}
