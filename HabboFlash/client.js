var client_injected = false;
var element = document.getElementById("swfobject_script");
if (typeof(element) == 'undefined' || element == null) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = "swfobject_script"
    script.src = 'https://images.habbo.com/swfobject/2.3b/swfobject.js';
    document.head.appendChild(script);
    var script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.id = "habboapi_script"
    script2.src = 'https://images.habbo.com/game-data-server-static//habboapi.10385504.js';
    document.head.appendChild(script2);
}
InjectClient();

function InjectClient() {
    RemoveInterstitials();
    try {
        if (document.getElementById("hotel-c1-clientv2").getAttribute("type") == "application/x-shockwave-flash") {
            client_injected = true;
        }
        if (client_injected == false) {
            var clientsrc = document.getElementById("hotel-c1-clientv2").getAttribute("src")
            var flashvars = {
                "external.texts.txt": "https:\/\/" + window.location.host + "\/gamedata\/external_flash_texts\/0",
                "connection.info.port": GetConnectionPort(),
                "furnidata.load.url": "http:\/\/" + window.location.host + "\/gamedata\/furnidata_xml\/0",
                "external.variables.txt": "https:\/\/" + window.location.host + "\/gamedata\/external_variables\/0",
                "client.allow.cross.domain": "1",
                "url.prefix": "https:\/\/" + window.location.host + "",
                "external.override.texts.txt": "https:\/\/" + window.location.host + "\/gamedata\/override\/external_flash_override_texts\/0",
                "supersonic_custom_css": "https:\/\/images.habbo.com\/game-data-server-static\/\/.\/hotel.731d1960.css",
                "external.figurepartlist.txt": "https:\/\/" + window.location.host + "\/gamedata\/figuredata\/0",
                "flash.client.origin": "popup",
                "client.starting": GetClientStartingMsg(),
                "processlog.enabled": "1",
                "has.identity": "1",
                "avatareditor.promohabbos": "https:\/\/" + window.location.host + "\/api\/public\/lists\/hotlooks",
                "productdata.load.url": "http:\/\/" + window.location.host + "\/gamedata\/productdata\/0",
                "client.starting.revolving": GetClientResolvingMsg(),
                "external.override.variables.txt": "https:\/\/" + window.location.host + "\/gamedata\/override\/external_override_variables\/0",
                "spaweb": "1",
                "supersonic_application_key": "2c5f4695",
                "connection.info.host": GetConnectionHost(),
                "sso.ticket": clientsrc.substring(clientsrc.lastIndexOf("/") + 1),
                "client.notify.cross.domain": "0",
                //"account_id": window.session["accountId"],
                "flash.client.url": "\/\/images.habbo.com\/gordon\/PRODUCTION-202101051143-881384628\/",
                //"unique_habbo_id": window.session["uniqueId"],
            };
            var params = {
                "base": flashvars["flash.client.url"],
                "allowScriptAccess": "always",
                "menu": "false",
                "wmode": "opaque"
            };
            document.getElementById("hotel-c1-clientv2").outerHTML = '<div id="hotel-c1-clientv2"></div>';
            swfobject.embedSWF('https://images.habbo.com/gordon/PRODUCTION-202101051143-881384628/Habbo.swf', 'hotel-c1-clientv2', '100%', '100%', '11.1.0', '', flashvars, params, null, null);
            client_injected = true;
            RemoveInterstitials();
        }
    } catch {
        setTimeout(InjectClient, 100);
    }
}

function GetConnectionHost() {
    var hotel_loc = window.location.host;
    hotel_loc = hotel_loc.substring(hotel_loc.lastIndexOf(".") + 1);
    if (hotel_loc == "com") {
        hotel_loc = "us";
    }
    return "game-" + hotel_loc + ".habbo.com";
}

function GetConnectionPort() {
    var hotel_loc = window.location.host;
    hotel_loc = hotel_loc.substring(hotel_loc.lastIndexOf(".") + 1);
    if (hotel_loc == "com") {
        return "38101,843";
    } else {
        return "30000,843";
    }
}

function GetClientStartingMsg() {
    var hotel_loc = window.location.host;
    hotel_loc = hotel_loc.substring(hotel_loc.lastIndexOf(".") + 1);
    if (hotel_loc == "es") {
        return "¡Por favor, espera! Habbo se está cargando";
    } else {
        return "Please wait! Habbo is starting up";
    }
}
function GetClientResolvingMsg() {
    var hotel_loc = window.location.host;
    hotel_loc = hotel_loc.substring(hotel_loc.lastIndexOf(".") + 1);
    if (hotel_loc == "es") {
        return "Para ciencia, ¡Tú, monstruito!\/Cargando mensajes divertidos... Por favor, espera.\/¿Te apetecen salchipapas con qué?\/Sigue al pato amarillo.\/El tiempo es sólo una ilusión.\/¡¿Todavía estamos aquí?!\/Me gusta tu camiseta.\/Mira a la izquierda. Mira a la derecha. Parpadea dos veces. ¡Ta-chán!\/No eres tú, soy yo.\/Shhh! Estoy intentando pensar.\/Cargando el universo de píxeles.";
    } else {
        return "For science, you monster/Loading funny message... please wait./Would you like fries with that?/Follow the yellow duck./Time is just an illusion./Are we there yet?!/I like your t-shirt./Look left. Look right. Blink twice. Ta da!/It\'s not you, it\'s me./Shhh! I\'m trying to think here./Loading pixel universe.";
    }
}

function RemoveInterstitials() {
    var habbo_interstitials = Array.prototype.slice.call(document.getElementsByTagName("habbo-interstitial"));
    for (var i = 0, l = habbo_interstitials.length; i < l; i++) {
        habbo_interstitials[i].remove();
    }
}