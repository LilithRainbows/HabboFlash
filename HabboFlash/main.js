const {
    app,
    BrowserWindow,
    session,
    shell,
    Menu
} = require('electron')
const path = require('path')
const fs = require("fs")

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
    createMenu(win)
    win.maximize()
    win.loadURL('file://' + __dirname + '/HotelSelector/index.html')
    win.webContents.on('did-start-navigation', () => {
        win.webContents.executeJavaScript(fs.readFileSync(path.join(__dirname, "client.js")).toString())
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

function createMenu(win) {
    var LanguageIndex = 0
    var FileMenuText = ["File", "Archivo"]
    var HotelSelectorText = ["Select Hotel", "Seleccionar Hotel"]
    var ReloadPageText = ["Reload page", "Recargar pagina"]
    var ClearDataText = ["Clear data", "Limpiar datos"]
    var HideMenuText = ["Hide menu", "Ocultar menu"]
    var ZoomInText = ["Increase", "Aumentar"]
    var ZoomOutText = ["Decrease", "Reducir"]
    var ZoomRestoreText = ["Restore", "Restaurar"]
    var HelpMenuText = ["Help", "Ayuda"]
    var GithubText = ["Go to GitHub", "Ir a GitHub"]
    var OpenDevToolsText = ["Open DevTools", "Abrir DevTools"]
    if (app.getLocale().startsWith("es")) {
        LanguageIndex = 1
    }
    const menu = Menu.buildFromTemplate([{
            label: FileMenuText[LanguageIndex],
            submenu: [{
                    label: HotelSelectorText[LanguageIndex],
                    click() {
                        win.loadURL('file://' + __dirname + '/HotelSelector/index.html')
                    }
                },
                {
                    label: ReloadPageText[LanguageIndex],
                    role: "forceReload",
                    accelerator: "F5"
                },
                {
                    label: ClearDataText[LanguageIndex],
                    click() {
                        session.defaultSession.clearStorageData()
                        app.relaunch()
                        app.exit()
                    }
                },
                {
                    label: HideMenuText[LanguageIndex],
                    accelerator: "F11",
                    click() {
                        if (win.isMenuBarVisible()) {
                            win.setMenuBarVisibility(false)
                        } else {
                            win.setMenuBarVisibility(true)
                        }
                    }
                }
            ]
        },
        {
            label: "Zoom",
            submenu: [{
                    label: ZoomInText[LanguageIndex],
                    role: "zoomIn",
                    accelerator: ''
                },
                {
                    label: ZoomOutText[LanguageIndex],
                    role: "zoomOut",
                    accelerator: ''
                },
                {
                    label: ZoomRestoreText[LanguageIndex],
                    role: "resetZoom",
                    accelerator: ''
                }
            ]
        },
        {
            label: HelpMenuText[LanguageIndex],
            submenu: [{
                    label: GithubText[LanguageIndex],
                    click() {
                        shell.openExternal('https://github.com/LilithRainbows/HabboFlash')
                    }
                },
                {
                    label: OpenDevToolsText[LanguageIndex],
                    role: "toggleDevTools",
                    accelerator: 'F12'
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)
}