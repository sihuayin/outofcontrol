'use strict'

import { app, protocol, BrowserWindow, globalShortcut, Menu, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
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
    width: 800,
    height: 600,
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
