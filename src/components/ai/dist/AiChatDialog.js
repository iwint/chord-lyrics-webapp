'use client';
"use strict";
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
exports.__esModule = true;
exports.AiChatDialog = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var dialog_1 = require("@/components/ui/dialog");
var scroll_area_1 = require("@/components/ui/scroll-area");
var aiChatApi_1 = require("@/lib/store/api/aiChatApi");
var use_toast_1 = require("@/components/ui/use-toast");
var react_redux_1 = require("react-redux");
var utils_1 = require("@/lib/utils");
var react_markdown_1 = require("react-markdown");
var use_add_modal_1 = require("@/hooks/use-add-modal");
var lucide_react_2 = require("lucide-react");
function AiChatDialog(_a) {
    var _this = this;
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var _b = react_1.useState(''), input = _b[0], setInput = _b[1];
    var _c = react_1.useState(false), isListening = _c[0], setIsListening = _c[1];
    var scrollRef = react_1.useRef(null);
    var toast = use_toast_1.useToast().toast;
    var isAuthenticated = react_redux_1.useSelector(function (state) { return state.auth; }).isAuthenticated;
    var _d = aiChatApi_1.useGetChatHistoryQuery(undefined, {
        skip: !isAuthenticated || !open
    }), historyRes = _d.data, refetch = _d.refetch;
    var _e = aiChatApi_1.useSearchLyricsMutation(), searchLyrics = _e[0], isLoading = _e[1].isLoading;
    var _f = use_add_modal_1["default"](), openAddModal = _f.onOpen, setAddModalData = _f.setData, setEdit = _f.setEdit;
    var messages = (historyRes === null || historyRes === void 0 ? void 0 : historyRes.data) || [];
    react_1.useEffect(function () {
        if (open)
            refetch();
    }, [open, refetch]);
    react_1.useEffect(function () {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);
    var handleSend = function (text) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!text.trim())
                        return [2 /*return*/];
                    setInput('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, searchLyrics({ query: text }).unwrap()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    toast({ title: 'AI failed to respond', variant: 'destructive' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Web Speech API for Voice Input
    var toggleListening = function () {
        if (!('webkitSpeechRecognition' in window) &&
            !('SpeechRecognition' in window)) {
            toast({
                title: 'Voice input not supported in your browser',
                variant: 'destructive'
            });
            return;
        }
        if (isListening) {
            setIsListening(false);
            return; // The recognition stop will be handled if we stored the instance
        }
        var SpeechRecognition = window.SpeechRecognition ||
            window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = function () { return setIsListening(true); };
        recognition.onresult = function (event) {
            var transcript = event.results[0][0].transcript;
            setInput(function (prev) { return prev + (prev ? ' ' : '') + transcript; });
            setIsListening(false);
        };
        recognition.onerror = function () { return setIsListening(false); };
        recognition.onend = function () { return setIsListening(false); };
        recognition.start();
    };
    return (React.createElement(dialog_1.Dialog, { open: open, onOpenChange: onOpenChange },
        React.createElement(dialog_1.DialogContent, { className: "sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 overflow-hidden glass-card" },
            React.createElement(dialog_1.DialogHeader, { className: "p-4 border-b border-border/50 bg-primary/5 flex flex-row items-center justify-between" },
                React.createElement(dialog_1.DialogTitle, { className: "flex items-center gap-2" },
                    React.createElement("div", { className: "bg-primary/20 p-2 rounded-full" },
                        React.createElement(lucide_react_1.Bot, { className: "h-5 w-5 text-primary" })),
                    "AI Lyrics Assistant")),
            React.createElement(scroll_area_1.ScrollArea, { className: "flex-1 p-4 bg-background/40", ref: scrollRef },
                React.createElement("div", { className: "flex flex-col gap-4" },
                    messages.length === 0 && (React.createElement("div", { className: "text-center text-muted-foreground mt-20 flex flex-col items-center gap-2" },
                        React.createElement(lucide_react_1.Bot, { className: "h-10 w-10 text-muted-foreground/30" }),
                        React.createElement("p", null, "Hello! Ask me to find lyrics and chords for any song."),
                        React.createElement("p", { className: "text-xs" }, "Example: \"What are the chords for Perfect by Ed Sheeran?\""))),
                    messages.map(function (msg) { return (React.createElement("div", { key: msg.chat_id, className: utils_1.cn('flex flex-col max-w-[85%]', msg.role === 'user'
                            ? 'self-end items-end'
                            : 'self-start items-start') },
                        React.createElement("div", { className: utils_1.cn('p-3 rounded-2xl shadow-sm text-sm', msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                : 'bg-card border border-border/50 rounded-tl-sm w-full') }, msg.role === 'user' ? (msg.content) : (React.createElement("div", { className: "flex flex-col gap-2 w-full" },
                            React.createElement("div", { className: "prose dark:prose-invert prose-sm max-w-none whitespace-pre-wrap" },
                                React.createElement(react_markdown_1["default"], null, msg.content)),
                            React.createElement("div", { className: "flex justify-end mt-2 pt-2 border-t border-border/30" },
                                React.createElement(button_1.Button, { variant: "secondary", size: "sm", className: "h-8 text-xs font-medium", onClick: function () {
                                        setAddModalData({
                                            lyrics: msg.content
                                        });
                                        setEdit(false);
                                        openAddModal();
                                        onOpenChange(false);
                                    } },
                                    React.createElement(lucide_react_2.Save, { className: "h-3 w-3 mr-1" }),
                                    "Save as Song"))))),
                        React.createElement("span", { className: "text-[10px] text-muted-foreground mt-1 px-1" }, new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })))); }),
                    isLoading && (React.createElement("div", { className: "self-start bg-card border border-border/50 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2" },
                        React.createElement(lucide_react_1.Loader2, { className: "h-4 w-4 animate-spin text-primary" }),
                        React.createElement("span", { className: "text-sm text-muted-foreground" }, "Thinking..."))))),
            React.createElement("div", { className: "p-3 bg-background/80 backdrop-blur-sm border-t border-border/50 flex items-center gap-2" },
                React.createElement(button_1.Button, { variant: isListening ? 'destructive' : 'secondary', size: "icon", onClick: toggleListening, className: utils_1.cn('shrink-0 transition-colors rounded-full', isListening && 'animate-pulse'), type: "button" }, isListening ? (React.createElement(lucide_react_1.MicOff, { className: "h-4 w-4" })) : (React.createElement(lucide_react_1.Mic, { className: "h-4 w-4 text-primary" }))),
                React.createElement(input_1.Input, { value: input, onChange: function (e) { return setInput(e.target.value); }, onKeyDown: function (e) {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(input);
                        }
                    }, placeholder: "Ask AI for chords or lyrics...", className: "flex-1 bg-card/50 border-border/50 focus-visible:ring-primary rounded-full px-4" }),
                React.createElement(button_1.Button, { onClick: function () { return handleSend(input); }, disabled: !input.trim() || isLoading, size: "icon", className: "shrink-0 rounded-full bg-primary hover:bg-primary/90 shadow-sm" },
                    React.createElement(lucide_react_1.Send, { className: "h-4 w-4" }))))));
}
exports.AiChatDialog = AiChatDialog;
