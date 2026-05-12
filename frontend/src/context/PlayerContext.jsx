import { createContext, useContext, useState, useCallback } from "react";

/**
 * Shared player state for the global MusicPlayer + Music page track list.
 * Holds the playlist, current index, play/pause, and volume.
 */

export const PLAYLIST = [
    {
        title: "Boxhead (Immortal) OST",
        meta: "2025 · ORIGINAL SCORE",
        url: "/Boxhead (Immortal) OST.mp3",
    },
    {
        title: "Forgotten Lands",
        meta: "2025",
        url: "/Boxhead (Immortal) OST.mp3",
    },
    {
        title: "A Glimpse of Epiphany",
        meta: "2025",
        url: "/Boxhead (Immortal) OST.mp3",
    },
    {
        title: "Prelude to Glory",
        meta: "2024",
        url: "/Boxhead (Immortal) OST.mp3",
    },
    {
        title: "The Grand Capital",
        meta: "2022",
        url: "/Boxhead (Immortal) OST.mp3",
    },
    {
        title: "Dungeon Ambush",
        meta: "2022",
        url: "/Boxhead (Immortal) OST.mp3",
    },
];

const PlayerCtx = createContext(null);

export function PlayerProvider({ children }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);

    const playIndex = useCallback((idx) => {
        setCurrentIndex(((idx % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length);
        setPlaying(true);
    }, []);

    const togglePlay = useCallback(() => setPlaying((p) => !p), []);

    const next = useCallback(() => {
        setCurrentIndex((i) => (i + 1) % PLAYLIST.length);
        setPlaying(true);
    }, []);

    const prev = useCallback(() => {
        setCurrentIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
        setPlaying(true);
    }, []);

    return (
        <PlayerCtx.Provider
            value={{
                playlist: PLAYLIST,
                currentIndex,
                currentTrack: PLAYLIST[currentIndex],
                playing,
                volume,
                setVolume,
                setPlaying,
                playIndex,
                togglePlay,
                next,
                prev,
            }}
        >
            {children}
        </PlayerCtx.Provider>
    );
}

export function usePlayer() {
    const ctx = useContext(PlayerCtx);
    if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
    return ctx;
}
