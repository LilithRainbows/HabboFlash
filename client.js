function InjectClient() {
    try {
        var hotelclient = document.getElementById("hotel-client")
        if (typeof(hotelclient) != 'undefined' && hotelclient != null) {
            if (typeof(window.session) !== "undefined" && window.session != null) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://images.habbo.com/swfobject/2.3b/swfobject.js';
                document.head.appendChild(script);
                var clientsrc = hotelclient.getAttribute("src")
                var flashvars = {
                    "external.texts.txt": "https:\/\/www.habbo.es\/gamedata\/external_flash_texts\/0",
                    "connection.info.port": "30000,843",
                    "furnidata.load.url": "http:\/\/www.habbo.es\/gamedata\/furnidata_xml\/0",
                    "external.variables.txt": "https:\/\/www.habbo.es\/gamedata\/external_variables\/0",
                    "client.allow.cross.domain": "1",
                    "url.prefix": "https:\/\/www.habbo.es",
                    "external.override.texts.txt": "https:\/\/www.habbo.es\/gamedata\/override\/external_flash_override_texts\/0",
                    "supersonic_custom_css": "https:\/\/images.habbo.com\/game-data-server-static\/\/.\/hotel.731d1960.css",
                    "external.figurepartlist.txt": "https:\/\/www.habbo.es\/gamedata\/figuredata\/0",
                    "flash.client.origin": "popup",
                    "client.starting": "¡Por favor, espera! Habbo se está cargando",
                    "processlog.enabled": "1",
                    "has.identity": "1",
                    "avatareditor.promohabbos": "https:\/\/www.habbo.es\/api\/public\/lists\/hotlooks",
                    "productdata.load.url": "http:\/\/www.habbo.es\/gamedata\/productdata\/0",
                    "client.starting.revolving": "Para ciencia, ¡Tú, monstruito!\/Cargando mensajes divertidos... Por favor, espera.\/¿Te apetecen salchipapas con qué?\/Sigue al pato amarillo.\/El tiempo es sólo una ilusión.\/¡¿Todavía estamos aquí?!\/Me gusta tu camiseta.\/Mira a la izquierda. Mira a la derecha. Parpadea dos veces. ¡Ta-chán!\/No eres tú, soy yo.\/Shhh! Estoy intentando pensar.\/Cargando el universo de píxeles.",
                    "external.override.variables.txt": "https:\/\/www.habbo.es\/gamedata\/override\/external_override_variables\/0",
                    "spaweb": "1",
                    "supersonic_application_key": "2c5f4695",
                    "connection.info.host": "game-es.habbo.com",
                    "sso.ticket": clientsrc.substring(clientsrc.lastIndexOf("/") + 1),
                    "client.notify.cross.domain": "0",
                    "account_id": window.session["accountId"],
                    "flash.client.url": "\/\/images.habbo.com\/gordon\/PRODUCTION-202101051143-881384628\/",
                    "unique_habbo_id": window.session["uniqueId"],
                };
                var params = {
                    "base": flashvars["flash.client.url"],
                    "allowScriptAccess": "always",
                    "menu": "false",
                    "wmode": "opaque"
                };
                document.getElementsByTagName("habbo-client-reload")[0].remove();
                document.getElementsByClassName("hotel")[0].remove();
                document.getElementsByClassName("client__close")[0].remove();
                swfobject.embedSWF('https://images.habbo.com/gordon/PRODUCTION-202101051143-881384628/Habbo.swf', 'hotel-client', '100%', '100%', '11.1.0', '', flashvars, params, null, null);
            } else {
                setTimeout(window.location.reload(true), 1000);
            }
        } else {
            setTimeout(InjectClient, 500);
        }
    } catch (error) {
        //console.error(error);
        setTimeout(InjectClient, 500);
    }
}
InjectClient();