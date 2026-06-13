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
exports.__esModule = true;
exports.SongDisplay = void 0;
var lucide_react_1 = require("lucide-react");
var date_fns_1 = require("date-fns");
var use_add_modal_1 = require("@/hooks/use-add-modal");
var use_delete_modal_1 = require("@/hooks/use-delete-modal");
var useSongs_1 = require("@/store/useSongs");
var navigation_1 = require("next/navigation");
var button_1 = require("../ui/button");
var scroll_area_1 = require("../ui/scroll-area");
var tooltip_1 = require("../ui/tooltip");
var use_toast_1 = require("../ui/use-toast");
var empty_placeholder_1 = require("./empty-placeholder");
var ChordLyricsRenderer_1 = require("../ai/ChordLyricsRenderer");
// Redux
var react_redux_1 = require("react-redux");
var authSlice_1 = require("@/lib/store/slices/authSlice");
var songsApi_1 = require("@/lib/store/api/songsApi");
var pinsApi_1 = require("@/lib/store/api/pinsApi");
function InfoBadge(_a) {
    var label = _a.label, value = _a.value;
    var display = value && value !== 'N/A' && value.trim() !== '' ? value : 'N/A';
    return (React.createElement("div", { className: "flex items-center gap-1.5 bg-background/80 backdrop-blur-sm rounded-md px-2.5 py-1 border border-border/50 shadow-sm transition-colors hover:border-primary/30" },
        React.createElement("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80" }, label),
        React.createElement("span", { className: "text-[11px] font-bold text-foreground/90" }, display)));
}
function SongDisplay(_a) {
    var _this = this;
    var _b;
    var song = _a.song;
    var router = navigation_1.useRouter();
    var toast = use_toast_1.useToast().toast;
    var _c = use_add_modal_1["default"](), onOpen = _c.onOpen, setData = _c.setData, setEdit = _c.setEdit;
    var tabs = useSongs_1.useSongs()[0];
    var openDeleteModal = use_delete_modal_1["default"]().onOpen;
    var dispatch = react_redux_1.useDispatch();
    // Redux State & Hooks
    var _d = react_redux_1.useSelector(function (state) { return state.auth; }), isAuthenticated = _d.isAuthenticated, user = _d.user, isAdmin = _d.isAdmin;
    var pinsRes = pinsApi_1.useGetPinnedSongsQuery(undefined, {
        skip: !isAuthenticated
    }).data;
    var _e = pinsApi_1.usePinSongMutation(), pinSong = _e[0], isPinning = _e[1].isLoading;
    var _f = pinsApi_1.useUnpinSongMutation(), unpinSong = _f[0], isUnpinning = _f[1].isLoading;
    var _g = songsApi_1.useApproveSongMutation(), approveSong = _g[0], isApproving = _g[1].isLoading;
    var _h = songsApi_1.useRejectSongMutation(), rejectSong = _h[0], isRejecting = _h[1].isLoading;
    var isSongPinned = function (songId) {
        if (!isAuthenticated || !(pinsRes === null || pinsRes === void 0 ? void 0 : pinsRes.data))
            return false;
        return pinsRes.data.some(function (pinnedSong) { return pinnedSong.song_id === songId; });
    };
    var handleLogout = function () {
        dispatch(authSlice_1.logout());
        router.refresh();
    };
    var handleTogglePin = function () { return __awaiter(_this, void 0, void 0, function () {
        var currentlyPinned, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isAuthenticated || !song) {
                        toast({
                            title: 'Please sign in to pin songs',
                            variant: 'destructive'
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    currentlyPinned = isSongPinned(song.song_id);
                    if (!currentlyPinned) return [3 /*break*/, 3];
                    return [4 /*yield*/, unpinSong(song.song_id).unwrap()];
                case 2:
                    _a.sent();
                    toast({ title: 'Removed from favourites' });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, pinSong(song.song_id).unwrap()];
                case 4:
                    _a.sent();
                    toast({ title: 'Added to favourites' });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    toast({
                        title: 'Failed to update favourites',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleLogin = function () {
        router.push('/sign-in');
    };
    var handleEditModal = function () {
        if (!song)
            return;
        try {
            var parsedLyrics = song.lyrics.startsWith('"')
                ? JSON.parse(song.lyrics)
                : song.lyrics;
            setData(__assign(__assign({}, song), { lyrics: parsedLyrics }));
        }
        catch (_a) {
            setData(__assign({}, song));
        }
        setEdit(true);
        onOpen();
    };
    var handleDeleteModal = function () {
        openDeleteModal();
    };
    var handleApprove = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, approveSong(song.song_id).unwrap()];
                case 1:
                    _a.sent();
                    toast({ title: 'Song approved successfully' });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    toast({ title: 'Failed to approve song', variant: 'destructive' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleReject = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rejectSong(song.song_id).unwrap()];
                case 1:
                    _a.sent();
                    toast({ title: 'Song rejected' });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    toast({ title: 'Failed to reject song', variant: 'destructive' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "flex h-full flex-col bg-card/40" },
        React.createElement("div", { className: "flex items-center p-2 backdrop-blur-sm sticky top-0 z-10 border-b border-border/50" },
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(tooltip_1.Tooltip, null,
                    tabs.currentTab.value !== 'my-songs' && (React.createElement(tooltip_1.TooltipTrigger, { asChild: true },
                        React.createElement(button_1.Button, { onClick: handleTogglePin, variant: "ghost", size: "icon", disabled: !song ||
                                !isAuthenticated ||
                                isPinning ||
                                isUnpinning, className: "hover:bg-accent hover:text-accent-foreground transition-colors" },
                            isPinning || isUnpinning ? (React.createElement(lucide_react_1.Loader2, { className: "h-5 w-5 animate-spin" })) : isSongPinned(song === null || song === void 0 ? void 0 : song.song_id) ? (React.createElement(lucide_react_1.HeartIcon, { fill: "currentColor", className: "h-5 w-5 text-destructive" })) : (React.createElement(lucide_react_1.HeartIcon, { className: "h-5 w-5" })),
                            React.createElement("span", { className: "sr-only" }, "Add to favourites")))),
                    React.createElement(tooltip_1.TooltipContent, null, "Add to favourites")),
                (isAdmin || (user === null || user === void 0 ? void 0 : user.user_id) === (song === null || song === void 0 ? void 0 : song.user_id)) && song && (React.createElement(React.Fragment, null,
                    React.createElement(tooltip_1.Tooltip, null,
                        React.createElement(tooltip_1.TooltipTrigger, { asChild: true },
                            React.createElement(button_1.Button, { onClick: handleEditModal, variant: "ghost", size: "icon" },
                                React.createElement(lucide_react_1.Edit, { className: "h-5 w-5" }),
                                React.createElement("span", { className: "sr-only" }, "Edit"))),
                        React.createElement(tooltip_1.TooltipContent, null, "Edit")),
                    isAdmin &&
                        tabs.currentTab.value === 'requests' && (React.createElement(React.Fragment, null,
                        React.createElement(tooltip_1.Tooltip, null,
                            React.createElement(tooltip_1.TooltipTrigger, { asChild: true },
                                React.createElement(button_1.Button, { onClick: handleApprove, variant: "ghost", size: "icon", disabled: isApproving ||
                                        isRejecting },
                                    isApproving ? (React.createElement(lucide_react_1.Loader2, { className: "h-5 w-5 text-emerald-500 animate-spin" })) : (React.createElement(lucide_react_1.CheckIcon, { className: "text-emerald-500 h-5 w-5" })),
                                    React.createElement("span", { className: "sr-only" }, "Approve"))),
                            React.createElement(tooltip_1.TooltipContent, null, "Approve")),
                        React.createElement(tooltip_1.Tooltip, null,
                            React.createElement(tooltip_1.TooltipTrigger, { asChild: true },
                                React.createElement(button_1.Button, { onClick: handleReject, variant: "ghost", size: "icon", disabled: isApproving ||
                                        isRejecting },
                                    isRejecting ? (React.createElement(lucide_react_1.Loader2, { className: "h-5 w-5 text-destructive animate-spin" })) : (React.createElement(lucide_react_1.X, { className: "h-5 w-5 text-destructive", strokeWidth: 2 })),
                                    React.createElement("span", { className: "sr-only" }, "Decline"))),
                            React.createElement(tooltip_1.TooltipContent, null, "Decline")))),
                    (!isAdmin ||
                        tabs.currentTab.value !== 'requests') && (React.createElement(tooltip_1.Tooltip, null,
                        React.createElement(tooltip_1.TooltipTrigger, { asChild: true },
                            React.createElement(button_1.Button, { onClick: handleDeleteModal, variant: "ghost", size: "icon" },
                                React.createElement(lucide_react_1.Trash2, { strokeWidth: 2, className: "h-5 w-5 text-destructive" }),
                                React.createElement("span", { className: "sr-only" }, "Delete"))),
                        React.createElement(tooltip_1.TooltipContent, null, "Delete")))))),
            React.createElement("div", { className: "ml-auto flex items-center gap-2" },
                React.createElement(tooltip_1.Tooltip, null,
                    React.createElement(tooltip_1.TooltipTrigger, { asChild: true }, isAuthenticated ? (React.createElement(button_1.Button, { onClick: handleLogout, variant: "destructive", size: "icon" },
                        React.createElement(lucide_react_1.LogOut, { className: "h-4 w-4" }),
                        React.createElement("span", { className: "sr-only" }, "Log out"))) : (React.createElement(button_1.Button, { onClick: handleLogin, variant: "default", size: "icon", className: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20" },
                        React.createElement(lucide_react_1.LogIn, { className: "h-4 w-4" }),
                        React.createElement("span", { className: "sr-only" }, "Log in")))),
                    React.createElement(tooltip_1.TooltipContent, null, isAuthenticated ? 'Log out' : 'Log in')))),
        song ? (React.createElement("div", { className: "flex h-full flex-col overflow-hidden" },
            React.createElement("div", { className: "flex items-start p-6 bg-gradient-to-b from-primary/5 to-transparent border-b border-border/30 shadow-sm" },
                React.createElement("div", { className: "flex flex-col gap-3 w-full" },
                    React.createElement("div", { className: "flex justify-between items-start w-full" },
                        React.createElement("h2", { className: "text-3xl font-extrabold tracking-tight text-foreground/90" }, song.title),
                        song.created_at && (React.createElement("div", { className: "text-xs text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded-md border border-border/50" }, date_fns_1.format(new Date(song.created_at), 'PPP')))),
                    React.createElement("div", { className: "flex flex-wrap items-center gap-2 mt-2" },
                        React.createElement(InfoBadge, { label: "Key", value: song.scale }),
                        React.createElement(InfoBadge, { label: "Time", value: song.beat }),
                        React.createElement(InfoBadge, { label: "Tempo", value: song.tempo }),
                        React.createElement(InfoBadge, { label: "Genre", value: song.style }),
                        React.createElement(InfoBadge, { label: "Lang", value: song.language }),
                        React.createElement(InfoBadge, { label: "Inst", value: song.keyboard_modal })))),
            React.createElement(scroll_area_1.ScrollArea, { className: "flex-1 p-6 text-base md:text-lg" },
                React.createElement("div", { className: "mx-auto w-fit pb-20" },
                    React.createElement(ChordLyricsRenderer_1.ChordLyricsRenderer, { fontSize: 18, content: ((_b = song.lyrics) === null || _b === void 0 ? void 0 : _b.startsWith('"')) ? JSON.parse(song.lyrics)
                            : song.lyrics || '' }))))) : (React.createElement(empty_placeholder_1.EmptyPlaceholder, { title: "No song selected", description: "Please select a song from the list to display" }))));
}
exports.SongDisplay = SongDisplay;
