import { Link } from "react-router-dom";
import { Instagram, Youtube } from "lucide-react";

const NAV = [
    { id: "work", label: "WORK", to: "/work" },
    { id: "music", label: "MUSIC", to: "/music" },
    { id: "about", label: "ABOUT", to: "/about" },
    { id: "gear", label: "GEAR", to: "/gear" },
    { id: "contact", label: "CONTACT", to: "/contact" },
];

const SpotifyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.224.363-.706.48-1.069.257-2.928-1.789-6.616-2.194-10.957-1.202-.415.094-.828-.166-.923-.58-.094-.415.165-.828.579-.923 4.75-1.086 8.824-.621 12.11 1.377.363.224.479.706.26 1.071zm1.473-3.267c-.282.458-.882.602-1.339.32-3.352-2.061-8.464-2.658-12.432-1.453-.512.155-1.055-.134-1.21-.645-.154-.512.134-1.055.646-1.21 4.529-1.374 10.167-.71 14.013 1.652.457.282.602.882.322 1.336zm.128-3.403C15.16 8.393 8.5 8.206 4.868 9.301c-.613.186-1.261-.158-1.447-.77-.186-.614.158-1.262.77-1.448 4.171-1.263 11.528-1.042 16.075 1.648.554.328.734 1.043.407 1.596-.328.553-1.044.735-1.596.407z" />
    </svg>
);
const SoundCloudIcon = () => (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="currentColor" aria-hidden="true">
        <path d="M0.6 9.5 L0.6 11.5 M2 8 L2 11.6 M3.4 6.5 L3.4 11.7 M4.8 7.2 L4.8 11.6 M6.2 5.0 L6.2 11.7 M7.6 4.6 L7.6 11.7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M9 4.2 V 11.7 H 16.5 a 2.6 2.6 0 0 0 0 -5.2 a 0.5 0.5 0 0 1 -0.4 -0.4 a 3.5 3.5 0 0 0 -6.7 -0.7" stroke="currentColor" strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Logo = () => (
    <img
        src="/logo.png"
        alt="Logo"
        width="56"
        height="32"
        className="logo-img"
        draggable="false"
    />
);

export default function LeftNav({ activeSection }) {
    return (
        <nav
            data-testid="left-nav"
            className="fixed left-0 top-0 h-screen w-20 md:w-24 z-30 flex flex-col items-center justify-between py-7"
        >
            {/* Logo — also functions as Home link */}
            <Link
                to="/"
                data-testid="nav-logo"
                aria-label="Home"
                className="select-none nav-logo-link"
            >
                <Logo />
            </Link>

            {/* Nav links */}
            <ul className="flex flex-col gap-0 items-center text-center">
                {NAV.map((item, idx) => (
                    <li key={item.id} className="flex flex-col items-center">
                        <Link
                            to={item.to}
                            data-testid={`nav-link-${item.id}`}
                            className={`nav-link-h ${activeSection === item.id ? "active" : ""}`}
                        >
                            <span className="nav-link-energy" aria-hidden="true" />
                            <span className="nav-link-text">{item.label}</span>
                        </Link>
                        {idx < NAV.length - 1 && (
                            <span className="nav-sep" aria-hidden="true">·</span>
                        )}
                    </li>
                ))}
            </ul>

            {/* Socials — Spotify, Instagram, YouTube, SoundCloud */}
            <div className="flex flex-col gap-5 items-center text-[var(--text-dim)]">
                <a href="#" data-testid="social-spotify" aria-label="Spotify" className="social-ico">
                    <SpotifyIcon />
                </a>
                <a href="#" data-testid="social-instagram" aria-label="Instagram" className="social-ico">
                    <Instagram size={14} strokeWidth={1.4} />
                </a>
                <a href="#" data-testid="social-youtube" aria-label="YouTube" className="social-ico">
                    <Youtube size={16} strokeWidth={1.4} />
                </a>
                <a href="#" data-testid="social-soundcloud" aria-label="SoundCloud" className="social-ico">
                    <SoundCloudIcon />
                </a>
            </div>
        </nav>
    );
}
