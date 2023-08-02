module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: `${import.meta.env.VUE_APP_PATH}`
}
