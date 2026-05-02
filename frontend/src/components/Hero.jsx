import BioCoreSphere from "./BioCoreSphere";
import { ArrowRight } from "lucide-react";

const SERVICES = [
    "GUITAR RECORDING",
    "PRODUCTION",
    "COMPOSING",
    "MIXING & MASTERING",
];

export default function Hero() {
    return (
        <section
            id="work"
            data-testid="hero-section"
            className="relative w-full h-screen min-h-[760px] overflow-hidden"
            style={{ background: "#05060a" }}
        >
            {/* WebGL canvas layer */}
            <div className="absolute inset-0 z-0">
                <BioCoreSphere />
            </div>

            {/* Vignette over canvas */}
            <div className="absolute inset-0 z-10 pointer-events-none hero-vignette" />

            {/* Top-right: AVAILABLE FOR PROJECTS */}
            <div
                data-testid="hero-availability"
                className="absolute top-7 right-10 z-20 flex items-center gap-2 anim-fade-in delay-1"
            >
                <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{
                        background: "#6a00ff",
                        boxShadow: "0 0 8px 1px rgba(106,0,255,0.85)",
                    }}
                />
                <span className="font-mono text-[10px] tracking-label text-[var(--text-dim)] uppercase">
                    Available for Projects
                </span>
            </div>

            {/* SIGNAL HUD (upper-right of sphere) */}
            <div
                data-testid="hud-signal"
                className="absolute top-[18%] right-[26%] z-20 hidden lg:flex items-center gap-2 anim-fade-in delay-3"
            >
                <span className="block w-2 h-2 border border-[var(--text-dim)] rotate-45 opacity-70" />
                <span className="font-mono text-[10px] tracking-label text-[var(--text-dim)]">
                    SIGNAL 23.7
                </span>
            </div>

            {/* AMPLITUDE HUD (lower-right of sphere) */}
            <div
                data-testid="hud-amplitude"
                className="absolute bottom-[24%] right-[24%] z-20 hidden lg:flex items-center gap-2 anim-fade-in delay-3"
            >
                <span
                    className="block h-px w-10"
                    style={{ background: "rgba(208,208,208,0.4)" }}
                />
                <span className="font-mono text-[10px] tracking-label text-[var(--text-dim)]">
                    AMPLITUDE 84%
                </span>
            </div>

            {/* LEFT: headline block */}
            <div
                data-testid="hero-left"
                className="absolute left-28 md:left-36 top-[18%] z-20 max-w-[640px] pr-6"
            >
                <div
                    data-testid="hero-label"
                    className="font-mono text-[10px] tracking-label text-[var(--text-dim)] mb-7 uppercase anim-slide-left delay-1"
                >
                    Guitarist · Producer · Composer
                </div>

                <h1
                    data-testid="hero-headline"
                    className="hero-headline font-display uppercase headline-stone"
                    style={{
                        fontSize: "clamp(3.6rem, 8.6vw, 9.2rem)",
                        lineHeight: "0.92",
                        letterSpacing: "0.005em",
                        fontWeight: 400,
                    }}
                >
                    <span className="block anim-slide-left delay-2">Heavy</span>
                    <span className="block anim-slide-left delay-3">Atmospheres</span>
                    <span className="block anim-slide-left delay-4">Precisely</span>
                    <span className="block anim-slide-left delay-5">Crafted</span>
                </h1>

                {/* Divider tick */}
                <div
                    className="mt-9 mb-5 h-px w-10 anim-fade-in delay-5"
                    style={{ background: "rgba(208,208,208,0.35)" }}
                />

                <p
                    data-testid="hero-sub"
                    className="max-w-[400px] text-sm md:text-[14px] leading-relaxed text-[var(--text)] opacity-75 anim-fade-up delay-5"
                >
                    High-end guitar work, mixing and orchestral composition for artists
                    who demand darkness, depth and impact.
                </p>

                <div className="mt-9 anim-fade-up delay-6">
                    <a
                        href="#music"
                        data-testid="hero-cta"
                        className="btn-box"
                    >
                        <span>VIEW WORK</span>
                        <span className="btn-arrow">
                            <ArrowRight size={14} strokeWidth={1.5} />
                        </span>
                    </a>
                </div>
            </div>

            {/* RIGHT: services list */}
            <div
                id="gear"
                data-testid="hero-right"
                className="hidden md:block absolute right-10 lg:right-14 top-[34%] z-20"
            >
                <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] mb-6 uppercase anim-slide-right delay-3">
                    Services
                </div>
                <ul data-testid="services-list" className="flex flex-col">
                    {SERVICES.map((s, i) => (
                        <li
                            key={s}
                            data-testid={`service-item-${i}`}
                            className="service-row anim-slide-right"
                            style={{ animationDelay: `${380 + i * 110}ms` }}
                        >
                            <span className="service-bar" aria-hidden="true" />
                            <span className="service-text">{s}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
