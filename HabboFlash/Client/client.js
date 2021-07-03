var ClientInjected = false
var SSOToken = null
var ProductVersion = null

InjectClient = setInterval(function() {
    var HotelClientV2 = document.getElementById("hotel-c1-clientv2")
    if (HotelClientV2) {
        if (HotelClientV2.getAttribute("type") == "application/x-shockwave-flash") {
            ClientInjected = true
        } else {
            ClientInjected = false
        }
        if (ClientInjected == false) {
            if (SSOToken == null) {
                try {
                    var clientsrc = HotelClientV2.getAttribute("src")
                    SSOToken = clientsrc.substring(clientsrc.lastIndexOf("/") + 1)
                    HotelClientV2.outerHTML = '<div id="hotel-c1-clientv2"></div>'
                    InjectSwfObjectJS()
                    InjectHabboAPIJS()
                } catch {
                    return "FAILED"
                }
            }
            if (ProductVersion == null) {
                ProductVersion = GetProductionVersion()
            }
            if (ProductVersion == "FAILED") {
                ClientInjected = true
                ShowExternalVariablesErrorScreen()
                return "FAILED"
            }
            var flashvars = {
                "external.texts.txt": "https://" + window.location.host + "/gamedata/external_flash_texts/666",
                "connection.info.port": GetConnectionPort(),
                "furnidata.load.url": "https://" + window.location.host + "/gamedata/furnidata_xml/666",
                "external.variables.txt": "https://" + window.location.host + "/gamedata/external_variables/666",
                "client.allow.cross.domain": "1",
                "url.prefix": "https://" + window.location.host + "",
                "external.override.texts.txt": "https://" + window.location.host + "/gamedata/override/external_flash_override_texts/666",
                "external.figurepartlist.txt": "https://" + window.location.host + "/gamedata/figuredata/666",
                "flash.client.origin": "popup",
                "client.starting": GetClientStartingMessage(),
                "processlog.enabled": "1",
                "has.identity": "1",
                "avatareditor.promohabbos": "https://" + window.location.host + "/api/public/lists/hotlooks",
                "productdata.load.url": "https://" + window.location.host + "/gamedata/productdata/666",
                "client.starting.revolving": GetClientResolvingMessage(),
                "external.override.variables.txt": "https://" + window.location.host + "/gamedata/override/external_override_variables/666",
                "spaweb": "1",
                "connection.info.host": GetConnectionHost(),
                "use.sso": "1",
                "sso.token": SSOToken,
                "client.notify.cross.domain": "0",
                "flash.client.url": "https://images.habbo.com/gordon/" + ProductVersion + "/"
            }
            var params = {
                "base": flashvars["flash.client.url"],
                "allowScriptAccess": "always",
                "menu": "false",
                "wmode": "opaque",
                "quality": "low"
            }
            swfobject.embedSWF('https://images.habbo.com/Habbo.swf', 'hotel-c1-clientv2', '100%', '100%', '11.1.0', '', flashvars, params, null, null)
            window.HabboFlashClient.init(document.getElementById("hotel-c1-clientv2"))
            RemoveInterstitials()
        }
    }
}, 100);

function GetProductionVersion() {
    try {
        var RemoteRequest = new XMLHttpRequest()
        RemoteRequest.open('GET', "gamedata/external_variables/666", false)
        RemoteRequest.send()
        var ReleaseVersion = RemoteRequest.responseText
        if (ReleaseVersion.includes("flash.client.url=")) {
            ReleaseVersion = ReleaseVersion.substring(ReleaseVersion.lastIndexOf("flash.client.url=") + 17)
            ReleaseVersion = ReleaseVersion.substring(ReleaseVersion.lastIndexOf("/gordon/") + 8)
            ReleaseVersion = ReleaseVersion.substring(0, ReleaseVersion.indexOf("/"))
            return ReleaseVersion
        } else {
            return "FAILED"
        }
    } catch {
        return "FAILED"
    }
}

function GetConnectionHost() {
    var HotelHost = window.location.host
    HotelHost = HotelHost.substring(HotelHost.lastIndexOf(".") + 1)
    if (HotelHost == "com") {
        HotelHost = "us"
    }
    if (window.location.host == "sandbox.habbo.com") {
        HotelHost = "s2"
    }
    return "game-" + HotelHost + ".habbo.com"
}

