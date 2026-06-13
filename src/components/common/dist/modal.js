'use client';
"use strict";
exports.__esModule = true;
var utils_1 = require("@/lib/utils");
var react_1 = require("react");
var dialog_1 = require("../ui/dialog");
var Modal = function (_a) {
    var children = _a.children, description = _a.description, title = _a.title, open = _a.open, close = _a.close, className = _a.className;
    return (react_1["default"].createElement(dialog_1.Dialog, { modal: true, onOpenChange: close, open: open },
        react_1["default"].createElement(dialog_1.DialogContent, { className: utils_1.cn(className ? className : 'w-[80%]') },
            react_1["default"].createElement(dialog_1.DialogHeader, null,
                react_1["default"].createElement(dialog_1.DialogTitle, null, title),
                react_1["default"].createElement(dialog_1.DialogDescription, null, description)),
            children)));
};
exports["default"] = Modal;
