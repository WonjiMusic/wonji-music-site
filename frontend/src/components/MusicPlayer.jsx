import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

/**
 * MusicPlayer — visual "Now Playing" module with a real-time reactive waveform.
 *
 * To make the bars react to a real track:
 *   1. Drop your track URL into TRACK_URL below (or set REACT_APP_TRACK_URL in /app/frontend/.env)
 *   2. The audio MUST be served with permissive CORS headers (Access-Control-Allow-Origin)
 *      OR be hosted on the same origin as the app. Most CDNs (Cloudflare R2, S3 with CORS,
 *      SoundCloud direct mp3, etc.) work fine.
 *
 * If TRACK_URL is empty, the bars fall back to the previous CSS animation.
 */
const TRACK_URL = process.env.REACT_APP_TRACK_URL || "";

const BARS = 60;

export default function MusicPlayer() {
<<<<<<< HEAD
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const BARS = 60;
=======
    const [playing, setPlaying] = useState(false);
    const [hasAudio] = useState(!!TRACK_URL);
    const [levels, setLevels] = useState(() => new Array(BARS).fill(0));

    const audioRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const rafRef = useRef(null);

    // Initialise Web Audio graph on first user gesture
    const initAudio = () => {
        if (audioCtxRef.current || !audioRef.current) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;            // 128 frequency bins
            analyser.smoothingTimeConstant = 0.78;
            const src = ctx.createMediaElementSource(audioRef.current);
            src.connect(analyser);
            analyser.connect(ctx.destination);
            audioCtxRef.current = ctx;
            analyserRef.current = analyser;
            sourceRef.current = src;
        } catch (e) {
            // Likely CORS — bars will simply not react; keep playback if possible
            // eslint-disable-next-line no-console
            console.warn("Audio analysis unavailable:", e);
        }
    };

    const togglePlay = async () => {
        if (!hasAudio || !audioRef.current) {
            // Visual-only mode toggle
            setPlaying((p) => !p);
            return;
        }
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            initAudio();
            try {
                if (audioCtxRef.current?.state === "suspended") {
                    await audioCtxRef.current.resume();
                }
                await audioRef.current.play();
                setPlaying(true);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn("Playback failed:", e);
            }
        }
    };

    // Real-time bar update loop
    useEffect(() => {
        if (!playing || !analyserRef.current) return undefined;
        const analyser = analyserRef.current;
        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
            analyser.getByteFrequencyData(data);
            const next = new Array(BARS);
            // Spread frequency bins across visible bars, weighting lows slightly more
            // (typical music energy distribution).
            for (let i = 0; i < BARS; i++) {
                const t = i / BARS;
                // Logarithmic-ish mapping: cluster low/mid bins
                const idxF = Math.pow(t, 1.6) * (data.length - 1);
                const lo = Math.floor(idxF);
                const hi = Math.min(data.length - 1, lo + 1);
                const frac = idxF - lo;
                const v = (data[lo] * (1 - frac) + data[hi] * frac) / 255;
                next[i] = Math.min(1, v * 1.35); // slight boost
            }
            setLevels(next);
            rafRef.current = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(rafRef.current);
    }, [playing]);

    // Sync internal state if audio ends naturally
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return undefined;
        const onEnd = () => setPlaying(false);
        a.addEventListener("ended", onEnd);
        return () => a.removeEventListener("ended", onEnd);
    }, []);

    // Cleanup audio context on unmount
    useEffect(() => {
        return () => {
            cancelAnimationFrame(rafRef.current);
            if (audioCtxRef.current) {
                audioCtxRef.current.close().catch(() => {});
            }
        };
    }, []);
>>>>>>> 0092836 (auto-commit for 10c9bc49-c295-4eb6-bdb0-1c5ca9c0919f)

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
<<<<<<< HEAD
            <audio ref={audioRef} src="/Boxhead (Immortal) OST.mp3" />
=======
            {/* Hidden audio element. crossOrigin enables analyser when host serves CORS headers */}
            {hasAudio && (
                <audio
                    ref={audioRef}
                    src={TRACK_URL}
                    crossOrigin="anonymous"
                    preload="auto"
                />
            )}
>>>>>>> 0092836 (auto-commit for 10c9bc49-c295-4eb6-bdb0-1c5ca9c0919f)

            <div
                className="flex items-center gap-3 p-2 pr-3 backdrop-blur-md border border-[var(--line-strong)]"
                style={{ background: "rgba(8, 9, 13, 0.78)" }}
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
                        Boxhead (Immortal) OST
                    </div>
                    <div
                        data-testid="player-artist-name"
                        className="font-mono text-[9px] tracking-label text-[var(--text-dim)] uppercase truncate"
                    >
                        Wonji
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

<<<<<<< HEAD
=======
            {/* Waveform: live-reactive when track is loaded, animated otherwise */}
>>>>>>> 0092836 (auto-commit for 10c9bc49-c295-4eb6-bdb0-1c5ca9c0919f)
            <div
                data-testid="player-waveform"
                className="flex items-center justify-between h-6 px-1"
                aria-hidden="true"
            >
                {Array.from({ length: BARS }).map((_, i) => {
                    const live = playing && hasAudio && analyserRef.current;
                    if (live) {
                        const h = Math.max(2, Math.round(levels[i] * 22));
                        return (
                            <span
                                key={i}
                                className="wave-bar-live"
                                style={{ height: `${h}px` }}
                            />
                        );
                    }
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
