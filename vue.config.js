module.exports = {
  configureWebpack: (config) => {
    config.externals = {"agora-electron-sdk": "commonjs2 agora-electron-sdk"}
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "asar": false
      }
    }
  }
}