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

    var RoomEnterButton = document.querySelectorAll('.room__enter-button:not(.modded)')[0]
    if (RoomEnterButton) {
        RoomEnterButton.className += " modded"
        if (RoomEnterButton.href.includes("/hotel?")) {
            RoomEnterButton.href = RoomEnterButton.href.replace("hotel?", "hotelv2?")
            RoomEnterButton.addEventListener("click", function() {
                var RoomID = this.href.substring(this.href.lastIndexOf("?room=") + 6)
                console.log("Requested room link: " + RoomID)
                OpenRoomLink(RoomID)
            });
        }
    }

    var HabboNewsRooms = Array.from(document.querySelectorAll('.news-header__link.news-header__banner:not(.modded)'))
    HabboNewsRooms = Array.prototype.concat(HabboNewsRooms, Array.from(document.querySelectorAll('.news-header__link.news-header__wrapper:not(.modded)')))
    HabboNewsRooms = Array.prototype.slice.call(HabboNewsRooms)
    for (var i = 0, l = HabboNewsRooms.length; i < l; i++) {
        var HabboNewsRoom = HabboNewsRooms[i]
        HabboNewsRoom.className += " modded"
        if (HabboNewsRoom.href.includes("/hotel?")) {
            HabboNewsRoom.href = HabboNewsRoom.href.replace("hotel?", "hotelv2?")
            HabboNewsRoom.addEventListener("click", function() {
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