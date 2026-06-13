'use client';

import { cn } from '@/lib/utils';

// Patterns to detect section headers like [Verse 1], [Chorus], [Bridge], [Pre-Chorus] etc.
const SECTION_HEADER_PATTERN =
    /^\[?(verse|chorus|bridge|pre-?chorus|outro|intro|interlude|tag|hook)\b/i;

interface LineSegment {
    type: 'chord' | 'text';
    value: string;
}

/** Splits a single lyrics line into chord and text segments */
function parseLyricsLine(line: string): LineSegment[] {
    const parts = line.split(/(\[[^\]]+\])/g);
    return parts.map((part) => {
        if (part.startsWith('[') && part.endsWith(']')) {
            const inner = part.slice(1, -1);
            // If it looks like a section header content, treat as text
            if (SECTION_HEADER_PATTERN.test(inner)) {
                return { type: 'text', value: part };
            }
            return { type: 'chord', value: inner };
        }
        return { type: 'text', value: part };
    });
}

export type FontSize = 'sm' | 'md' | 'lg';

const FONT_SIZES = {
    sm: {
        lyric: 'text-sm',
        chord: 'text-[11px]',
        section: 'text-xs',
        meta: 'text-xs',
        spacer: 'h-3',
        margin: 'my-1',
    },
    md: {
        lyric: 'text-base',
        chord: 'text-xs',
        section: 'text-sm',
        meta: 'text-sm',
        spacer: 'h-4',
        margin: 'my-1.5',
    },
    lg: {
        lyric: 'text-lg',
        chord: 'text-sm',
        section: 'text-base',
        meta: 'text-base',
        spacer: 'h-5',
        margin: 'my-2',
    },
};

/** Renders a single line that has both chords and lyrics inline */
function LyricsLine({ line, size }: { line: string; size: FontSize }) {
    const segments = parseLyricsLine(line);
    const hasChords = segments.some((s) => s.type === 'chord');
    const classes = FONT_SIZES[size];

    if (!hasChords) {
        return (
            <div className={cn('leading-relaxed text-foreground/80 whitespace-pre-wrap', classes.lyric)}>
                {line || '\u00A0'}
            </div>
        );
    }

    // Build chord/lyric pairs: each chord is paired with the text that follows it
    const pairs: { chord: string; lyric: string }[] = [];
    let currentChord = '';
    let buffer = '';

    for (const seg of segments) {
        if (seg.type === 'chord') {
            if (currentChord || buffer) {
                pairs.push({ chord: currentChord, lyric: buffer });
            }
            currentChord = seg.value;
            buffer = '';
        } else {
            buffer += seg.value;
        }
    }
    // Push remaining
    pairs.push({ chord: currentChord, lyric: buffer });

    return (
        <div className={cn('flex flex-wrap items-end', classes.margin)}>
            {pairs.map((pair, i) => (
                <span key={i} className="inline-flex flex-col items-start mr-0.5">
                    {pair.chord ? (
                        <span className={cn('font-bold text-primary bg-primary/10 rounded px-1 mb-0.5 tracking-tight whitespace-nowrap', classes.chord)}>
                            {pair.chord}
                        </span>
                    ) : (
                        <span className={cn('mb-0.5 invisible select-none', classes.chord)}>
                            _
                        </span>
                    )}
                    <span className={cn('text-foreground/90 font-mono whitespace-pre leading-loose', classes.lyric)}>
                        {pair.lyric || (pair.chord ? '\u00A0' : '')}
                    </span>
                </span>
            ))}
        </div>
    );
}

interface ChordLyricsRendererProps {
    content: string;
    className?: string;
    fontSize?: FontSize | number;
}

/** Main renderer: parses the full AI response and formats it cleanly */
export function ChordLyricsRenderer({
    content,
    className,
    fontSize = 'sm',
}: ChordLyricsRendererProps) {
    const lines = content.split('\n');
    
    // Normalize fontSize to 'sm' | 'md' | 'lg'
    let size: FontSize = 'sm';
    if (fontSize === 'md' || fontSize === 'lg') size = fontSize;
    else if (typeof fontSize === 'number') {
        if (fontSize >= 18) size = 'lg';
        else if (fontSize >= 16) size = 'md';
    }
    
    const classes = FONT_SIZES[size];

    return (
        <div className={cn('space-y-0.5', className)}>
            {lines.map((line, i) => {
                const trimmed = line.trim();

                // Empty line = spacer
                if (!trimmed) {
                    return <div key={i} className={classes.spacer} />;
                }

                // Section header: e.g. [Verse 1], [Chorus]
                const headerMatch = trimmed.match(/^\[([^\]]+)\]$/);
                if (
                    headerMatch &&
                    SECTION_HEADER_PATTERN.test(headerMatch[1])
                ) {
                    return (
                        <div key={i} className="pt-3 pb-1">
                            <span className={cn('font-bold uppercase tracking-widest text-primary/70 border-b border-primary/20 pb-0.5', classes.section)}>
                                {headerMatch[1]}
                            </span>
                        </div>
                    );
                }

                // Metadata lines like "Title:", "Key:", "Scale:" etc.
                if (
                    /^(title|key|scale|time signature|tempo|genre|language|instrument|beat|style)\s*:/i.test(
                        trimmed
                    )
                ) {
                    const [label, ...rest] = trimmed.split(':');
                    return (
                        <div
                            key={i}
                            className={cn('flex items-center gap-1.5 text-muted-foreground py-0.5', classes.meta)}
                        >
                            <span className="font-semibold text-foreground/70 min-w-[90px]">
                                {label}:
                            </span>
                            <span>{rest.join(':').trim()}</span>
                        </div>
                    );
                }

                return <LyricsLine key={i} line={line} size={size} />;
            })}
        </div>
    );
}
