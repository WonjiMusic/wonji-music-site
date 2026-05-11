import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SpaceBackground from "../components/SpaceBackground";
import { SECTIONS } from "../data/pageContent";

/**
 * Template page for the 5 nav sections (Work, Music, About, Gear, Contact).
 * No 3D sphere; just the deep-space CSS backdrop + content.
 */
export default function SectionPage() {
    const { slug } = useParams();
    const data = SECTIONS[slug];
    if (!data) return <Navigate to="/" replace />;

    return (
        <section
            data-testid={`section-page-${slug}`}
            className="relative w-full min-h-screen overflow-hidden"
            style={{ background: "#05060a" }}
        >
            <SpaceBackground />
            <div className="absolute inset-0 z-10 pointer-events-none hero-vignette" />

            {/* Top-right availability badge */}
            <div className="absolute top-7 right-10 z-20 flex items-center gap-2 anim-fade-in delay-1">
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

            {/* HOME link top-center-left */}
            <Link
                to="/"
                data-testid="home-button"
                className="absolute top-7 left-32 md:left-40 z-20 home-link"
            >
                <ArrowLeft size={12} strokeWidth={1.4} />
                <span>HOME</span>
            </Link>

            {/* Content */}
            <div
                data-testid="section-content"
                className="relative z-20 px-28 md:px-36 pt-[18%] pb-28 max-w-[1400px]"
            >
                <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] mb-7 uppercase anim-slide-left delay-1">
                    {data.eyebrow}
                </div>

                <h1
                    data-testid="section-title"
                    className="font-display uppercase headline-stone"
                    style={{
                        fontSize: "clamp(3.4rem, 7.6vw, 8.2rem)",
                        lineHeight: "0.92",
                        letterSpacing: "0.005em",
                        fontWeight: 400,
                    }}
                >
                    {data.title.map((line, i) => (
                        <span
                            key={i}
                            className={`block anim-slide-left delay-${i + 2}`}
                        >
                            {line}
                        </span>
                    ))}
                </h1>

                <div
                    className="mt-9 mb-5 h-px w-10 anim-fade-in delay-4"
                    style={{ background: "rgba(208,208,208,0.35)" }}
                />

                <p className="max-w-[560px] text-sm md:text-[14px] leading-relaxed text-[var(--text)] opacity-75 anim-fade-up delay-4">
                    {data.subtitle}
                </p>

                {/* Body list */}
                <ul className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0 max-w-[920px]">
                    {data.body.map((item, i) => (
                        <li
                            key={item.label}
                            data-testid={`section-row-${i}`}
                            className="section-row anim-fade-up"
                            style={{ animationDelay: `${400 + i * 80}ms` }}
                        >
                            <span className="section-row-num font-mono">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="section-row-label">{item.label}</span>
                            <span className="section-row-meta font-mono">{item.meta}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
