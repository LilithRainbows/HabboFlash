const {
    app,
    BrowserWindow
} = require('electron')
const path = require('path')
const fs = require("fs");

let pluginName
switch (process.platform) {
    case 'win32':
        pluginName = 'pepflashplayer_32.dll'
        break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName))
app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            plugins: true
        }
    })
    win.removeMenu()
    win.maximize()
    win.loadURL('https://habbo.es/client')
    win.webContents.on('did-finish-load', () => {
        win.webContents.executeJavaScript(fs.readFileSync(path.join(__dirname, "client.js")).toString());
    })
})