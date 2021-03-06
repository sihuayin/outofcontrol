'use strict'

import { app, protocol, BrowserWindow, globalShortcut, Menu, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
import {
  autoUpdater
} from 'electron-updater'
// const { crashReporter } = require('electron');
const os = require('os')
const path = require('path')
const platform = os.platform()

const isMac = platform === 'darwin'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])


function updateHandle(window, feedUrl) {
  const mainWindow = window;
  let message = {
      error: '检查更新出错',
      checking: '正在检查更新……',
      updateAva: '检测到新版本，正在下载……',
      updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  //设置更新包的地址
  autoUpdater.setFeedURL(feedUrl);
  //监听升级失败事件
  autoUpdater.on('error', function (error) {
      sendUpdateMessage({
          cmd: 'error',
          message: error
      })
  });
  //监听开始检测更新事件
  autoUpdater.on('checking-for-update', function (message) {
      sendUpdateMessage({
          cmd: 'checking-for-update',
          message: message
      })
  });
  //监听发现可用更新事件
  autoUpdater.on('update-available', function (message) {
      sendUpdateMessage({
          cmd: 'update-available',
          message: message
      })
  });
  //监听没有可用更新事件
  autoUpdater.on('update-not-available', function (message) {
      sendUpdateMessage({
          cmd: 'update-not-available',
          message: message
      })
  });
 
  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
      sendUpdateMessage({
          cmd: 'download-progress',
          message: progressObj
      })
  });
  //监听下载完成事件
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
      sendUpdateMessage({
          cmd: 'update-downloaded',
          message: {
              releaseNotes,
              releaseName,
              releaseDate,
              updateUrl
          }
      })
      //退出并安装更新包
      autoUpdater.quitAndInstall();
  });
 
  //接收渲染进程消息，开始检查更新
  ipcMain.on("checkForUpdate", (e, arg) => {
    //执行自动更新检查
    // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
    autoUpdater.checkForUpdates();
  })
}

//给渲染进程发送消息
function sendUpdateMessage(text) {
  win.webContents.send('message', text)
}

function createWindow() {

  // 崩溃报告的上传
  // crashReporter.start({
  //   productName: 'eEducation-demo',
  //   companyName: 'agora-web-electron',
  //   submitURL: process.env.REACT_APP_CRASH_REPORT_URL,
  //   uploadToServer: true,
  //   extra: {
  //     version: '5.3.2'
  //   }
  // });

  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 860,
    show: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      webSecurity: false
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  ipcMain.on('window-close', () => {
    app.quit()
  })

  let feedUrl = "http://127.0.0.1:5500/dist_electron/";
  //检测版本更新
  updateHandle(win,feedUrl);

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { type: 'separator' },
        { role: 'services' },
        { role: 'hide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: "File",
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit'}
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools' },
        { role: 'togglefullscreen' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  if (platform === 'darwin') {
    win.excludedFromShownWindowsMenu = true
    Menu.setApplicationMenu(menu)
  }

  if (platform === 'win32') {
    // const menu = Menu.buildFromTemplate(template)
    // Menu.setApplicationMenu(menu)
    win.setMenu(menu);
  }
}

app.whenReady().then(() => {
  // more details: https://www.electronjs.org/docs/tutorial/keyboard-shortcuts
  globalShortcut.register('Control+Shift+X', () => {
    // Open the DevTools.
    const currentWindow = BrowserWindow.getFocusedWindow()
    currentWindow.webContents.openDevTools();
  })
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
