import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SpaceBackground from "../components/SpaceBackground";
import { SERVICES } from "../data/pageContent";

/**
 * Template page for the 4 services (Guitar Recording, Production, Composing, Mixing & Mastering).
 * Same shell but a distinct layout: details column + process timeline.
 */
export default function ServicePage() {
    const { slug } = useParams();
    const data = SERVICES[slug];
    if (!data) return <Navigate to="/" replace />;

    return (
        <section
            data-testid={`service-page-${slug}`}
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

            {/* HOME link */}
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
                data-testid="service-content"
                className="relative z-20 px-28 md:px-36 pt-[16%] pb-28 max-w-[1400px]"
            >
                <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] mb-7 uppercase anim-slide-left delay-1">
                    {data.eyebrow}
                </div>

                <h1
                    data-testid="service-title"
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

                {/* Two-column layout: details + process */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-x-20 gap-y-12">
                    {/* Details */}
                    <div className="anim-fade-up" style={{ animationDelay: "400ms" }}>
                        <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] uppercase mb-5">
                            Engagement Details
                        </div>
                        <dl className="flex flex-col">
                            {data.details.map((d, i) => (
                                <div key={d.k} className="service-detail-row" data-testid={`service-detail-${i}`}>
                                    <dt className="service-detail-key font-mono">{d.k}</dt>
                                    <dt className="service-detail-divider" aria-hidden="true" />
                                    <dd className="service-detail-val font-mono">{d.v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Process */}
                    <div className="anim-fade-up" style={{ animationDelay: "500ms" }}>
                        <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] uppercase mb-5">
                            Process
                        </div>
                        <ol className="flex flex-col">
                            {data.process.map((step, i) => (
                                <li
                                    key={step}
                                    data-testid={`service-step-${i}`}
                                    className="service-step"
                                >
                                    <span className="service-step-num font-mono">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="service-step-text">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 anim-fade-up" style={{ animationDelay: "650ms" }}>
                    <Link
                        to="/contact"
                        data-testid="service-cta"
                        className="btn-box"
                    >
                        <span>REQUEST QUOTE</span>
                        <span className="btn-arrow">
                            <ArrowUpRight size={14} strokeWidth={1.5} />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
