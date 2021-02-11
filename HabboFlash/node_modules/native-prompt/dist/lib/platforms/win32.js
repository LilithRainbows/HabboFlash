"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayMask = exports.displayBox = void 0;
var child_process_1 = require("child_process");
var path_1 = require("path");
function displayBox(title, body, defaultText) {
    if (defaultText === void 0) { defaultText = ""; }
    return new Promise(function (resolve) {
        var boxSpawner = child_process_1.spawn("cscript", [path_1.resolve(__dirname, '../../../', 'native/win32/default.vbs').replace("app.asar", "app.asar.unpacked"), title, body, defaultText]);
        boxSpawner.stdout.on('data', function (d) {
            var data = d.toString();
            if (data.startsWith("RETURN"))
                resolve(data.replace("RETURN", "").trim() || null);
        });
        boxSpawner.on('exit', function () { return resolve(null); });
    });
}
exports.displayBox = displayBox;
function displayMask(title, body, defaultText) {
    if (defaultText === void 0) { defaultText = ""; }
    return new Promise(function (resolve) {
        var boxSpawner = child_process_1.spawn("powershell", ["-ExecutionPolicy", "Bypass", "-File", path_1.resolve(__dirname, '../../../', 'native/win32/mask.ps1').replace("app.asar", "app.asar.unpacked"), title, body, defaultText]);
        boxSpawner.stdout.on('data', function (d) {
            var data = d.toString();
            if (data.startsWith("RETURN"))
                resolve(data.replace("RETURN", "").trim() || null);
        });
        boxSpawner.on('exit', function () { return resolve(null); });
    });
}
exports.displayMask = displayMask;
