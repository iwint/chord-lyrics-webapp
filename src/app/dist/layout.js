"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var providers_1 = require("@/providers");
var google_1 = require("next/font/google");
require("./globals.css");
var inter = google_1.Inter({ subsets: ['latin'] });
exports.metadata = {
    title: 'Chord Lyrics',
    description: ''
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en" },
        React.createElement("body", { className: inter.className },
            React.createElement(providers_1["default"], null, children))));
}
exports["default"] = RootLayout;
