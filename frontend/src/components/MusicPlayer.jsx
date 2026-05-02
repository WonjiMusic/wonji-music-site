import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export default function MusicPlayer() {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const BARS = 60;

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.play();
            setPlaying(true);
        }
    };

    return (
        <div
            data-testid="music-player"
            className="fixed bottom-7 right-8 z-40 hidden sm:flex flex-col items-stretch gap-2"
            style={{ width: "330px" }}
        >
            <audio ref={audioRef} src="/audio/arcane-sun.mp3" />

            <div
                className="flex items-center gap-3 p-2 pr-3 backdrop-blur-md border border-[var(--line-strong)]"
                style={{
                    background: "rgba(8, 9, 13, 0.78)",
                }}
            >
                <div
                    data-testid="player-album-art"
                    className="w-12 h-12 flex-shrink-0 relative overflow-hidden"
                    style={{
                        background:
                            "radial-gradient(circle at 35% 35%, rgba(106,0,255,0.55), rgba(26,42,108,0.45) 45%, #060810 75%)",
                        border: "1px solid rgba(208,208,208,0.15)",
                    }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 60% 50%, rgba(255,255,255,0.18), transparent 40%), repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 4px)",
                        }}
                    />
                    <div className="absolute inset-2 rounded-full border border-white/10" />
                    <div className="absolute inset-3 rounded-full border border-white/5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="font-mono text-[9px] tracking-label text-[var(--text-dim)] uppercase">
                        Now Playing
                    </div>
                    <div
                        data-testid="player-track-name"
                        className="text-[12px] text-white tracking-wider-2 uppercase truncate font-medium"
                    >
                        Arcane Sun
                    </div>
                    <div
                        data-testid="player-artist-name"
                        className="font-mono text-[9px] tracking-label text-[var(--text-dim)] uppercase truncate"
                    >
                        The Voidborn
                    </div>
                </div>

                <button
                    data-testid="player-play-button"
                    onClick={togglePlay}
                    aria-label={playing ? "Pause" : "Play"}
                    className="player-play-btn"
                >
                    {playing ? (
                        <Pause size={12} strokeWidth={1.5} fill="currentColor" />
                    ) : (
                        <Play size={12} strokeWidth={1.5} fill="currentColor" />
                    )}
                </button>
            </div>

            <div
                data-testid="player-waveform"
                className="flex items-center justify-between h-5 px-1"
                aria-hidden="true"
            >
                {Array.from({ length: BARS }).map((_, i) => {
                    const h = 4 + ((i * 53) % 16);
                    return (
                        <span
                            key={i}
                            className={`wave-bar2 ${playing ? "" : "paused"}`}
                            style={{
                                height: `${h}px`,
                                animationDelay: `${(i * 50) % 1100}ms`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
