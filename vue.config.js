module.exports = {
  configureWebpack: (config) => {
    config.externals = {"agora-electron-sdk": "commonjs2 agora-electron-sdk"}
    config.target = "electron-renderer"
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "asar": false
      }
    }
  }
}