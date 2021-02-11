"use strict";
var child_process_1 = require("child_process");
var path_1 = require("path");
module.exports = function (title, body, mask, defaultText) {
    if (defaultText === void 0) { defaultText = ""; }
    return new Promise(function (resolve) {
        var nativePath = mask ? "./native/darwin/mask.scpt" : "./native/darwin/default.scpt";
        var boxSpawner = child_process_1.spawn("osascript", [path_1.resolve(__dirname, "../../../", nativePath).replace("app.asar", "app.asar.unpacked"), title, body, defaultText]);
        boxSpawner.stdout.on('data', function (d) {
            var data = d.toString();
            if (data)
                resolve(data.trim().split("text returned:").pop() || null);
        });
        boxSpawner.on('exit', function () { return resolve(null); });
    });
};
