import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SpaceBackground from "../components/SpaceBackground";
import { SECTIONS } from "../data/pageContent";

/**
 * About page — custom layout with the artist portrait on the right.
 * Falls back to the generic SectionPage style on the left column.
 */
export default function AboutPage() {
    const data = SECTIONS.about;

    return (
        <section
            data-testid="section-page-about"
            className="relative w-full min-h-screen overflow-hidden"
            style={{ background: "#05060a" }}
        >
            <SpaceBackground />
            <div className="absolute inset-0 z-10 pointer-events-none hero-vignette" />

            {/* Top-right availability badge */}
            <div className="absolute top-7 right-10 z-20 flex items-center gap-2 anim-fade-in delay-1">
                <span className="pulse-dot" aria-hidden="true" />
                <span className="font-mono text-[10px] tracking-label text-[var(--text-dim)] uppercase">
                    Available for Projects
                </span>
            </div>

            <Link
                to="/"
                data-testid="home-button"
                className="absolute top-7 left-32 md:left-40 z-20 home-link"
            >
                <ArrowLeft size={12} strokeWidth={1.4} />
                <span>HOME</span>
            </Link>

            <div
                data-testid="section-content"
                className="relative z-20 px-28 md:px-36 pt-[14%] pb-28 max-w-[1500px]"
            >
                <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] mb-7 uppercase anim-slide-left delay-1">
                    {data.eyebrow}
                </div>

                {/* 2-column grid: bio left, portrait right */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-x-16 gap-y-12">
                    {/* LEFT: bio + body list */}
                    <div>
                        <h1
                            data-testid="section-title"
                            className="font-display uppercase headline-stone"
                            style={{
                                fontSize: "clamp(3.2rem, 6.6vw, 7.2rem)",
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

                        <p className="max-w-[520px] text-sm md:text-[14px] leading-relaxed text-[var(--text)] opacity-75 anim-fade-up delay-4">
                            {data.subtitle}
                        </p>

                        <ul className="mt-12 flex flex-col max-w-[560px]">
                            {data.body.map((item, i) => (
                                <li
                                    key={item.label}
                                    data-testid={`section-row-${i}`}
                                    className="section-row anim-fade-up"
                                    style={{ animationDelay: `${380 + i * 90}ms` }}
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

                    {/* RIGHT: portrait */}
                    <div
                        data-testid="about-portrait"
                        className="about-portrait anim-fade-up"
                        style={{ animationDelay: "350ms" }}
                    >
                        <div className="about-portrait__frame">
                            <img
                                src="/wonji-portrait.jpg"
                                alt="Wonji"
                                draggable="false"
                                className="about-portrait__img"
                            />
                            {/* Corner ticks */}
                            <span className="about-portrait__tick about-portrait__tick--tl" aria-hidden="true" />
                            <span className="about-portrait__tick about-portrait__tick--tr" aria-hidden="true" />
                            <span className="about-portrait__tick about-portrait__tick--bl" aria-hidden="true" />
                            <span className="about-portrait__tick about-portrait__tick--br" aria-hidden="true" />
                            {/* Scanlines overlay */}
                            <span className="about-portrait__scan" aria-hidden="true" />
                        </div>
                        <div className="about-portrait__caption">
                            <div className="about-portrait__line" aria-hidden="true" />
                            <span className="font-mono text-[10px] tracking-label uppercase text-[var(--text-dim)]">
                                Wonji · Studio—01
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
