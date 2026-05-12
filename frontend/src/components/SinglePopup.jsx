import { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * SinglePopup — appears at the top-center of the home page on first load to
 * announce an upcoming single. Includes glitch-style entry and exit animations.
 *
 * Hidden after the user dismisses or after VISIBLE_MS. Once dismissed it does NOT
 * reappear within the same session (sessionStorage flag).
 */
const VISIBLE_MS = 6500;      // total time visible
const EXIT_LEAD_MS = 700;     // start exit animation N ms before unmount
const STORAGE_KEY = "wonji_single_popup_seen";

const POPUP = {
    title: "Panic Attack",
    label: "Upcoming Instrumental",
    release: "Out May 15",
    image: "/single-cover.png", // user will drop this file in /app/frontend/public/
};

export default function SinglePopup() {
    const [phase, setPhase] = useState("hidden"); // hidden | entering | visible | leaving | gone

    useEffect(() => {
        if (typeof window === "undefined") return undefined;
        if (sessionStorage.getItem(STORAGE_KEY) === "1") {
            setPhase("gone");
            return undefined;
        }
        const t0 = setTimeout(() => setPhase("entering"), 600);
        const t1 = setTimeout(() => setPhase("visible"), 600 + 800);
        const t2 = setTimeout(() => setPhase("leaving"), VISIBLE_MS - EXIT_LEAD_MS);
        const t3 = setTimeout(() => {
            setPhase("gone");
            sessionStorage.setItem(STORAGE_KEY, "1");
        }, VISIBLE_MS);
        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    const dismiss = () => {
        setPhase("leaving");
        sessionStorage.setItem(STORAGE_KEY, "1");
        setTimeout(() => setPhase("gone"), EXIT_LEAD_MS);
    };

    if (phase === "gone") return null;

    return (
        <div
            data-testid="single-popup"
            data-phase={phase}
            className={`single-popup single-popup--${phase}`}
            role="status"
            aria-live="polite"
        >
            <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                data-testid="single-popup-close"
                className="single-popup__close"
            >
                <X size={12} strokeWidth={1.5} />
            </button>

            <div className="single-popup__inner">
                <div className="single-popup__cover">
                    <img
                        src={POPUP.image}
                        alt={POPUP.title}
                        width="80"
                        height="80"
                        draggable="false"
                        onError={(e) => {
                            // Fallback: hide broken image and show gradient instead
                            e.currentTarget.style.display = "none";
                        }}
                    />
                    {/* fallback gradient sits behind in case image fails */}
                </div>

                <div className="single-popup__text">
                    <div className="single-popup__label font-mono">
                        <span className="single-popup__dot" aria-hidden="true" />
                        {POPUP.label}
                    </div>
                    <div className="single-popup__title font-display">{POPUP.title}</div>
                    <div className="single-popup__release font-mono">{POPUP.release}</div>
                </div>
            </div>

            {/* Scan-line / glitch layers */}
            <span className="single-popup__scan" aria-hidden="true" />
            <span className="single-popup__glitch single-popup__glitch--a" aria-hidden="true" />
            <span className="single-popup__glitch single-popup__glitch--b" aria-hidden="true" />
        </div>
    );
}
