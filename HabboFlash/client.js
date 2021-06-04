var ClientInjected = false
var SSOToken = null
var ProductVersion = null
InjectSwfObjectJS()
InjectHabboAPIJS()
InjectClient()

function InjectClient() {
    RemoveInterstitials()
    try {
        if (document.getElementById("hotel-c1-clientv2").getAttribute("type") == "application/x-shockwave-flash") {
            ClientInjected = true
        }
        if (ClientInjected == false) {
            if (SSOToken == null) {
                var clientsrc = document.getElementById("hotel-c1-clientv2").getAttribute("src")
                SSOToken = clientsrc.substring(clientsrc.lastIndexOf("/") + 1)
                document.getElementById("hotel-c1-clientv2").outerHTML = '<div id="hotel-c1-clientv2"></div>'
            }
            if (ProductVersion == null) {
                ProductVersion = GetProductionVersion()
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
                "wmode": "opaque"
            }
            swfobject.embedSWF('https://images.habbo.com/Habbo.swf', 'hotel-c1-clientv2', '100%', '100%', '11.1.0', '', flashvars, params, null, null)
            window.HabboFlashClient.init(document.getElementById("hotel-c1-clientv2"))
            RemoveInterstitials()
        }
    } catch (ex) {
        setTimeout(InjectClient, 100)
    }
}

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

function ShowDisconnectedScreen() {
    var disconnected_message = "Disconnected!"
    var reload_message = "Reload"
    var HotelHost = window.location.host
    HotelHost = HotelHost.substring(HotelHost.lastIndexOf(".") + 1)
    if (HotelHost == "es") {
        disconnected_message = "¡Desconectado!"
        reload_message = "Recargar"
    }
    document.getElementsByTagName("habbo-v2-client")[0].insertAdjacentHTML("afterend",'<habbo-client-reload><h1>' + disconnected_message + '</h1><button onclick="location.reload();" class="client-v2-reload__button">' + reload_message + '</button><br><button onclick="document.getElementsByTagName(&#x27;habbo-client-reload&#x27;)[0].remove();" class="modal__close"></button></habbo-client-reload>')
}

function RemoveInterstitials() {
    var HabboInterstitials = Array.prototype.slice.call(document.getElementsByTagName("habbo-interstitial"))
    for (var i = 0, l = HabboInterstitials.length; i < l; i++) {
        HabboInterstitials[i].remove()
    }
}

