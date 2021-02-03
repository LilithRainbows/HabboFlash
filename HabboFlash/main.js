const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')
const fs = require("fs");

let pluginName
switch (process.platform) {
  case 'win32':
      if (process.arch == "x64") {
          pluginName = 'pepflashplayer_64.dll'
      } else {
          pluginName = 'pepflashplayer_32.dll'
      }
      break
  case 'darwin':
      pluginName = 'PepperFlashPlayer.plugin'
      break
  case 'linux':
      app.commandLine.appendSwitch('no-sandbox')
      if (process.arch == "x64") {
          pluginName = 'libpepflashplayer_64.so'
      } else {
          pluginName = 'libpepflashplayer_32.so'
      }
      break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, "PepperFlash", pluginName))

function createWindow() {
  const win = new BrowserWindow({
      width: 800,
      height: 600,
      icon: __dirname + '/AppIcon.ico',
      webPreferences: {
          plugins: true
      }
  })
  //win.removeMenu()
  win.maximize()
  win.loadURL('file://' + __dirname + '/HotelSelector/index.html')
  win.webContents.on('did-start-navigation', () => {
      win.webContents.executeJavaScript(fs.readFileSync(path.join(__dirname, "client.js")).toString());
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
  }
})