import { useState, useRef } from "react";
import BioCoreSphere from "./BioCoreSphere";
import SinglePopup from "./SinglePopup";
import { Link } from "react-router-dom";

const SERVICES = [
    { slug: "guitar-recording", label: "GUITAR RECORDING" },
    { slug: "production", label: "PRODUCTION" },
    { slug: "composing", label: "COMPOSING" },
    { slug: "mixing-mastering", label: "MIXING & MASTERING" },
];

export default function Hero() {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef(null);

    const handleEnter = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setOpen(true);
    };
    const handleLeave = () => {
        closeTimer.current = setTimeout(() => setOpen(false), 180);
    };

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

            {/* Upcoming single pop-up (auto-dismiss) */}
            <SinglePopup />

            {/* Vignette over canvas */}
            <div className="absolute inset-0 z-10 pointer-events-none hero-vignette" />

            {/* Top-right: AVAILABLE FOR PROJECTS */}
            <div
                data-testid="hero-availability"
                className="absolute top-7 right-10 z-20 flex items-center gap-2 anim-fade-in delay-1"
            >
                <span
                    className="pulse-dot"
                    aria-hidden="true"
                />
                <span className="font-mono text-[10px] tracking-label text-[var(--text-dim)] uppercase">
                    Available for Projects
                </span>
            </div>

            {/* LEFT: headline block */}
            <div
                data-testid="hero-left"
                className="absolute left-28 md:left-36 top-[18%] z-20 max-w-[640px] pr-6"
            >
                <div
                    data-testid="hero-artist-name"
                    className="font-display uppercase headline-stone leading-none mb-3 anim-slide-left delay-1"
                    style={{
                        fontSize: "clamp(1.6rem, 2.4vw, 2.4rem)",
                        letterSpacing: "0.32em",
                        fontWeight: 400,
                    }}
                >
                    <span>Wonji</span>
                </div>

                <div
                    data-testid="hero-label"
                    className="font-mono text-[10px] tracking-label text-[var(--text-dim)] mb-7 uppercase anim-slide-left delay-1 flex items-center gap-3"
                >
                    <span className="h-px w-6" style={{ background: "rgba(106,0,255,0.6)" }} />
                    Guitarist · Producer · Composer
                </div>

                <h1
                    data-testid="hero-headline"
                    className="hero-headline font-display uppercase headline-stone"
                    style={{
                        fontSize: "clamp(3.4rem, 7.6vw, 8.2rem)",
                        lineHeight: "0.92",
                        letterSpacing: "0.005em",
                        fontWeight: 400,
                    }}
                >
                    <span className="block anim-slide-left delay-2">Heavy</span>
                    <span className="block anim-slide-left delay-3">Music</span>
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
                    High-end guitar work, mixing and orchestral composition.
                </p>
            </div>

            {/* RIGHT: services trigger (thin strip on right edge) */}
            <div
                id="gear"
                data-testid="services-trigger"
                className={`services-trigger-fixed hidden md:flex ${open ? "is-open" : ""}`}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
            >
                <span className="services-trigger-label">SERVICES</span>
            </div>

            {/* Sliding panel */}
            <div
                data-testid="services-panel"
                className={`services-panel-fixed hidden md:block ${open ? "is-open" : ""}`}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
            >
                <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] mb-6 uppercase">
                    Services
                </div>
                <ul data-testid="services-list" className="flex flex-col">
                    {SERVICES.map((s) => (
                        <li
                            key={s.slug}
                            data-testid={`service-item-${s.slug}`}
                        >
                            <Link to={`/services/${s.slug}`} className="service-row">
                                <span className="service-bar" aria-hidden="true" />
                                <span className="service-text">{s.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
