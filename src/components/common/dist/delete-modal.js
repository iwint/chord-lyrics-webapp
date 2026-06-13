"use strict";
exports.__esModule = true;
var spinner_icon_1 = require("@/assets/icons/spinner-icon");
var use_delete_modal_1 = require("@/hooks/use-delete-modal");
var react_1 = require("react");
var react_promise_tracker_1 = require("react-promise-tracker");
var button_1 = require("../ui/button");
var modal_1 = require("./modal");
var DeleteModal = function (_a) {
    var handleDelete = _a.handleDelete;
    var _b = use_delete_modal_1["default"](), isOpen = _b.isOpen, onClose = _b.onClose;
    var promiseInProgress = react_promise_tracker_1.usePromiseTracker().promiseInProgress;
    return (react_1["default"].createElement(modal_1["default"], { className: "w-[30%]", title: "Are you sure you want to delete?", description: "This action will not reversible", open: isOpen, close: onClose },
        react_1["default"].createElement("div", { className: "flex w-full items-center justify-end gap-2" },
            react_1["default"].createElement(button_1.Button, { variant: 'outline', size: 'sm', onClick: onClose }, "Cancel"),
            react_1["default"].createElement(button_1.Button, { onClick: function () { return react_promise_tracker_1.trackPromise(handleDelete()); }, variant: 'destructive', size: 'sm' },
                promiseInProgress ? (react_1["default"].createElement(spinner_icon_1.Icons.spinner, { className: "mr-2 h-4 w-4 animate-spin" })) : null,
                "Delete"))));
};
exports["default"] = DeleteModal;
