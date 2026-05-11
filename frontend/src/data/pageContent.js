/**
 * Content data for the 5 nav sections and the 4 services.
 * Used by the two template page components.
 */

export const SECTIONS = {
    work: {
        eyebrow: "01 — Portfolio",
        title: ["Selected", "Work"],
        subtitle:
            "A curated index of records, scores and collaborations across modern metal, cinematic and post-genre projects.",
        body: [
            { label: "Iron Cathedral — The Voidborn", meta: "PRODUCED · MIXED · 2025" },
            { label: "Hollow Spire — Ashbreather", meta: "RECORDED · COMPOSED · 2024" },
            { label: "Black Sun Rituals — Era Null", meta: "MIXED · MASTERED · 2024" },
            { label: "Below The Tide — Meridian VII", meta: "COMPOSED · 2023" },
            { label: "Silent Engine — Korvax", meta: "PRODUCED · 2023" },
        ],
    },
    music: {
        eyebrow: "02 — Catalog",
        title: ["Music"],
        subtitle:
            "Original compositions, soundtracks and singles. Streaming everywhere — start with the EP Void Signals.",
        body: [
            { label: "Void Signals — EP", meta: "2025 · 6 TRACKS" },
            { label: "Arcane Sun — Single", meta: "2025" },
            { label: "Black Liturgy — Album", meta: "2024 · 11 TRACKS" },
            { label: "Filaments — Score", meta: "2023 · FILM" },
            { label: "Demonstrations Vol. I", meta: "2022 · INSTRUMENTAL" },
        ],
    },
    about: {
        eyebrow: "03 — Profile",
        title: ["About"],
        subtitle:
            "Studio-trained guitarist, producer and composer working out of a private facility built around analog warmth and surgical digital control.",
        body: [
            { label: "Discipline", meta: "MODERN METAL · CINEMATIC · POST-GENRE" },
            { label: "Background", meta: "12+ YEARS · CONSERVATORY TRAINED" },
            { label: "Languages", meta: "ENGLISH · FRENCH" },
            { label: "Studio", meta: "STUDIO—01 · PARIS" },
            { label: "Approach", meta: "SLOW, CONSIDERED, ARCHIVAL" },
        ],
    },
    gear: {
        eyebrow: "04 — Signal Chain",
        title: ["Gear"],
        subtitle:
            "A focused, opinionated rig — built for tonal density, fast attack and headroom-on-demand.",
        body: [
            { label: "Guitars", meta: "AB SOLO · MAYONES DUVELL · STRANDBERG" },
            { label: "Amps", meta: "DIEZEL VH4 · KEMPER · NEURAL QUAD" },
            { label: "Interface", meta: "APOLLO X16 · LYNX AURORA(N)" },
            { label: "Monitors", meta: "GENELEC 8351 · BAREFOOT MM27" },
            { label: "DAWs", meta: "PRO TOOLS · CUBASE · REAPER" },
        ],
    },
    contact: {
        eyebrow: "05 — Inquiries",
        title: ["Contact"],
        subtitle:
            "Booking, sessions, scoring or production conversations. All serious inquiries answered within two business days.",
        body: [
            { label: "Booking", meta: "BOOKING@WONJI.STUDIO" },
            { label: "Press", meta: "PRESS@WONJI.STUDIO" },
            { label: "Studio", meta: "+33 1 00 00 00 00" },
            { label: "Location", meta: "PARIS · REMOTE STEMS WORLDWIDE" },
            { label: "Response", meta: "MON—FRI · 48H" },
        ],
    },
};

export const SERVICES = {
    "guitar-recording": {
        eyebrow: "Service / 01",
        title: ["Guitar", "Recording"],
        subtitle:
            "Reference-grade electric and acoustic guitar tracking — recorded in a controlled, low-noise environment with multi-mic capture and amp/IR options.",
        details: [
            { k: "FORMAT", v: "REMOTE STEMS · IN-STUDIO" },
            { k: "TURNAROUND", v: "5—14 DAYS" },
            { k: "DELIVERABLES", v: "WAV 24/96 · DI + WET" },
            { k: "REVISIONS", v: "TWO ROUNDS INCLUDED" },
        ],
        process: [
            "Brief & reference review",
            "Tone design & re-amp sessions",
            "Multi-pass tracking",
            "Stem export & client review",
        ],
    },
    "production": {
        eyebrow: "Service / 02",
        title: ["Music", "Production"],
        subtitle:
            "Full-track production from skeleton demo to release-ready master — arrangement, performance direction, and sonic identity built around the artist.",
        details: [
            { k: "FORMAT", v: "FULL PROJECT · PER-TRACK" },
            { k: "TURNAROUND", v: "3—8 WEEKS" },
            { k: "DELIVERABLES", v: "STEMS · MIX BOUNCE · PROJECT FILE" },
            { k: "REVISIONS", v: "UNLIMITED WITHIN SCOPE" },
        ],
        process: [
            "Pre-production & arrangement",
            "Performance & tracking",
            "Programming & sound design",
            "Mix integration & delivery",
        ],
    },
    "composing": {
        eyebrow: "Service / 03",
        title: ["Composing"],
        subtitle:
            "Original composition for film, game, trailer and artist projects — orchestral, hybrid metal and atmospheric works built to brief.",
        details: [
            { k: "FORMAT", v: "CUE-BASED · FULL SCORE" },
            { k: "TURNAROUND", v: "VARIES BY SCOPE" },
            { k: "DELIVERABLES", v: "STEMS · LIVE PARTS · CONDUCTOR SCORE" },
            { k: "RIGHTS", v: "NEGOTIATED PER PROJECT" },
        ],
        process: [
            "Briefing & temp review",
            "Thematic sketches",
            "Full composition pass",
            "Recording & delivery",
        ],
    },
    "mixing-mastering": {
        eyebrow: "Service / 04",
        title: ["Mixing &", "Mastering"],
        subtitle:
            "Precise, high-impact mixing and transparent mastering — built for streaming loudness standards without sacrificing dynamic intent.",
        details: [
            { k: "FORMAT", v: "PER TRACK · ALBUM RATE" },
            { k: "TURNAROUND", v: "7—21 DAYS" },
            { k: "DELIVERABLES", v: "MASTER + ALT VERSIONS · DDP" },
            { k: "REVISIONS", v: "THREE ROUNDS INCLUDED" },
        ],
        process: [
            "Stem prep & gain staging",
            "Static + automated mix",
            "Master bus shaping",
            "Mastering & format delivery",
        ],
    },
};
