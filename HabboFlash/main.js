const {
    app,
    BrowserWindow,
    session,
    shell,
    Menu
} = require('electron')
const path = require('path')
const fs = require("fs")
const prompt = require('native-prompt')
const instances = []
const url = require("url");
var currentpartition = 0;

function createWindow(link) {
    if (typeof link == "undefined") {
        link = 'file://' + __dirname + '/HotelSelector/index.html'
        var currentinstancescount = instances.length
        if (currentinstancescount > 0) {
            currentpartition += 1
        }
    }
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: __dirname + '/AppIcon.ico',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            plugins: true,
            partition: 'persist:' + currentpartition,
            preload: path.join(__dirname, "Client", "helper.js")
        }
    })
    instances.push(win)
    createMenu()
    win.maximize()
    var UserAgent = win.webContents.getUserAgent()
    UserAgent = UserAgent.replace("Electron/" + process.versions.electron, "")
    UserAgent = UserAgent.replace(app.getName() + "/" + app.getVersion(), "")
    UserAgent = UserAgent.replaceAll("  ", " ")
    win.webContents.setUserAgent(UserAgent)
    win.loadURL(link)
    win.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {
        var new_window_handled = false
        if (url.includes("/profile/")) { //User profile opened from client
            new_window_handled = true
            event.preventDefault();
            var ProfileLink = url.substring(url.lastIndexOf("/profile/"))
            BrowserWindow.getFocusedWindow().webContents.executeJavaScript('FlashExternalInterface.openPage("' + ProfileLink + '")')
        }
        if (disposition == "new-window") { //New handled window opened (for example auth dialogs)
            new_window_handled = true
        }
        if (new_window_handled == false) { //Open new tabs/unhandled windows with default app handler
            event.preventDefault()
            createWindow(url)
        }
    })

    win.webContents.on('enter-html-full-screen', function() {
        BrowserWindow.getFocusedWindow().setMenuBarVisibility(false)
    })
    win.webContents.on('leave-html-full-screen', function() {
        BrowserWindow.getFocusedWindow().setMenuBarVisibility(true)
    })

}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    var mkc = require("make-cert")
    var mkc2 = mkc("localhost")
    const https = require('https');
    const options = {
        key: mkc2.key,
        cert: mkc2.cert
    };
    https.createServer(options, function(req, res) {
        var urlobj = url.parse(req.url)
        var pathname = urlobj.pathname;
        var reqhandled = false;
        if (pathname == "/Habbo.swf") {
            reqhandled = true;
            fs.readFile(path.join(__dirname, "Client", pathname), (err, contents) => {
                if (err) {
                    res.writeHead(404);
                    res.end();
                } else {
                    res.setHeader("Content-Type", "application/x-shockwave-flash");
                    res.writeHead(200);
                    res.end(contents);
                }
            });
        }
        if (reqhandled == false) {
            https.get("https://images.habbo.com/" + req.url, (resp) => {
                let rawHeaders = resp.rawHeaders;
                for (let i = 0; i < rawHeaders.length; i += 2) {
                    res.setHeader(rawHeaders[i], rawHeaders[i + 1]);
                }
                resp.on("data", (chunk) => {
                    res.write(chunk);
                });
                resp.on("end", () => {
                    res.end();
                });
            }).on("error", (err) => {
                res.writeHead(500);
                res.end();
            });
        }
    }).listen(1617);

    let pluginName
    switch (process.platform) {
        case 'win32':
            if (process.arch == "x64") {
                pluginName = 'pepflashplayer64_32_0_0_465.dll'
            } else {
                pluginName = 'pepflashplayer32_32_0_0_465.dll'
            }
            break
        case 'darwin':
            pluginName = 'PepperFlashPlayer.plugin'
            break
        case 'linux':
            if (process.arch == "x64") {
                pluginName = 'libpepflashplayer64_32_0_0_465.so'
            } else {
                pluginName = 'libpepflashplayer32_32_0_0_465.so'
            }
            break
    }

    /* Deprecated, instead set dpiAware parameter to false on executable manifest.
    if(process.platform == "win32") {
        //Force scale factor to 1 on Windows.
        app.commandLine.appendSwitch('high-dpi-support', '1');
        app.commandLine.appendSwitch('force-device-scale-factor', '1');
    }
    */

    app.commandLine.appendSwitch('no-sandbox')
    app.commandLine.appendSwitch('ignore-gpu-blacklist')
    app.commandLine.appendSwitch('force_high_performance_gpu')

    app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, "PepperFlash", pluginName))
    app.commandLine.appendSwitch('ppapi-flash-args', 'enable_hw_video_decode=1')
    app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.465');

    app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
    app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
    app.commandLine.appendSwitch('host-rules', 'MAP images.habbo.com localhost:1617, MAP *.doubleclick.net null')

    app.on('second-instance', (event, argv, workingDirectory) => createWindow())

    app.on('gpu-info-update', () => {
        console.log("Graphics Feature Status:", "\n", app.getGPUFeatureStatus());
    });

    app.whenReady().then(createWindow)

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        try {
            if (mainWindow === null) {
                createWindow()
            }
        } catch (ex) {}
    })

    function createMenu() {
        var LanguageIndex = 0
        var FileMenuText = ["Application", "Aplicacion"]
        var NewSessionText = ["New session", "Nueva sesion"]
        var HotelSelectorText = ["Select Hotel", "Seleccionar Hotel"]
        var ReloadPageText = ["Reload page", "Recargar pagina"]
        var ClearDataText = ["Clear data", "Limpiar datos"]
        var HideMenuText = ["Hide menu", "Ocultar menu"]
        var ZoomInText = ["Increase", "Aumentar"]
        var ZoomOutText = ["Decrease", "Reducir"]
        var ZoomRestoreText = ["Restore", "Restaurar"]
        var SendLinkEventText = ["Send LinkEvent", "Enviar LinkEvent"]
        var SendLinkEventHelpText = ["Enter an event command:", "Ingresa un comando de evento:"]
        var UseRoomIDText = ["Use RoomID", "Usar RoomID"]
        var UseRoomIDHelpText = ["Enter a room ID:", "Ingresa un ID de sala:"]
        var OpenProfileText = ["Open profile", "Abrir perfil"]
        var OpenProfileHelpText = ["Enter a username:", "Ingresa un nombre:"]
        var OpenCalendarText = ["Open calendar", "Abrir calendario"]
        var HelpMenuText = ["Help", "Ayuda"]
        var GithubText = ["Go to GitHub", "Ir a GitHub"]
        var OpenDevToolsText = ["Open DevTools", "Abrir DevTools"]
        if (app.getLocale().startsWith("es")) {
            LanguageIndex = 1
        }
        const menu = Menu.buildFromTemplate([{
                label: FileMenuText[LanguageIndex],
                submenu: [{
                        label: NewSessionText[LanguageIndex],
                        accelerator: "CommandOrControl+N",
                        click() {
                            createWindow()
                        }
                    },
                    {
                        label: HotelSelectorText[LanguageIndex],
                        click() {
                            BrowserWindow.getFocusedWindow().loadURL('file://' + __dirname + '/HotelSelector/index.html')
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
                            var currentPartition = BrowserWindow.getFocusedWindow().webContents.browserWindowOptions.webPreferences.partition
                            session.fromPartition(currentPartition).clearCache()
                            session.fromPartition(currentPartition).clearStorageData()
                        }
                    },
                    {
                        label: HideMenuText[LanguageIndex],
                        accelerator: "F11",
                        click() {
                            if (BrowserWindow.getFocusedWindow().isMenuBarVisible()) {
                                BrowserWindow.getFocusedWindow().setMenuBarVisibility(false)
                            } else {
                                BrowserWindow.getFocusedWindow().setMenuBarVisibility(true)
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
                        accelerator: 'CommandOrControl+='
                    },
                    {
                        label: ZoomOutText[LanguageIndex],
                        role: "zoomOut"
                    },
                    {
                        label: ZoomRestoreText[LanguageIndex],
                        role: "resetZoom"
                    }
                ]
            },
            {
                label: "Extras",
                submenu: [{
                        label: SendLinkEventText[LanguageIndex],
                        click() {
                            prompt("LinkEvent", SendLinkEventHelpText[LanguageIndex]).then(text => {
                                if (text) {
                                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('window.HabboFlashClient.flashInterface.openlink("' + text + '")')
                                }
                            })
                        }
                    },
                    {
                        label: UseRoomIDText[LanguageIndex],
                        click() {
                            prompt("RoomID", UseRoomIDHelpText[LanguageIndex]).then(text => {
                                if (text) {
                                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('window.HabboFlashClient.flashInterface.openlink("navigator/goto/' + text + '")')
                                }
                            })
                        }
                    },
                    {
                        label: OpenProfileText[LanguageIndex],
                        click() {
                            prompt("OpenProfile", OpenProfileHelpText[LanguageIndex]).then(text => {
                                if (text) {
                                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('window.HabboFlashClient.flashInterface.openlink("friendbar/user/' + text + '")')
                                }
                            })
                        }
                    },
                    {
                        label: OpenCalendarText[LanguageIndex],
                        click() {
                            BrowserWindow.getFocusedWindow().webContents.executeJavaScript('window.HabboFlashClient.flashInterface.openlink("openView/calendar")')
                        }
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
}