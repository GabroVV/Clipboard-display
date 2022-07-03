function require(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,          
        success: function () {
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}
let localStorage = window.localStorage;

require("https://unpkg.com/sweetalert/dist/sweetalert.min.js")
require("scripts/libs/jscolor.min.js");
require("scripts/libs/jquery.fontpicker.min.js");
require("scripts/app/sidebar.js");
require("scripts/app/other-options.js");
require("scripts/app/page-list.js");
require("scripts/app/navigation.js");
require("scripts/app/clipboard-inserter.js");
require("scripts/app/text-options.js");
require("scripts/app/character-count.js");
require("scripts/app/page-deletion.js");
require("scripts/app/uncategorized-functions.js");
require("scripts/app/stopwatch.js");
require("scripts/app/serialization.js");
