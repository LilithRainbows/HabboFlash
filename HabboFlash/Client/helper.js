require("./client.js")

HelperTimer = setInterval(function() {

    var HabboAds = Array.prototype.slice.call(document.getElementsByTagName("habbo-ad-double-click"))
    for (var i = 0, l = HabboAds.length; i < l; i++) {
        HabboAds[i].remove()
    }

    var HabboNativeButton = document.getElementsByTagName("habbo-hotel-native-button")[0]
    if (HabboNativeButton) {
        HabboNativeButton.remove()
    }

    var RoomEnterButton = document.getElementsByClassName("room__enter-button")[0]
    if (RoomEnterButton) {
        if (RoomEnterButton.href.includes("/hotel?")) {
            RoomEnterButton.href = RoomEnterButton.href.replace("hotel?", "hotelv2?")
            RoomEnterButton.addEventListener("click", function() {
                var RoomID = this.href.substring(this.href.lastIndexOf("?room=") + 6)
                console.log("Requested room link: " + RoomID)
                OpenRoomLink(RoomID)
            });
        }
    }

    var HabboGroups = Array.prototype.slice.call(document.querySelectorAll('[habbo-flash-href]'))
    for (var i = 0, l = HabboGroups.length; i < l; i++) {
        var HabboGroup = HabboGroups[i]
        HabboGroup.removeAttribute("habbo-flash-href")
        if (HabboGroup.href.includes("/hotel?")) {
            HabboGroup.href = HabboGroup.href.replace("hotel?", "hotelv2?")
            HabboGroup.addEventListener("click", function() {
                var RoomID = this.href.substring(this.href.lastIndexOf("?room=") + 6)
                console.log("Requested room link: " + RoomID)
                OpenRoomLink(RoomID)
            });
        }
    }

}, 100);

function OpenRoomLink(RoomID) {
    try {
        if (typeof RoomID == "number") {
            window.HabboFlashClient.flashInterface.openlink("navigator/goto/" + RoomID)
        } else {
            window.MainApp.postMessage({
                call: "open-room",
                target: RoomID
            })
        }
    } catch {
        console.log("Room link error: " + RoomID)
    }
}