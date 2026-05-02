import { Instagram, Youtube } from "lucide-react";

const NAV = [
    { id: "work", label: "WORK" },
    { id: "music", label: "MUSIC" },
    { id: "about", label: "ABOUT" },
    { id: "gear", label: "GEAR" },
    { id: "contact", label: "CONTACT" },
];

const SpotifyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.224.363-.706.48-1.069.257-2.928-1.789-6.616-2.194-10.957-1.202-.415.094-.828-.166-.923-.58-.094-.415.165-.828.579-.923 4.75-1.086 8.824-.621 12.11 1.377.363.224.479.706.26 1.071zm1.473-3.267c-.282.458-.882.602-1.339.32-3.352-2.061-8.464-2.658-12.432-1.453-.512.155-1.055-.134-1.21-.645-.154-.512.134-1.055.646-1.21 4.529-1.374 10.167-.71 14.013 1.652.457.282.602.882.322 1.336zm.128-3.403C15.16 8.393 8.5 8.206 4.868 9.301c-.613.186-1.261-.158-1.447-.77-.186-.614.158-1.262.77-1.448 4.171-1.263 11.528-1.042 16.075 1.648.554.328.734 1.043.407 1.596-.328.553-1.044.735-1.596.407z" />
    </svg>
);
const SoundCloudIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c0 .055.045.094.09.094s.089-.045.104-.104l.21-1.319-.21-1.319c0-.061-.044-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.119.12.061 0 .105-.061.121-.12l.254-2.474-.254-2.548c-.016-.06-.061-.12-.121-.12m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.15l.24-2.532-.24-2.64c0-.075-.06-.135-.15-.135m1.155.36c-.005-.09-.075-.149-.159-.149-.09 0-.158.06-.164.149l-.217 2.43.2 2.563c0 .09.075.157.159.157.074 0 .148-.068.148-.158l.227-2.563-.227-2.43m.824-1.124c-.09 0-.18.07-.18.18l-.21 3.349.21 2.43c0 .089.09.164.18.164.091 0 .181-.075.181-.18l.241-2.414-.241-3.35c0-.104-.089-.179-.18-.179m.886-.714c-.105 0-.195.09-.21.194l-.18 4.048.18 2.43c.015.12.105.209.21.209a.204.204 0 0 0 .209-.209l.217-2.43-.227-4.048c0-.12-.09-.194-.2-.194m1.228-.21c-.104 0-.225.09-.225.225l-.158 4.248.158 2.43c0 .119.104.224.225.224.119 0 .225-.12.225-.24l.18-2.414-.18-4.258c0-.119-.106-.225-.225-.225m.855.075c-.135 0-.24.104-.24.24l-.165 4.133.165 2.414c0 .135.105.24.24.24.119 0 .24-.121.24-.255l.18-2.398-.18-4.153c0-.15-.121-.222-.24-.222m.914-.24c-.132 0-.256.115-.256.255l-.135 4.35.135 2.398c0 .134.121.255.256.255.135 0 .255-.121.255-.255l.165-2.384-.165-4.371c0-.135-.105-.259-.255-.259m6.503-1.723c-.87-.81-2.02-1.32-3.3-1.32-.81 0-1.56.212-2.22.586-.435.255-.645.435-.645.81v12.72c0 .27.135.465.27.51.135.04 1.485.12 2.88.12 3.915 0 7.17-3.255 7.17-7.185 0-2.61-1.464-4.89-3.63-6.045-.108-.066-.135-.09-.345-.195z" />
    </svg>
);

// Diamond/shield logo
const Logo = () => (
    <svg width="26" height="36" viewBox="0 0 26 36" fill="none" aria-hidden="true">
        <path
            d="M13 1 L25 9 L24 26 L13 35 L2 26 L1 9 Z"
            stroke="rgba(208,208,208,0.85)"
            strokeWidth="0.8"
            fill="none"
        />
        <path
            d="M13 7 L20 11.5 L19.6 23 L13 28 L6.4 23 L6 11.5 Z"
            stroke="rgba(106,0,255,0.55)"
            strokeWidth="0.6"
            fill="none"
        />
        <path
            d="M13 7 L13 28 M6 11.5 L20 11.5 M6.4 23 L19.6 23"
            stroke="rgba(208,208,208,0.35)"
            strokeWidth="0.4"
        />
    </svg>
);

export default function LeftNav({ activeSection }) {
    return (
        <nav
            data-testid="left-nav"
            className="fixed left-0 top-0 h-screen w-20 md:w-24 z-30 flex flex-col items-center justify-between py-7"
        >
            {/* Logo */}
            <div data-testid="nav-logo" className="select-none">
                <Logo />
            </div>

            {/* Nav links - horizontal labels with dot separators */}
            <ul className="flex flex-col gap-0 items-center text-center">
                {NAV.map((item, idx) => (
                    <li key={item.id} className="flex flex-col items-center">
                        <a
                            href={`#${item.id}`}
                            data-testid={`nav-link-${item.id}`}
                            className={`nav-link-h ${activeSection === item.id ? "active" : ""}`}
                        >
                            {item.label}
                        </a>
                        {idx < NAV.length - 1 && (
                            <span className="nav-sep" aria-hidden="true">·</span>
                        )}
                    </li>
                ))}
            </ul>

            {/* Socials */}
            <div className="flex flex-col gap-5 items-center text-[var(--text-dim)]">
                <a
                    href="#"
                    data-testid="social-instagram"
                    aria-label="Instagram"
                    className="social-ico"
                >
                    <Instagram size={14} strokeWidth={1.4} />
                </a>
                <a
                    href="#"
                    data-testid="social-youtube"
                    aria-label="YouTube"
                    className="social-ico"
                >
                    <Youtube size={16} strokeWidth={1.4} />
                </a>
                <a
                    href="#"
                    data-testid="social-spotify"
                    aria-label="Spotify"
                    className="social-ico"
                >
                    <SpotifyIcon />
                </a>
                <a
                    href="#"
                    data-testid="social-soundcloud"
                    aria-label="SoundCloud"
                    className="social-ico"
                >
                    <SoundCloudIcon />
                </a>
            </div>
        </nav>
    );
}
