"use strict";
var SUPPORTED_PLATFORMS = ["win32", "linux", "darwin"];
module.exports = function () {
    if (!SUPPORTED_PLATFORMS.includes(process.platform))
        throw new Error("Platform '" + process.platform + "' is not currently supported.");
    else
        return process.platform;
};
