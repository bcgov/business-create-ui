module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: [
    'vue-plugin-helper-decorator',
    'vuetify'
  ]
}
