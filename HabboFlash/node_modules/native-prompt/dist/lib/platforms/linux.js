"use strict";
var child_process_1 = require("child_process");
var path_1 = require("path");
module.exports = function (title, body, mask, defaultText) {
    if (defaultText === void 0) { defaultText = ""; }
    return new Promise(function (resolve) {
        var boxSpawner = child_process_1.spawn("bash", [path_1.resolve(__dirname, "../../../", "./native/linux/default.sh").replace("app.asar", "app.asar.unpacked"), title, body, defaultText, mask === true ? "--hide-text" : ""]);
        boxSpawner.stdout.on('data', function (d) {
            var data = d.toString();
            if (data)
                resolve(data.trim() || null);
        });
        boxSpawner.on('exit', function () { return resolve(null); });
    });
};
