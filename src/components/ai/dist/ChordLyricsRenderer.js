'use client';
"use strict";
exports.__esModule = true;
exports.ChordLyricsRenderer = void 0;
var utils_1 = require("@/lib/utils");
// Patterns to detect section headers like [Verse 1], [Chorus], [Bridge], [Pre-Chorus] etc.
var SECTION_HEADER_PATTERN = /^\[?(verse|chorus|bridge|pre-?chorus|outro|intro|interlude|tag|hook)\b/i;
/** Splits a single lyrics line into chord and text segments */
function parseLyricsLine(line) {
    var parts = line.split(/(\[[^\]]+\])/g);
    return parts.map(function (part) {
        if (part.startsWith('[') && part.endsWith(']')) {
            var inner = part.slice(1, -1);
            // If it looks like a section header content, treat as text
            if (SECTION_HEADER_PATTERN.test(inner)) {
                return { type: 'text', value: part };
            }
            return { type: 'chord', value: inner };
        }
        return { type: 'text', value: part };
    });
}
/** Renders a single line that has both chords and lyrics inline */
function LyricsLine(_a) {
    var line = _a.line;
    var segments = parseLyricsLine(line);
    var hasChords = segments.some(function (s) { return s.type === 'chord'; });
    if (!hasChords) {
        return (React.createElement("div", { className: "leading-7 text-sm text-foreground/80 whitespace-pre-wrap" }, line || '\u00A0'));
    }
    // Build chord/lyric pairs: each chord is paired with the text that follows it
    var pairs = [];
    var currentChord = '';
    var buffer = '';
    for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
        var seg = segments_1[_i];
        if (seg.type === 'chord') {
            if (currentChord || buffer) {
                pairs.push({ chord: currentChord, lyric: buffer });
            }
            currentChord = seg.value;
            buffer = '';
        }
        else {
            buffer += seg.value;
        }
    }
    // Push remaining
    pairs.push({ chord: currentChord, lyric: buffer });
    return (React.createElement("div", { className: "flex flex-wrap items-end gap-x-1 leading-none my-1" }, pairs.map(function (pair, i) { return (React.createElement("span", { key: i, className: "inline-flex flex-col items-start" },
        pair.chord ? (React.createElement("span", { className: "chord-marker text-xs font-bold text-primary bg-primary/10 rounded px-1 mb-0.5 tracking-tight whitespace-nowrap" }, pair.chord)) : (React.createElement("span", { className: "text-xs mb-0.5 invisible select-none" }, "_")),
        React.createElement("span", { className: "text-sm text-foreground/90 whitespace-pre" }, pair.lyric || (pair.chord ? '\u00A0' : '')))); })));
}
/** Main renderer: parses the full AI response and formats it cleanly */
function ChordLyricsRenderer(_a) {
    var content = _a.content, className = _a.className;
    var lines = content.split('\n');
    return (React.createElement("div", { className: utils_1.cn('space-y-0.5 text-sm font-mono', className) }, lines.map(function (line, i) {
        var trimmed = line.trim();
        // Empty line = spacer
        if (!trimmed) {
            return React.createElement("div", { key: i, className: "h-3" });
        }
        // Section header: e.g. [Verse 1], [Chorus]
        var headerMatch = trimmed.match(/^\[([^\]]+)\]$/);
        if (headerMatch &&
            SECTION_HEADER_PATTERN.test(headerMatch[1])) {
            return (React.createElement("div", { key: i, className: "pt-3 pb-1" },
                React.createElement("span", { className: "text-xs font-bold uppercase tracking-widest text-primary/70 border-b border-primary/20 pb-0.5" }, headerMatch[1])));
        }
        // Metadata lines like "Title:", "Key:", "Scale:" etc.
        if (/^(title|key|scale|time signature|tempo|genre|language|instrument|beat|style)\s*:/i.test(trimmed)) {
            var _a = trimmed.split(':'), label = _a[0], rest = _a.slice(1);
            return (React.createElement("div", { key: i, className: "flex items-center gap-1.5 text-xs text-muted-foreground py-0.5" },
                React.createElement("span", { className: "font-semibold text-foreground/70 min-w-[90px]" },
                    label,
                    ":"),
                React.createElement("span", null, rest.join(':').trim())));
        }
        return React.createElement(LyricsLine, { key: i, line: line });
    })));
}
exports.ChordLyricsRenderer = ChordLyricsRenderer;
