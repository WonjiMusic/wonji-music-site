import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

const BARS = 60;

const fmt = (s) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
};

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
        analyserRef: sharedAnalyserRef,
    } = usePlayer();

    const [levels, setLevels] = useState(() => new Array(BARS).fill(0));
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const rafRef = useRef(null);
    const seekingRef = useRef(false);

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
            // Expose to other consumers (e.g. BioCoreSphere)
            if (sharedAnalyserRef) sharedAnalyserRef.current = analyser;
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
        setCurrentTime(0);
        setDuration(0);
        audio.load();
        if (playing) {
            audio.play().catch(() => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    // Apply volume + mute
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = muted ? 0 : volume;
    }, [volume, muted]);

    // Audio time / duration listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return undefined;

        const onTime = () => {
            if (!seekingRef.current) setCurrentTime(audio.currentTime);
        };
        const onMeta = () => setDuration(audio.duration || 0);
        const onEnd = () => next();

        audio.addEventListener("timeupdate", onTime);
        audio.addEventListener("loadedmetadata", onMeta);
        audio.addEventListener("durationchange", onMeta);
        audio.addEventListener("ended", onEnd);

        return () => {
            audio.removeEventListener("timeupdate", onTime);
            audio.removeEventListener("loadedmetadata", onMeta);
            audio.removeEventListener("durationchange", onMeta);
            audio.removeEventListener("ended", onEnd);
        };
    }, [next]);

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

    useEffect(() => {
        return () => {
            cancelAnimationFrame(rafRef.current);
            if (audioCtxRef.current) {
                audioCtxRef.current.close().catch(() => {});
            }
            if (sharedAnalyserRef) sharedAnalyserRef.current = null;
        };
    }, [sharedAnalyserRef]);

    const seekPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const volPercent = (muted ? 0 : volume) * 100;

    return (
        <div
            data-testid="music-player"
            className="fixed bottom-10 right-0 left-0 sm:left-auto sm:bottom-7 sm:right-8 z-40 flex flex-col items-stretch gap-2 sm:w-[360px] music-player-wrap"
        >
            <audio
                ref={audioRef}
                src={currentTrack.url}
                crossOrigin="anonymous"
                preload="auto"
            />

            <div
                className="flex flex-col p-2 pr-2.5 backdrop-blur-md border-t border-[var(--line-strong)] sm:border music-player-card"
                style={{ background: "rgba(8, 9, 13, 0.88)" }}
            >
                <div className="flex items-center gap-3">
                    <div
    data-testid="player-album-art"
    className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden border border-white/10"
>
    <img
        src={currentTrack.artwork}
        alt={currentTrack.title}
        className="w-full h-full object-cover"
    />
</div>

                    <div className="min-w-0 flex-1">
                        <div className="font-mono text-[9px] tracking-label text-[var(--text-dim)] uppercase hidden sm:block">
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

                {/* Compact scrubber + volume — INSIDE the card */}
                <div className="player-meta-row hidden sm:flex items-center gap-2">
                    <span
                        className="player-time font-mono"
                        data-testid="player-time-current"
                    >
                        {fmt(currentTime)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        step="0.1"
                        value={Math.min(currentTime, duration || 0)}
                        onMouseDown={() => { seekingRef.current = true; }}
                        onTouchStart={() => { seekingRef.current = true; }}
                        onChange={(e) => {
                            const t = parseFloat(e.target.value);
                            setCurrentTime(t);
                        }}
                        onMouseUp={(e) => {
                            const t = parseFloat(e.target.value);
                            if (audioRef.current) audioRef.current.currentTime = t;
                            seekingRef.current = false;
                        }}
                        onTouchEnd={(e) => {
                            const t = parseFloat(e.target.value);
                            if (audioRef.current) audioRef.current.currentTime = t;
                            seekingRef.current = false;
                        }}
                        aria-label="Seek"
                        data-testid="player-seek-slider"
                        className="player-seek-slider flex-1"
                        style={{ "--seek": `${seekPercent}%` }}
                        disabled={!duration}
                    />
                    <span
                        className="player-time font-mono"
                        data-testid="player-time-duration"
                    >
                        {fmt(duration)}
                    </span>

                    <span className="player-meta-divider" aria-hidden="true" />

                    <button
                        type="button"
                        onClick={() => setMuted((m) => !m)}
                        aria-label={muted ? "Unmute" : "Mute"}
                        data-testid="player-mute-button"
                        className="text-[var(--text-dim)] hover:text-white transition-colors flex-shrink-0"
                    >
                        {muted || volume === 0 ? (
                            <VolumeX size={10} strokeWidth={1.5} />
                        ) : (
                            <Volume2 size={10} strokeWidth={1.5} />
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
                        className="player-volume-slider player-volume-slider--mini"
                        style={{ "--vol": `${volPercent}%` }}
                    />
                </div>
            </div>

            {/* Waveform — outside card, unchanged */}
            <div
                data-testid="player-waveform"
                className="hidden sm:flex items-center justify-between h-6 px-1"
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

            {/* Mobile-only thin progress strip beneath the bar */}
            <div
                className="sm:hidden player-mobile-progress"
                aria-hidden="true"
            >
                <span style={{ width: `${seekPercent}%` }} />
            </div>
        </div>
    );
}
