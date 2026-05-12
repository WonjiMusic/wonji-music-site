import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, AlertTriangle } from "lucide-react";
import SpaceBackground from "../components/SpaceBackground";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INFO = [
    { k: "BOOKING", v: "info@wonjimusic.com" },
    { k: "LOCATION", v: "Hannover, Germany · Remote Stems Worldwide" },
    { k: "RESPONSE", v: "MON—FRI · 48H" },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
    const [state, setState] = useState({ status: "idle", error: "" });

    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const validate = () => {
        if (!form.name.trim()) return "Please enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email.";
        if (form.message.trim().length < 10) return "Message must be at least 10 characters.";
        return null;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) {
            setState({ status: "error", error: err });
            return;
        }
        setState({ status: "sending", error: "" });
        try {
            const res = await fetch(`${API}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.detail || "Submission failed.");
            }
            setState({ status: "success", error: "" });
            setForm({ name: "", email: "", subject: "", message: "", website: "" });
        } catch (err) {
            setState({ status: "error", error: err.message || "Something went wrong." });
        }
    };

    return (
        <section
            data-testid="section-page-contact"
            className="relative w-full min-h-screen overflow-hidden"
            style={{ background: "#05060a" }}
        >
            <SpaceBackground />
            <div className="absolute inset-0 z-10 pointer-events-none hero-vignette" />

            {/* Top-right availability badge */}
            <div className="absolute top-7 right-4 md:right-10 z-20 hidden sm:flex items-center gap-2 anim-fade-in delay-1">
                <span className="pulse-dot" aria-hidden="true" />
                <span className="font-mono text-[10px] tracking-label text-[var(--text-dim)] uppercase">
                    Available for Projects
                </span>
            </div>

            <Link
                to="/"
                data-testid="home-button"
                className="absolute top-16 left-4 md:top-7 md:left-40 z-30 home-link"
            >
                <ArrowLeft size={12} strokeWidth={1.4} />
                <span>HOME</span>
            </Link>

            <div
                data-testid="contact-content"
                className="relative z-20 px-5 sm:px-12 md:px-28 lg:px-36 pt-[26%] sm:pt-[14%] pb-32 max-w-[1400px]"
            >
                <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] mb-7 uppercase anim-slide-left delay-1">
                    04 — Inquiries
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
                    <span className="block anim-slide-left delay-2">Contact</span>
                </h1>

                <div
                    className="mt-9 mb-5 h-px w-10 anim-fade-in delay-4"
                    style={{ background: "rgba(208,208,208,0.35)" }}
                />

                <p className="max-w-[560px] text-sm md:text-[14px] leading-relaxed text-[var(--text)] opacity-75 anim-fade-up delay-4">
                    Booking, sessions, scoring or production conversations. All serious inquiries answered within two business days.
                </p>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-x-20 gap-y-14">
                    {/* Form */}
                    <form
                        data-testid="contact-form"
                        onSubmit={onSubmit}
                        className="anim-fade-up"
                        style={{ animationDelay: "300ms" }}
                        noValidate
                    >
                        <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] uppercase mb-5">
                            Send a Message
                        </div>

                        {/* Honeypot — hidden from humans, bots will fill it */}
                        <div className="honeypot-field" aria-hidden="true">
                            <label>
                                Website
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={form.website}
                                    onChange={update("website")}
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <Field label="NAME" required>
                                <input
                                    data-testid="contact-name"
                                    type="text"
                                    value={form.name}
                                    onChange={update("name")}
                                    placeholder="Your name"
                                    autoComplete="name"
                                    className="contact-input"
                                />
                            </Field>
                            <Field label="EMAIL" required>
                                <input
                                    data-testid="contact-email"
                                    type="email"
                                    value={form.email}
                                    onChange={update("email")}
                                    placeholder="you@studio.com"
                                    autoComplete="email"
                                    className="contact-input"
                                />
                            </Field>
                        </div>

                        <Field label="SUBJECT">
                            <input
                                data-testid="contact-subject"
                                type="text"
                                value={form.subject}
                                onChange={update("subject")}
                                placeholder="Briefly — what's the project?"
                                className="contact-input"
                            />
                        </Field>

                        <Field label="MESSAGE" required>
                            <textarea
                                data-testid="contact-message"
                                value={form.message}
                                onChange={update("message")}
                                placeholder="Scope, timing, references, budget range…"
                                rows={6}
                                className="contact-input contact-textarea"
                            />
                        </Field>

                        <div className="flex items-center gap-5 mt-6">
                            <button
                                type="submit"
                                data-testid="contact-submit"
                                className="btn-box"
                                disabled={state.status === "sending"}
                            >
                                <span>
                                    {state.status === "sending" ? "TRANSMITTING…" : "SEND MESSAGE"}
                                </span>
                                <span className="btn-arrow">
                                    <ArrowUpRight size={14} strokeWidth={1.5} />
                                </span>
                            </button>

                            {state.status === "success" && (
                                <div
                                    data-testid="contact-success"
                                    className="contact-msg contact-msg-success"
                                >
                                    <Check size={12} strokeWidth={2} />
                                    <span>Message received. Reply within 48h.</span>
                                </div>
                            )}
                            {state.status === "error" && (
                                <div
                                    data-testid="contact-error"
                                    className="contact-msg contact-msg-error"
                                >
                                    <AlertTriangle size={12} strokeWidth={2} />
                                    <span>{state.error}</span>
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Direct info */}
                    <div className="anim-fade-up" style={{ animationDelay: "400ms" }}>
                        <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] uppercase mb-5">
                            Direct
                        </div>
                        <dl className="flex flex-col">
                            {INFO.map((i) => (
                                <div key={i.k} className="service-detail-row">
                                    <dt className="service-detail-key font-mono">{i.k}</dt>
                                    <dt className="service-detail-divider" aria-hidden="true" />
                                    <dd className="service-detail-val font-mono">{i.v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Field({ label, required, children }) {
    return (
        <label className="contact-field">
            <span className="contact-field-label font-mono">
                {label}
                {required && <span className="contact-required" aria-hidden="true"> *</span>}
            </span>
            {children}
        </label>
    );
}
