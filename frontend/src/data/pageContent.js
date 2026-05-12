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
            { label: "Collapse Protocol - BOXHEAD: Immortal OST", meta: "PRODUCED · MIXED · 2025" },
            { label: "Forgotten Lands", meta: "RECORDED · COMPOSED · 2025" },
            { label: "A Glimpse Of Epiphany", meta: "RECORDED · COMPOSED · 2025" },
            { label: "Reach For The Stars Or Fall In Space", meta: "PRODUCED · 2023" },
            { label: "Prelude To Glory", meta: "RECORDED · COMPOSED · 2023" },
        ],
    },
    music: {
        eyebrow: "01 — Catalog",
        title: ["Music"],
        subtitle:
            "Original tracks, singles and works in progress. Streaming everywhere once they drop — start with the latest single.",
        body: [
            { label: "Collapse Protocol - BOXHEAD: Immortal OST", meta: "PRODUCED · MIXED · 2025" },
            { label: "Forgotten Lands", meta: "RECORDED · COMPOSED · 2025" },
            { label: "A Glimpse Of Epiphany", meta: "RECORDED · COMPOSED · 2025" },
            { label: "Reach For The Stars Or Fall In Space", meta: "PRODUCED · 2023" },
            { label: "Prelude To Glory", meta: "RECORDED · COMPOSED · 2023" },
        ],
    },
    about: {
        eyebrow: "02 — Profile",
        title: ["About"],
        subtitle:
            "Wonji is a musician, guitarist, producer, and composer with a lifelong background in music and years of live performance experience. Inspired by metal music, cinematic scores, and epic orchestral soundtracks for games, he creates music that blends intensity, emotion, and imagination. With a strong passion for storytelling through sound, his work focuses on creating immersive musical worlds that leave a lasting impact. For Wonji, music is more than entertainment, it’s a way to express something meaningful and leave a legacy that lives on beyond a lifetime.",
        body: [
            { label: "Discipline", meta: "MODERN METAL · CINEMATIC · POST-GENRE" },
            { label: "Background", meta: "12+ YEARS · CONSERVATORY TRAINED" },
            { label: "Languages", meta: "ENGLISH · GREEK · BULGARIAN · GERMAN" },
            { label: "Studio", meta: "ORPHIC SOUNDWORKS STUDIO · HANNOVER, GERMANY" },
            { label: "Approach", meta: "SLOW, CONSIDERED, ARCHIVAL" },
        ],
    },
    gear: {
        eyebrow: "03 — Signal Chain",
        title: ["Gear"],
        subtitle:
            "A focused, opinionated rig — built for tonal density, fast attack and headroom-on-demand.",
        body: [
            { label: "Guitars", meta: "IBANEZ PRESTIGE RG1570 · PRS 277 SE BARITONE" },
            { label: "Amps", meta: "NEURAL DSP QUAD CORTEX · AXE FX ULTRA" },
            { label: "Interface", meta: "FOCUSRITE SCARLETT 18i20" },
            { label: "Monitors", meta: "GENELEC 8030CP" },
            { label: "DAWs", meta: "STUDIO ONE PRO 7 · CUBASE" },
        ],
    },
    contact: {
        eyebrow: "04 — Inquiries",
        title: ["Contact"],
        subtitle:
            "Booking, sessions, scoring or production conversations. All serious inquiries answered within two business days.",
        body: [
            { label: "Booking", meta: "INFO@WONJIMUSIC.COM" },
            { label: "Location", meta: "HANNOVER, GERMANY · REMOTE STEMS WORLDWIDE" },
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
            "Tone design",
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
            { k: "DELIVERABLES", v: "STEMS · MIX BOUNCE · PROJECT FILE · TABS" },
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
            "Original composition for film, game, trailer and artist projects — orchestral, hybrid metal and atmospheric works.",
        details: [
            { k: "FORMAT", v: "CUE-BASED · FULL SCORE" },
            { k: "TURNAROUND", v: "VARIES BY SCOPE" },
            { k: "DELIVERABLES", v: "STEMS · SCORES" },
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
