import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

const BARS = 60;

export default function MusicPlayer() {
    const {
        currentTrack,
        currentIndex,
        playing,
        setPlaying,
        togglePlay,
        next,
        prev,
        volume,
        setVolume,
    } = usePlayer();

    const [levels, setLevels] = useState(() => new Array(BARS).fill(0));
    const [muted, setMuted] = useState(false);

    const audioRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const rafRef = useRef(null);

    const initAudio = () => {
        if (audioCtxRef.current || !audioRef.current) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.78;
            const src = ctx.createMediaElementSource(audioRef.current);
            src.connect(analyser);
            analyser.connect(ctx.destination);
            audioCtxRef.current = ctx;
            analyserRef.current = analyser;
            sourceRef.current = src;
        } catch (e) {
            console.warn("Audio analysis unavailable:", e);
        }
    };

    // Sync `playing` state with the <audio> element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            initAudio();
            if (audioCtxRef.current?.state === "suspended") {
                audioCtxRef.current.resume().catch(() => {});
            }
            audio.play().catch((e) => {
                console.warn("Playback failed:", e);
                setPlaying(false);
            });
        } else {
            audio.pause();
        }
    }, [playing, currentIndex, setPlaying]);

    // Reload source when currentIndex changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.load();
        if (playing) {
            audio.play().catch(() => {});
        }
        // intentionally not depending on `playing` here to avoid double-load
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    // Apply volume + mute
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = muted ? 0 : volume;
    }, [volume, muted]);

    // Waveform analyser loop
    useEffect(() => {
        if (!playing || !analyserRef.current) return undefined;
        const analyser = analyserRef.current;
        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
            analyser.getByteFrequencyData(data);
            const nxt = new Array(BARS);
            for (let i = 0; i < BARS; i++) {
                const t = i / BARS;
                const idxF = Math.pow(t, 1.6) * (data.length - 1);
                const lo = Math.floor(idxF);
                const hi = Math.min(data.length - 1, lo + 1);
                const frac = idxF - lo;
                const v = (data[lo] * (1 - frac) + data[hi] * frac) / 255;
                nxt[i] = Math.min(1, v * 1.35);
            }
            setLevels(nxt);
            rafRef.current = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(rafRef.current);
    }, [playing]);

    // Auto-advance on track end
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return undefined;
        const onEnd = () => next();
        audio.addEventListener("ended", onEnd);
        return () => audio.removeEventListener("ended", onEnd);
    }, [next]);

    useEffect(() => {
        return () => {
            cancelAnimationFrame(rafRef.current);
            if (audioCtxRef.current) {
                audioCtxRef.current.close().catch(() => {});
            }
        };
    }, []);

    return (
        <div
            data-testid="music-player"
            className="fixed bottom-7 right-8 z-40 hidden sm:flex flex-col items-stretch gap-2"
            style={{ width: "360px" }}
        >
            <audio
                ref={audioRef}
                src={currentTrack.url}
                crossOrigin="anonymous"
                preload="auto"
            />

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
                        {currentTrack.title}
                    </div>

                    <div
                        data-testid="player-artist-name"
                        className="font-mono text-[9px] tracking-label text-[var(--text-dim)] uppercase truncate"
                    >
                        Wonji
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        data-testid="player-prev-button"
                        onClick={prev}
                        aria-label="Previous track"
                        className="player-ctrl-btn"
                    >
                        <SkipBack size={11} strokeWidth={1.5} fill="currentColor" />
                    </button>

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

                    <button
                        data-testid="player-next-button"
                        onClick={next}
                        aria-label="Next track"
                        className="player-ctrl-btn"
                    >
                        <SkipForward size={11} strokeWidth={1.5} fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Volume bar */}
            <div
                className="flex items-center gap-2 px-1"
                data-testid="player-volume"
            >
                <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? "Unmute" : "Mute"}
                    data-testid="player-mute-button"
                    className="text-[var(--text-dim)] hover:text-white transition-colors"
                >
                    {muted || volume === 0 ? (
                        <VolumeX size={11} strokeWidth={1.5} />
                    ) : (
                        <Volume2 size={11} strokeWidth={1.5} />
                    )}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={muted ? 0 : volume}
                    onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setVolume(v);
                        if (v > 0 && muted) setMuted(false);
                    }}
                    aria-label="Volume"
                    data-testid="player-volume-slider"
                    className="player-volume-slider flex-1"
                    style={{ "--vol": `${(muted ? 0 : volume) * 100}%` }}
                />
            </div>

            <div
                data-testid="player-waveform"
                className="flex items-center justify-between h-6 px-1"
                aria-hidden="true"
            >
                {Array.from({ length: BARS }).map((_, i) => {
                    const live = playing && analyserRef.current;
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
