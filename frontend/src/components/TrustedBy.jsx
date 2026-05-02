const BANDS = [
    { name: "MESHUGGAH", style: "font-display tracking-wider-2" },
    { name: "BETRAYING THE MARTYRS", style: "font-display tracking-wider-2" },
    { name: "BORN OF OSIRIS", style: "font-display tracking-wider-2" },
    { name: "THE CONTORTIONIST", style: "font-display tracking-wider-2" },
    { name: "GHOSTKEEPER", style: "font-display tracking-wider-2" },
];

export default function TrustedBy() {
    return (
        <section
            data-testid="trusted-by"
            className="absolute bottom-7 left-28 md:left-36 z-20 hidden md:block"
            style={{ width: "min(720px, calc(100vw - 480px))" }}
        >
            <div className="font-mono text-[10px] tracking-label text-[var(--text-dim)] uppercase mb-4 anim-fade-in delay-6">
                Trusted by
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 anim-fade-up delay-6">
                {BANDS.map((b) => (
                    <span
                        key={b.name}
                        data-testid={`band-${b.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className={`${b.style} text-[15px] md:text-[17px] uppercase select-none`}
                        style={{
                            color: "rgba(208,208,208,0.45)",
                            textShadow: "0 1px 0 rgba(0,0,0,0.6)",
                            letterSpacing: "0.18em",
                        }}
                    >
                        {b.name}
                    </span>
                ))}
            </div>
        </section>
    );
}
