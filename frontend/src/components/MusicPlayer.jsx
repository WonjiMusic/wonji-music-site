import { useState } from "react";
import { Play, Pause } from "lucide-react";

export default function MusicPlayer() {
    const [playing, setPlaying] = useState(true);

    const BARS = 28;

    return (
        <div
            data-testid="music-player"
            className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-4 px-4 py-3 pr-5
                       backdrop-blur-md border border-[var(--line-strong)]
                       rounded-sm scanlines"
            style={{
                background: "rgba(8, 11, 18, 0.72)",
                boxShadow:
                    "0 0 0 1px rgba(26,42,108,0.15), 0 20px 60px -20px rgba(106,0,255,0.25)",
            }}
        >
            {/* Play button */}
            <button
                data-testid="player-play-button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
                className="relative w-10 h-10 rounded-full flex items-center justify-center
                           border border-[var(--line-strong)] text-white
                           transition-all duration-300 hover:border-[rgba(106,0,255,0.6)]
                           hover:shadow-[0_0_24px_-2px_rgba(106,0,255,0.6)]"
                style={{
                    background:
                        "radial-gradient(circle at 30% 30%, rgba(26,42,108,0.4), rgba(8,11,18,0.9))",
                }}
            >
                {playing ? (
                    <Pause size={14} strokeWidth={1.5} fill="currentColor" />
                ) : (
                    <Play size={14} strokeWidth={1.5} fill="currentColor" />
                )}
                {/* inner pulse */}
                <span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                        boxShadow: playing
                            ? "inset 0 0 14px rgba(106,0,255,0.35)"
                            : "none",
                    }}
                />
            </button>

            {/* Track info */}
            <div className="min-w-0">
                <div
                    data-testid="player-track-name"
                    className="text-[13px] text-white font-medium tracking-wider-2 uppercase truncate"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    Iron Cathedral
                </div>
                <div
                    data-testid="player-artist-name"
                    className="text-[10px] font-mono tracking-label text-[var(--text-dim)] mt-0.5"
                >
                    NOX · VOID SIGNALS EP
                </div>
            </div>

            {/* Waveform */}
            <div
                data-testid="player-waveform"
                className="flex items-end h-6 ml-2"
                aria-hidden="true"
            >
                {Array.from({ length: BARS }).map((_, i) => (
                    <span
                        key={i}
                        className={`wave-bar ${playing ? "" : "paused"}`}
                        style={{
                            animationDelay: `${(i * 70) % 900}ms`,
                            height: `${6 + ((i * 37) % 14)}px`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