function InjectSwfObjectJS() {
    if (typeof swfobject == "undefined") {
        var swfobject=function(){var e,t,n,i,a,r,o="undefined",l="object",s="Shockwave Flash",d="application/x-shockwave-flash",f="SWFObjectExprInst",c="onreadystatechange",u=window,p=document,v=navigator,y=!1,h=[],m=[],g=[],w=[],b=!1,E=!1,C=!0,A=!1,S=function(){var e=typeof p.getElementById!=o&&typeof p.getElementsByTagName!=o&&typeof p.createElement!=o,t=v.userAgent.toLowerCase(),n=v.platform.toLowerCase(),i=/win/.test(n||t),a=/mac/.test(n||t),r=!!/webkit/.test(t)&&parseFloat(t.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")),f="Microsoft Internet Explorer"===v.appName,c=[0,0,0],h=null;if(typeof v.plugins!=o&&typeof v.plugins[s]==l)(h=v.plugins[s].description)&&typeof v.mimeTypes!=o&&v.mimeTypes[d]&&v.mimeTypes[d].enabledPlugin&&(y=!0,f=!1,h=h.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),c[0]=V(h.replace(/^(.*)\..*$/,"$1")),c[1]=V(h.replace(/^.*\.(.*)\s.*$/,"$1")),c[2]=/[a-zA-Z]/.test(h)?V(h.replace(/^.*[a-zA-Z]+(.*)$/,"$1")):0);else if(typeof u.ActiveXObject!=o)try{var m=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");m&&(h=m.GetVariable("$version"))&&(f=!0,c=[V((h=h.split(" ")[1].split(","))[0]),V(h[1]),V(h[2])])}catch(e){}return{w3:e,pv:c,wk:r,ie:f,win:i,mac:a}}();S.w3&&((typeof p.readyState!=o&&("complete"===p.readyState||"interactive"===p.readyState)||typeof p.readyState==o&&(p.getElementsByTagName("body")[0]||p.body))&&T(),b||(typeof p.addEventListener!=o&&p.addEventListener("DOMContentLoaded",T,!1),S.ie&&(p.attachEvent(c,function e(){"complete"==p.readyState&&(p.detachEvent(c,e),T())}),u==top&&function e(){if(!b){try{p.documentElement.doScroll("left")}catch(t){return void setTimeout(e,0)}T()}}()),S.wk&&function e(){b||(/loaded|complete/.test(p.readyState)?T():setTimeout(e,0))}()));function T(){if(!b&&document.getElementsByTagName("body")[0]){try{var e,t=R("span");t.style.display="none",(e=p.getElementsByTagName("body")[0].appendChild(t)).parentNode.removeChild(e),e=null,t=null}catch(e){return}b=!0;for(var n=h.length,i=0;i<n;i++)h[i]()}}function N(e){b?e():h[h.length]=e}function k(){var e=m.length;if(e>0)for(var t=0;t<e;t++){var n=m[t].id,i=m[t].callbackFn,a={success:!1,id:n};if(S.pv[0]>0){var r=P(n);if(r)if(!D(m[t].swfVersion)||S.wk&&S.wk<312)if(m[t].expressInstall&&I()){var l={};l.data=m[t].expressInstall,l.width=r.getAttribute("width")||"0",l.height=r.getAttribute("height")||"0",r.getAttribute("class")&&(l.styleclass=r.getAttribute("class")),r.getAttribute("align")&&(l.align=r.getAttribute("align"));for(var s={},d=r.getElementsByTagName("param"),f=d.length,c=0;c<f;c++)"movie"!=d[c].getAttribute("name").toLowerCase()&&(s[d[c].getAttribute("name")]=d[c].getAttribute("value"));L(l,s,n,i)}else O(r),i&&i(a);else W(n,!0),i&&(a.success=!0,a.ref=B(n),a.id=n,i(a))}else if(W(n,!0),i){var u=B(n);u&&typeof u.SetVariable!=o&&(a.success=!0,a.ref=u,a.id=u.id),i(a)}}}function B(e){var t=null,n=P(e);return n&&"OBJECT"===n.nodeName.toUpperCase()&&(t=typeof n.SetVariable!==o?n:n.getElementsByTagName(l)[0]||n),t}function I(){return!E&&D("6.0.65")&&(S.win||S.mac)&&!(S.wk&&S.wk<312)}function L(a,r,l,s){var d=P(l);if(l=U(l),E=!0,n=s||null,i={success:!1,id:l},d){"OBJECT"==d.nodeName.toUpperCase()?(e=j(d),t=null):(e=d,t=l),a.id=f,(typeof a.width==o||!/%$/.test(a.width)&&V(a.width)<310)&&(a.width="310"),(typeof a.height==o||!/%$/.test(a.height)&&V(a.height)<137)&&(a.height="137");var c=S.ie?"ActiveX":"PlugIn",v="MMredirectURL="+encodeURIComponent(u.location.toString().replace(/&/g,"%26"))+"&MMplayerType="+c+"&MMdoctitle="+encodeURIComponent(p.title.slice(0,47)+" - Flash Player Installation");if(typeof r.flashvars!=o?r.flashvars+="&"+v:r.flashvars=v,S.ie&&4!=d.readyState){var y=R("div");l+="SWFObjectNew",y.setAttribute("id",l),d.parentNode.insertBefore(y,d),d.style.display="none",$(d)}x(a,r,l)}}function O(e){if(S.ie&&4!=e.readyState){e.style.display="none";var t=R("div");e.parentNode.insertBefore(t,e),t.parentNode.replaceChild(j(e),t),$(e)}else e.parentNode.replaceChild(j(e),e)}function j(e){var t=R("div");if(S.win&&S.ie)t.innerHTML=e.innerHTML;else{var n=e.getElementsByTagName(l)[0];if(n){var i=n.childNodes;if(i)for(var a=i.length,r=0;r<a;r++)1==i[r].nodeType&&"PARAM"==i[r].nodeName||8==i[r].nodeType||t.appendChild(i[r].cloneNode(!0))}}return t}function x(e,t,n){var i,a=P(n);if(n=U(n),S.wk&&S.wk<312)return i;if(a){var r,s,f,c=S.ie?R("div"):R(l);for(f in typeof e.id==o&&(e.id=n),t)t.hasOwnProperty(f)&&"movie"!==f.toLowerCase()&&F(c,f,t[f]);for(r in S.ie&&(c=function(e,t){var n=R("div");return n.innerHTML="<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='"+e+"'>"+t+"</object>",n.firstChild}(e.data,c.innerHTML)),e)e.hasOwnProperty(r)&&("styleclass"===(s=r.toLowerCase())?c.setAttribute("class",e[r]):"classid"!==s&&"data"!==s&&c.setAttribute(r,e[r]));S.ie?g[g.length]=e.id:(c.setAttribute("type",d),c.setAttribute("data",e.data)),a.parentNode.replaceChild(c,a),i=c}return i}function F(e,t,n){var i=R("param");i.setAttribute("name",t),i.setAttribute("value",n),e.appendChild(i)}function $(e){var t=P(e);t&&"OBJECT"==t.nodeName.toUpperCase()&&(S.ie?(t.style.display="none",function e(){if(4==t.readyState){for(var n in t)"function"==typeof t[n]&&(t[n]=null);t.parentNode.removeChild(t)}else setTimeout(e,10)}()):t.parentNode.removeChild(t))}function M(e){return e&&e.nodeType&&1===e.nodeType}function U(e){return M(e)?e.id:e}function P(e){if(M(e))return e;var t=null;try{t=p.getElementById(e)}catch(e){}return t}function R(e){return p.createElement(e)}function V(e){return parseInt(e,10)}function D(e){e+="";var t=S.pv,n=e.split(".");return n[0]=V(n[0]),n[1]=V(n[1])||0,n[2]=V(n[2])||0,t[0]>n[0]||t[0]==n[0]&&t[1]>n[1]||t[0]==n[0]&&t[1]==n[1]&&t[2]>=n[2]}function H(e,t,n,i){var l=p.getElementsByTagName("head")[0];if(l){var s="string"==typeof n?n:"screen";if(i&&(a=null,r=null),!a||r!=s){var d=R("style");d.setAttribute("type","text/css"),d.setAttribute("media",s),a=l.appendChild(d),S.ie&&typeof p.styleSheets!=o&&p.styleSheets.length>0&&(a=p.styleSheets[p.styleSheets.length-1]),r=s}a&&(typeof a.addRule!=o?a.addRule(e,t):typeof p.createTextNode!=o&&a.appendChild(p.createTextNode(e+" {"+t+"}")))}}function W(e,t){if(C){var n=t?"visible":"hidden",i=P(e);b&&i?i.style.visibility=n:"string"==typeof e&&H("#"+e,"visibility:"+n)}}function G(e){return null!=/[\\\"<>\.;]/.exec(e)&&typeof encodeURIComponent!=o?encodeURIComponent(e):e}h[0]=function(){y?function(){var e=p.getElementsByTagName("body")[0],t=R(l);t.setAttribute("style","visibility: hidden;"),t.setAttribute("type",d);var n=e.appendChild(t);if(n){var i=0;!function a(){if(typeof n.GetVariable!=o)try{var r=n.GetVariable("$version");r&&(r=r.split(" ")[1].split(","),S.pv=[V(r[0]),V(r[1]),V(r[2])])}catch(e){S.pv=[8,0,0]}else if(i<10)return i++,void setTimeout(a,10);e.removeChild(t),n=null,k()}()}else k()}():k()};S.ie&&window.attachEvent("onunload",function(){for(var e=w.length,t=0;t<e;t++)w[t][0].detachEvent(w[t][1],w[t][2]);for(var n=g.length,i=0;i<n;i++)$(g[i]);for(var a in S)S[a]=null;for(var r in S=null,swfobject)swfobject[r]=null;swfobject=null});return{registerObject:function(e,t,n,i){if(S.w3&&e&&t){var a={};a.id=e,a.swfVersion=t,a.expressInstall=n,a.callbackFn=i,m[m.length]=a,W(e,!1)}else i&&i({success:!1,id:e})},getObjectById:function(e){if(S.w3)return B(e)},embedSWF:function(e,t,n,i,a,r,s,d,f,c){var u=U(t),p={success:!1,id:u};S.w3&&!(S.wk&&S.wk<312)&&e&&t&&n&&i&&a?(W(u,!1),N(function(){n+="",i+="";var v={};if(f&&typeof f===l)for(var y in f)v[y]=f[y];v.data=e,v.width=n,v.height=i;var h={};if(d&&typeof d===l)for(var m in d)h[m]=d[m];if(s&&typeof s===l)for(var g in s)if(s.hasOwnProperty(g)){var w=A?encodeURIComponent(g):g,b=A?encodeURIComponent(s[g]):s[g];typeof h.flashvars!=o?h.flashvars+="&"+w+"="+b:h.flashvars=w+"="+b}if(D(a)){var E=x(v,h,t);v.id==u&&W(u,!0),p.success=!0,p.ref=E,p.id=E.id}else{if(r&&I())return v.data=r,void L(v,h,t,c);W(u,!0)}c&&c(p)})):c&&c(p)},switchOffAutoHideShow:function(){C=!1},enableUriEncoding:function(e){A=typeof e===o||e},ua:S,getFlashPlayerVersion:function(){return{major:S.pv[0],minor:S.pv[1],release:S.pv[2]}},hasFlashPlayerVersion:D,createSWF:function(e,t,n){return S.w3?x(e,t,n):void 0},showExpressInstall:function(e,t,n,i){S.w3&&I()&&L(e,t,n,i)},removeSWF:function(e){S.w3&&$(e)},createCSS:function(e,t,n,i){S.w3&&H(e,t,n,i)},addDomLoadEvent:N,addLoadEvent:function(e){if(typeof u.addEventListener!=o)u.addEventListener("load",e,!1);else if(typeof p.addEventListener!=o)p.addEventListener("load",e,!1);else if(typeof u.attachEvent!=o)!function(e,t,n){e.attachEvent(t,n),w[w.length]=[e,t,n]}(u,"onload",e);else if("function"==typeof u.onload){var t=u.onload;u.onload=function(){t(),e()}}else u.onload=e},getQueryParamValue:function(e){var t=p.location.search||p.location.hash;if(t){if(/\?/.test(t)&&(t=t.split("?")[1]),null==e)return G(t);for(var n=t.split("&"),i=0;i<n.length;i++)if(n[i].substring(0,n[i].indexOf("="))==e)return G(n[i].substring(n[i].indexOf("=")+1))}return""},expressInstallCallback:function(){if(E){var a=P(f);a&&e&&(a.parentNode.replaceChild(e,a),t&&(W(t,!0),S.ie&&(e.style.display="block")),n&&n(i)),E=!1}},version:"2.3"}}();
    }
}

function InjectHabboAPIJS() {
    if (typeof FlashExternalInterface == "undefined") {
        function initializeExternalInterfaces(){"use strict";window.HabboFlashClient.init(document.getElementById("flash-container"))}!function(){"use strict";window.MainApp={postMessage:function(n){window.parent.postMessage(n,"*")}}}(),function(){"use strict";var a=!1;window.FlashExternalInterface={},window.FlashExternalInterface.closeHabblet=function(n){window.MainApp.postMessage({call:"close-habblet",target:n})},window.FlashExternalInterface.disconnect=function(){window.MainApp.postMessage({call:"disconnect"})},window.FlashExternalInterface.heartBeat=function(){window.HabboFlashClient.started=!0,window.MainApp.postMessage({call:"heartbeat"})},window.FlashExternalInterface.legacyTrack=function(n,e,a){window.HabboFlashClient.started=!0,window.HabboTracking.track(n,e,a)},window.FlashExternalInterface.loadConversionTrackingFrame=function(){var n=window.flashvars.unique_habbo_id;$("#conversion-tracking").attr("src","/client/"+n+"/conversion-tracking")},window.FlashExternalInterface.logCrash=function(n){window.HabboFlashClient.started=!0,window.MainApp.postMessage({call:"disconnect"}),window.HabboWebApi.logCrash(n,function(n){n&&window.FlashExternalInterface.track("log","fatal","Can't log login crash: "+n)})},window.FlashExternalInterface.logDebug=function(n){window.FlashExternalInterface.track("log","debug",n)},window.FlashExternalInterface.logError=function(n){window.HabboFlashClient.started=!0,window.HabboWebApi.logError(n,function(n){n&&window.FlashExternalInterface.track("log","error","Can't log login error: "+n)})},window.FlashExternalInterface.logWarn=function(n){window.FlashExternalInterface.track("log","warn",n)},window.FlashExternalInterface.logLoginStep=function(n,e){window.FlashExternalInterface.track("clientload",n,e),window.HabboFlashClient.started=!0,a||"client.init.core.running"!==n||(a=!0,window.MainApp.postMessage({call:"hotel-ready"})),window.HabboWebApi.logLoginStep(n,e,function(n){n&&window.FlashExternalInterface.track("log","error","Can't log login step: "+n)})},window.FlashExternalInterface.logout=function(){window.MainApp.postMessage({call:"logout"})},window.FlashExternalInterface.openExternalPage=function(n){window.MainApp.postMessage({call:"open-external",target:n})},window.FlashExternalInterface.openHabblet=function(n,e){window.HabboTracking.track("openhablet","habletid",n);e=window.HabboPageTransformer.transformHabblet(n,e);window.FlashExternalInterface.openPage(e)},window.FlashExternalInterface.openWebHabblet=function(n,e){window.HabboTracking.track("openwebhablet",n,e);e=window.HabboPageTransformer.transformHabblet(n,e);window.FlashExternalInterface.openPage(e)},window.FlashExternalInterface.openPage=function(n){n=window.HabboPageTransformer.translate(n),window.HabboTracking.track("openpage","",n),window.MainApp.postMessage({call:"open-page",target:n})},window.FlashExternalInterface.track=function(n,e,a){window.HabboFlashClient.started=!0,window.HabboTracking.track(n,e,a)},window.FlashExternalInterface.updateFigure=function(n){window.MainApp.postMessage({call:"update-figure",target:n})},window.FlashExternalInterface.updateName=function(n){window.MainApp.postMessage({call:"update-name",target:n})},window.FlashExternalInterface.openMinimail=function(n){window.HabboTracking.track("minimail","open",n),window.MainApp.postMessage({call:"open-page",target:"/"})},window.FlashExternalInterface.openNews=function(){window.HabboTracking.track("news","open",""),window.MainApp.postMessage({call:"open-page",target:"/"})},window.FlashExternalInterface.openAvatars=function(){window.FlashExternalInterface.openPage("/settings/avatars")},window.FlashExternalInterface.showInterstitial=function(){window.MainApp.postMessage({call:"show-interstitial"})},window.FlashExternalInterface.subscriptionUpdated=function(n){window.MainApp.postMessage({call:"update-habbo-club",target:n})},window.FlashExternalInterface.updateBuildersClub=function(n){window.MainApp.postMessage({call:"update-builders-club",target:n})}}(),function(){"use strict";window.GameClientExternalInterface={},window.GameClientExternalInterface.disconnect=function(){window.MainApp.postMessage({call:"disconnect"})},window.GameClientExternalInterface.heartBeat=function(){window.MainApp.postMessage({call:"heartbeat"})},window.GameClientExternalInterface.loadConversionTrackingFrame=function(){var n=window.flashvars.unique_habbo_id;$("#conversion-tracking").attr("src","/client/"+n+"/conversion-tracking")},window.GameClientExternalInterface.logout=function(){window.MainApp.postMessage({call:"logout"})},window.GameClientExternalInterface.openExternalPage=function(n){window.MainApp.postMessage({call:"open-external",target:n})},window.GameClientExternalInterface.openPage=function(n){n=window.HabboPageTransformer.translate(n),window.HabboTracking.track("openpage","",n),window.MainApp.postMessage({call:"open-page",target:n})},window.GameClientExternalInterface.updateFigure=function(n){window.MainApp.postMessage({call:"update-figure",target:n})},window.GameClientExternalInterface.updateName=function(n){window.MainApp.postMessage({call:"update-name",target:n})},window.GameClientExternalInterface.openNews=function(){window.HabboTracking.track("news","open",""),window.MainApp.postMessage({call:"open-page",target:"/"})},window.GameClientExternalInterface.openAvatars=function(){window.GameClientExternalInterface.openPage("/settings/avatars")},window.GameClientExternalInterface.showInterstitial=function(){window.MainApp.postMessage({call:"show-interstitial"})},window.GameClientExternalInterface.subscriptionUpdated=function(n){window.MainApp.postMessage({call:"update-habbo-club",target:n})},window.GameClientExternalInterface.updateBuildersClub=function(n){window.MainApp.postMessage({call:"update-builders-club",target:n})}}(),function(){"use strict";function t(n){o.openlink(n)}var o;window.addEventListener("message",function(n){if(n.data){var e=n.data;switch("disconnect"==e.call&&ShowDisconnectedScreen(),console.log("Received event, with call: "+e.call),e.call){case"open-link":t(e.target);break;case"open-room":0<=(a=e.target).indexOf("r-hh")?o.openroom(a):t("navigator/goto/"+a);break;case"interstitial-status":a=e.target,window.HabboFlashClient.flashInterface.interstitialCompleted(a)}}var a},!1),window.HabboFlashClient={started:!1,init:function(n){window.HabboTracking.track("clientload","starting","Initalizing Habbo Client."),window.FlashExternalInterface.logLoginStep("web.view.start"),n||(console.error("Invalid FlashClient. Can't use JS->Flash interface."),window.FlashExternalInterface.logLoginStep("web.flash_missing")),o=n,window.HabboFlashClient.flashInterface=n,setTimeout(function(){window.HabboFlashClient.started||window.FlashExternalInterface.logLoginStep("client.init.swf.error")},3e4)}}}(),window.addEventListener("load",initializeExternalInterfaces,!1),function(){"use strict";var o={"/credits":"/shop","/creditflow":"/shop","/news":"/community/category/all/1"};window.HabboPageTransformer={translate:function(n){for(var e in o)if(o.hasOwnProperty(e)&&(a=n,t=e,0===a.indexOf(t)))return o[e];var a,t;return n},transformHabblet:function(n,e){return"/"+n}}}(),function(){"use strict";window.HabboShopApi={},window.HabboShopApi.checkOffer=function(n){var e;e=n,$.ajax({url:"/shopapi/checkoffer/",contentType:"application/json",dataType:"json",type:"GET"}).done(function(n){e(null,n)}).fail(function(n){e(n,null)})}}(),function(){"use strict";window.HabboTracking={track:function(n,e,a){var t,o;"client.init.room.ready"==e&&document.URL.includes("?room=")&&(o=document.URL.substring(document.URL.lastIndexOf("?room=")+6),window.HabboFlashClient.flashInterface.openlink("navigator/goto/"+o)),t=n,o=e,a=a,"console"in window&&"log"in console&&console.log("action = ["+t+"], label = ["+o+"], value = ["+a+"]"),"clientload"===n&&window.HabboTracking.gaTrack(n,e)},gaTrack:function(n,e){window._gaq&&window._gaq.push(["_trackEvent",n,e])}}}(),function(){"use strict";function t(n,e,a){$.ajax({url:n,contentType:"application/json",dataType:"json",type:"POST",data:JSON.stringify(e)}).done(function(n){a(null,n)}).fail(function(n){a(n,null)})}window.HabboWebApi={},window.HabboWebApi.checkName=function(n,e){t("/api/newuser/name/check",{name:n},e)},window.HabboWebApi.claimName=function(n,e){t("/api/newuser/name/select",{name:n},e)},window.HabboWebApi.saveFigure=function(n,e,a){t("/api/user/look/save",{figure:n,gender:e},a)},window.HabboWebApi.selectRoom=function(n,e){t("/api/newuser/room/select",{roomIndex:n},e)},window.HabboWebApi.logCrash=function(n,e){t("/api/log/crash",{message:n},e)},window.HabboWebApi.logError=function(n,e){t("/api/log/error",{message:n},e)},window.HabboWebApi.logLoginStep=function(n,e,a){t("/api/log/loginstep",{step:n,data:e},a)}}(),function(){"use strict";window.TargetedWebOffer={},window.TargetedWebOffer.checkOffer=function(){console.log("Checking for offer..."),window.HabboShopApi.checkOffer(function(n,e){return n?void window.HabboFlashClient.flashInterface.targetedWebOfferCheckFailed():void window.HabboFlashClient.flashInterface.targetedWebOfferCheckResponse(e)})}}();
    }
}