function GetConnectionPort() {
    var HotelHost = window.location.host
    HotelHost = HotelHost.substring(HotelHost.lastIndexOf(".") + 1)
    if (HotelHost == "com") {
        return "38101,843"
    } else {
        return "30000,843"
    }
}

function GetClientStartingMessage() {
    var HotelHost = window.location.host
    HotelHost = HotelHost.substring(HotelHost.lastIndexOf(".") + 1)
    if (HotelHost == "es") {
        return "¡Por favor, espera! Habbo se está cargando"
    } else {
        return "Please wait! Habbo is starting up"
    }
}

function GetClientResolvingMessage() {
    var HotelHost = window.location.host
    HotelHost = HotelHost.substring(HotelHost.lastIndexOf(".") + 1)
    if (HotelHost == "es") {
        return "Para ciencia, ¡Tú, monstruito!/Cargando mensajes divertidos... Por favor, espera./¿Te apetecen salchipapas con qué?/Sigue al pato amarillo./El tiempo es sólo una ilusión./¡¿Todavía estamos aquí?!/Me gusta tu camiseta./Mira a la izquierda. Mira a la derecha. Parpadea dos veces. ¡Ta-chán!/No eres tú, soy yo./Shhh! Estoy intentando pensar./Cargando el universo de píxeles."
    } else {
        return "For science, you monster/Loading funny message... please wait./Would you like fries with that?/Follow the yellow duck./Time is just an illusion./Are we there yet?!/I like your t-shirt./Look left. Look right. Blink twice. Ta da!/It\'s not you, it\'s me./Shhh! I\'m trying to think here./Loading pixel universe."
    }
}

ShowDisconnectedScreen = function() {
    if(document.getElementsByTagName("habbo-client-reload").length == 0) {
    try {
        var disconnected_message = "Disconnected!"
        var reload_message = "Reload"
        var HotelHost = window.location.host
        HotelHost = HotelHost.substring(HotelHost.lastIndexOf(".") + 1)
        if (HotelHost == "es") {
            disconnected_message = "¡Desconectado!"
            reload_message = "Recargar"
        }
        document.getElementsByTagName("habbo-v2-client")[0].children[0].insertAdjacentHTML("afterbegin", '<habbo-client-reload><h1>' + disconnected_message + '</h1><button onclick="location.reload();" class="client-v2-reload__button">' + reload_message + '</button><br><button onclick="document.getElementsByTagName(&#x27;habbo-client-reload&#x27;)[0].remove();" class="modal__close"></button></habbo-client-reload>')
    } catch {
        console.log("Error at ShowDisconnectedScreen")
    }
}
}

ShowExternalVariablesErrorScreen = function() {
    try {
        var error_message = "External variables error!"
        var reload_message = "Reload"
        var HotelHost = window.location.host
        HotelHost = HotelHost.substring(HotelHost.lastIndexOf(".") + 1)
        if (HotelHost == "es") {
            error_message = "¡Error de external variables!"
            reload_message = "Recargar"
        }
        document.getElementsByTagName("habbo-v2-client")[0].insertAdjacentHTML("afterend", '<habbo-client-reload><h1>' + error_message + '</h1><button onclick="location.reload();" class="client-v2-reload__button">' + reload_message + '</button></habbo-client-reload>')
    } catch {
        console.log("Error at ShowExternalVariablesErrorScreen")
    }
}

function RemoveInterstitials() {
    var HabboInterstitials = Array.prototype.slice.call(document.getElementsByTagName("habbo-interstitial"))
    for (var i = 0, l = HabboInterstitials.length; i < l; i++) {
        HabboInterstitials[i].remove()
    }
}

function InjectSwfObjectJS() {
    require("./habboapi.min.js")
    InjectTimer = setInterval(function() {
        if (typeof swfobject !== "undefined") {
            clearInterval(InjectTimer)
        }
    }, 100);
}

function InjectHabboAPIJS() {
    require("./swfobject.min.js")
    InjectTimer = setInterval(function() {
        if (typeof FlashExternalInterface !== "undefined") {
            clearInterval(InjectTimer)
        }
    }, 100);
}