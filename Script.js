var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://images.habbo.com/swfobject/2.3b/swfobject.js';
document.head.appendChild(script);

var clientsrc = document.getElementById("hotel-client").getAttribute("src")

var flashvars = {
"external.texts.txt":"https:\/\/www.habbo.es\/gamedata\/external_flash_texts\/0",
"connection.info.port":"30000,843",
"furnidata.load.url":"http:\/\/www.habbo.es\/gamedata\/furnidata_xml\/0",
"external.variables.txt":"https:\/\/www.habbo.es\/gamedata\/external_variables\/0",
"client.allow.cross.domain":"1",
"url.prefix":"https:\/\/www.habbo.es",
"external.override.texts.txt":"https:\/\/www.habbo.es\/gamedata\/override\/external_flash_override_texts\/0",
"supersonic_custom_css":"https:\/\/images.habbo.com\/game-data-server-static\/\/.\/hotel.731d1960.css",
"external.figurepartlist.txt":"https:\/\/www.habbo.es\/gamedata\/figuredata\/0",
"flash.client.origin":"popup",
"client.starting":"\u00A1Por favor, espera! Habbo se est\u00E1 cargando",
"processlog.enabled":"1",
"has.identity":"1",
"avatareditor.promohabbos":"https:\/\/www.habbo.es\/api\/public\/lists\/hotlooks",
"productdata.load.url":"http:\/\/www.habbo.es\/gamedata\/productdata\/0",
"client.starting.revolving":"Para ciencia, \u00A1T\u00FA, monstruito!\/Cargando mensajes divertidos... Por favor, espera.\/\u00BFTe apetecen salchipapas con qu\u00E9?\/Sigue al pato amarillo.\/El tiempo es s\u00F3lo una ilusi\u00F3n.\/\u00A1\u00BFTodav\u00EDa estamos aqu\u00ED?!\/Me gusta tu camiseta.\/Mira a la izquierda. Mira a la derecha. Parpadea dos veces. \u00A1Ta-ch\u00E1n!\/No eres t\u00FA, soy yo.\/Shhh! Estoy intentando pensar.\/Cargando el universo de p\u00EDxeles.",
"external.override.variables.txt":"https:\/\/www.habbo.es\/gamedata\/override\/external_override_variables\/0",
"spaweb":"1",
"supersonic_application_key":"2c5f4695",
"connection.info.host":"game-es.habbo.com",
"sso.ticket":clientsrc.substring(clientsrc.lastIndexOf("/")+1),
"client.notify.cross.domain":"0",
"account_id":window.session["accountId"],
"flash.client.url":"\/\/images.habbo.com\/gordon\/PRODUCTION-202101051143-881384628\/",
"unique_habbo_id":window.session["uniqueId"],
};

var params = {
"base" : flashvars["flash.client.url"],
"allowScriptAccess" : "always",
"menu" : "false",
"wmode": "opaque"
};

document.getElementsByTagName("habbo-client-reload")[0].remove();
document.getElementsByClassName("hotel")[0].remove();
document.getElementsByClassName("client__close")[0].remove();

swfobject.embedSWF('https://images.habbo.com/gordon/PRODUCTION-202101051143-881384628/Habbo.swf', 'hotel-client', '100%', '100%', '11.1.0', '', flashvars, params, null, null);