module.exports = {
  configureWebpack: (config) => {
    config.externals = {"agora-electron-sdk": "commonjs2 agora-electron-sdk"}
    config.target = "electron-renderer"
  },
  pluginOptions: {
    electronBuilder: {
      externals: ["agora-electron-sdk"],
      nodeModulesPath: ['./node_modules'],
      builderOptions: {
        "asar": false
      }
    }
  }
}