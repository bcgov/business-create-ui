module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: `${import.meta.env.VITE_PATH}`
}
