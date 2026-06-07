'use client';
"use strict";
exports.__esModule = true;
var toaster_1 = require("@/components/ui/toaster");
var tooltip_1 = require("@/components/ui/tooltip");
var react_query_1 = require("@tanstack/react-query");
var react_query_devtools_1 = require("@tanstack/react-query-devtools");
var react_1 = require("react");
function Providers(_a) {
    var children = _a.children;
    var queryClient = react_1["default"].useState(function () { return new react_query_1.QueryClient(); })[0];
    return (react_1["default"].createElement(react_query_1.QueryClientProvider, { client: queryClient },
        react_1["default"].createElement(tooltip_1.TooltipProvider, { delayDuration: 0 },
            react_1["default"].createElement(react_query_devtools_1.ReactQueryDevtools, { initialIsOpen: false, buttonPosition: "bottom-left" }),
            react_1["default"].createElement(toaster_1.Toaster, null),
            children)));
}
exports["default"] = Providers;
