'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.SignInForm = void 0;
var spinner_icon_1 = require("@/assets/icons/spinner-icon");
var utils_1 = require("@/lib/utils");
var navigation_1 = require("next/navigation");
var React = require("react");
var button_1 = require("../ui/button");
var input_1 = require("../ui/input");
var label_1 = require("../ui/label");
var use_toast_1 = require("../ui/use-toast");
var react_redux_1 = require("react-redux");
var authSlice_1 = require("@/lib/store/slices/authSlice");
var authApi_1 = require("@/lib/store/api/authApi");
var link_1 = require("next/link");
function SignInForm(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var router = navigation_1.useRouter();
    var toast = use_toast_1.useToast().toast;
    var dispatch = react_redux_1.useDispatch();
    var _b = authApi_1.useSignInMutation(), signIn = _b[0], isLoading = _b[1].isLoading;
    function onSubmit(formData) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, res, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = formData.get('email');
                        password = formData.get('password');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, signIn({ email: email, password: password }).unwrap()];
                    case 2:
                        res = _a.sent();
                        data = res === null || res === void 0 ? void 0 : res.data;
                        if (data === null || data === void 0 ? void 0 : data.access_token) {
                            dispatch(authSlice_1.setCredentials({
                                user: data,
                                token: data.access_token
                            }));
                            toast({ title: 'Welcome back!' });
                            router.replace('/');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        toast({
                            variant: 'destructive',
                            title: 'Login failed',
                            description: (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || 'Invalid credentials'
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("div", { className: "mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]" },
        React.createElement(button_1.Button, { asChild: true, variant: 'ghost', className: 'absolute right-4 top-4 md:right-8 md:top-8' },
            React.createElement(link_1["default"], { href: "/sign-up" }, "Register")),
        React.createElement("div", { className: "flex flex-col space-y-2 text-start" },
            React.createElement("h1", { className: "text-2xl font-semibold tracking-tight text-primary" }, "Sign in"),
            React.createElement("p", { className: "text-sm text-muted-foreground" }, "Enter your details to sign in to your account")),
        React.createElement("div", __assign({ className: utils_1.cn('grid gap-6', className) }, props),
            React.createElement("form", { action: onSubmit },
                React.createElement("div", { className: "grid gap-4" },
                    React.createElement("div", { className: "grid gap-1" },
                        React.createElement(label_1.Label, { className: "sr-only", htmlFor: "email" }, "Email"),
                        React.createElement(input_1.Input, { id: "email", name: "email", placeholder: "name@example.com", type: "email", autoCapitalize: "none", autoComplete: "email", autoCorrect: "off", disabled: isLoading, required: true })),
                    React.createElement("div", { className: "grid gap-1" },
                        React.createElement(label_1.Label, { className: "sr-only", htmlFor: "password" }, "Password"),
                        React.createElement(input_1.Input, { id: "password", name: "password", placeholder: "password", type: "password", autoCapitalize: "none", autoComplete: "current-password", autoCorrect: "off", disabled: isLoading, required: true })),
                    React.createElement(button_1.Button, { disabled: isLoading, className: "bg-primary hover:bg-primary/90" },
                        isLoading && (React.createElement(spinner_icon_1.Icons.spinner, { className: "mr-2 h-4 w-4 animate-spin" })),
                        "Sign in"))))));
}
exports.SignInForm = SignInForm;
