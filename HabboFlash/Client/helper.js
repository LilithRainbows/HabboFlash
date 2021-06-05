require("./client.js")

HelperTimer = setInterval(function() {
    var RoomEnterButton = document.getElementsByClassName("room__enter-button")[0]
    var HabboNativeButton = document.getElementsByTagName("habbo-hotel-native-button")[0]
    if (RoomEnterButton) {
        if (RoomEnterButton.href.includes("/hotel?")) {
            RoomEnterButton.href = RoomEnterButton.href.replace("hotel?", "hotelv2?")
            RoomEnterButton.addEventListener("click", function() {
                var RoomID = RoomEnterButton.href.substring(RoomEnterButton.href.lastIndexOf("?room=") + 6)
                console.log("Requested room link: " + RoomID)
                OpenRoomLink(RoomID)
            });
        }
    }
    if (HabboNativeButton) {
        HabboNativeButton.remove()
    }
}, 100);

function OpenRoomLink(RoomID) {
    try {
        window.HabboFlashClient.flashInterface.openlink("navigator/goto/" + RoomID)
    } catch {
        console.log("Room link error: " + RoomID)
    }
}