function require(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           // <-- This is the key
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}
require("scripts/libs/jquery.fontpicker.min.js");
require("scripts/libs/jscolor.min.js");
require("scripts/app/clipboard-display.js");
require("scripts/app/stopwatch.js");
