import BioCoreSphere from "./BioCoreSphere";
import { ArrowUpRight } from "lucide-react";

const SERVICES = [
    "Guitar Recording",
    "Music Production",
    "Composing",
    "Mixing & Mastering",
];

export default function Hero() {
    return (
        <section
            id="work"
            data-testid="hero-section"
            className="relative w-full h-screen min-h-[680px] overflow-hidden"
            style={{ background: "#05070b" }}
        >
            {/* WebGL canvas layer */}
            <div className="absolute inset-0 z-0">
                <BioCoreSphere />
            </div>

            {/* Vignette over canvas to blend edges */}
            <div className="absolute inset-0 z-10 pointer-events-none hero-vignette" />

            {/* Top bar: coordinates / timestamp */}
            <div className="absolute top-8 left-24 md:left-32 right-10 z-20 flex justify-between items-center text-[10px] font-mono tracking-label text-[var(--text-dim)]">
                <div data-testid="hero-coord" className="anim-fade-in delay-1">
                    48°51′N · 2°21′E / STUDIO—01
                </div>
                <div className="hidden sm:block anim-fade-in delay-2">
                    CATALOG / 2024—Ω
                </div>
            </div>

            {/* LEFT: headline block */}
            <div
                data-testid="hero-left"
                className="absolute left-24 md:left-32 top-1/2 -translate-y-1/2 z-20 max-w-[620px] pr-6"
            >
                <div
                    data-testid="hero-label"
                    className="font-mono text-[11px] tracking-label text-[var(--text-dim)] mb-6 flex items-center gap-3 anim-slide-left delay-1"
                >
                    <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{
                            background: "#6a00ff",
                            boxShadow: "0 0 10px 2px rgba(106,0,255,0.7)",
                        }}
                    />
                    GUITARIST · PRODUCER · COMPOSER
                </div>

                <h1
                    data-testid="hero-headline"
                    className="hero-headline font-display uppercase text-white"
                    style={{
                        fontSize: "clamp(3.6rem, 8.4vw, 8.6rem)",
                        lineHeight: "0.88",
                        letterSpacing: "0.005em",
                        fontWeight: 400,
                    }}
                >
                    <span className="block anim-slide-left delay-2">Heavy</span>
                    <span
                        className="block anim-slide-left delay-3"
                        style={{
                            color: "transparent",
                            WebkitTextStroke: "1px rgba(208,208,208,0.55)",
                        }}
                    >
                        Atmospheres
                    </span>
                    <span className="block anim-slide-left delay-4">
                        Precisely
                    </span>
                    <span
                        className="block anim-slide-left delay-5"
                        style={{
                            background:
                                "linear-gradient(90deg, #d0d0d0 0%, #6a00ff 70%, #1a2a6c 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Crafted
                    </span>
                </h1>

                <p
                    data-testid="hero-sub"
                    className="mt-8 max-w-[420px] text-sm md:text-[15px] leading-relaxed text-[var(--text)] opacity-80 anim-fade-up delay-5"
                >
                    High-end guitar work, production, and composition for artists
                    who demand depth, darkness, and clarity.
                </p>

                <div className="mt-10 anim-fade-up delay-6">
                    <a
                        href="#music"
                        data-testid="hero-cta"
                        className="btn-outline"
                    >
                        <span>View Work</span>
                        <ArrowUpRight size={14} strokeWidth={1.5} />
                    </a>
                </div>
            </div>

            {/* RIGHT: services list */}
            <div
                id="gear"
                data-testid="hero-right"
                className="hidden md:block absolute right-10 lg:right-16 top-1/2 -translate-y-1/2 z-20 w-[300px]"
            >
                <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] mb-6 flex items-center gap-3 anim-slide-right delay-3">
                    <span className="h-px w-8 bg-[var(--line-strong)]" />
                    SERVICES
                </div>
                <ul data-testid="services-list" className="flex flex-col">
                    {SERVICES.map((s, i) => (
                        <li
                            key={s}
                            data-testid={`service-item-${i}`}
                            className="service-item anim-slide-right"
                            style={{ animationDelay: `${400 + i * 120}ms` }}
                        >
                            <span>{s}</span>
                            <span className="idx">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="mt-8 font-mono text-[10px] tracking-label text-[var(--text-dim)] anim-fade-up delay-6">
                    <div className="flex items-center justify-between">
                        <span>BOOKING / 2025</span>
                        <span className="text-white" style={{ textShadow: "0 0 8px rgba(106,0,255,0.5)" }}>OPEN</span>
                    </div>
                </div>
            </div>

            {/* Bottom-left: tagline scroll */}
            <div className="hidden md:flex absolute left-24 md:left-32 bottom-8 z-20 items-center gap-4 text-[10px] font-mono tracking-label text-[var(--text-dim)]">
                <span className="anim-fade-in delay-6">SCROLL</span>
                <span
                    className="h-px w-16"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(208,208,208,0.35), transparent)",
                    }}
                />
                <span className="anim-fade-in delay-6">MUSIC · ABOUT · CONTACT</span>
            </div>
        </section>
    );
}
