/**
 * Lightweight, CSS-only deep-space backdrop for non-hero pages.
 * No WebGL — keeps template pages fast and distraction-free.
 */
export default function SpaceBackground() {
    return (
        <div className="space-bg" aria-hidden="true" data-testid="space-bg">
            <div className="space-bg-stars" />
            <div className="space-bg-stars space-bg-stars-2" />
            <div className="space-bg-glow" />
        </div>
    );
}
