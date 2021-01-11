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
        "asar": false,
        "productName": "南石医院远程医疗客户端",
          "appId": "com.nanshihospital.TelemedicineDesktop",
          "dmg": {
            "sign": false,
            "contents": [
              {
                "x": 410,
                "y": 150,
                "type": "link",
                "path": "/Applications"
              },
              {
                "x": 130,
                "y": 150,
                "type": "file"
              }
            ]
          },
          "mac": {
            "hardenedRuntime": true,
            "gatekeeperAssess": false,
            "entitlements": "public/entitlements.mac.plist",
            "entitlementsInherit": "public/entitlements.mac.plist",
            "extendInfo": {
              "NSMicrophoneUsageDescription": "为了您在上课时使用语音交流",
              "NSCameraUsageDescription": "为了您在上课时使用视频交流"
            }
          }
      }
    }
  }
}