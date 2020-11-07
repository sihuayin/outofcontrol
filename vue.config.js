module.exports = {
  runtimeCompiler: true,
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