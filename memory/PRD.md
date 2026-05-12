# Wonji — Artist Landing Page

## Original Problem Statement
Dark, minimal, high-performance landing page for a professional guitarist, music producer and composer (Wonji) with a modern metal / cinematic identity. Required: Three.js interactive "bio-core" sphere, reactive music player, MongoDB + Resend contact form, deep-space background, vertical left navigation, custom typography matching a user-provided reference image.

## Stack
- **Frontend**: React, React Router, Three.js (custom shader sphere), Web Audio API, Tailwind, CSS animations
- **Backend**: FastAPI, Motor (async MongoDB), Resend (email — optional)

## Architecture
```
/app/
├── backend/
│   ├── server.py                  # FastAPI app: /api/contact, /api/status
│   ├── tests/test_api.py          # pytest backend tests
│   └── .env                       # MONGO_URL, DB_NAME, CORS_ORIGINS (Resend keys empty)
├── frontend/src/
│   ├── App.js                     # Router + PlayerProvider
│   ├── context/PlayerContext.jsx  # Global playlist/play state
│   ├── components/
│   │   ├── BioCoreSphere.jsx      # Three.js shader sphere
│   │   ├── Hero.jsx               # Home layout
│   │   ├── LeftNav.jsx
│   │   ├── MusicPlayer.jsx        # Fixed player w/ prev/play/next/volume
│   │   ├── SinglePopup.jsx        # Auto-dismissing single promo
│   │   └── SpaceBackground.jsx
│   ├── pages/
│   │   ├── AboutPage.jsx          # Portrait + bio
│   │   ├── ContactPage.jsx        # POSTs /api/contact
│   │   ├── SectionPage.jsx        # Music/work/about/gear/contact templates
│   │   └── ServicePage.jsx
│   ├── data/pageContent.js
│   └── index.css                  # All animations & component CSS
```

## Implemented
### 2026-02 (current session)
- **2026-02 — Track scrubber**: Added `[data-testid=player-seek-slider]` with current / total time labels (`mm:ss / mm:ss`) below the volume bar. Drag scrubs `audio.currentTime`; disabled until metadata loads. Visible on `sm` and above; mobile shows a thin progress strip instead.
- **2026-02 — Full mobile responsiveness**:
  - `LeftNav` splits into vertical desktop nav (`md:flex`) + horizontal pill `[data-testid=mobile-nav]` at top on phones + a bottom-left socials dock `[data-testid=mobile-socials]`.
  - `MusicPlayer` is now visible on mobile too (sits at `bottom-10` to clear the Emergent badge); on mobile only the album art + title + prev/play/next + thin progress strip render — scrubber/volume/waveform hide to save space.
  - `Hero` page: smaller paddings, headline `clamp(2.4rem, 8vw, 8.2rem)`, mobile-only `[data-testid=hero-mobile-services]` list (4 services) since the desktop slide-out drawer is hidden on phones.
  - All inner pages (`SectionPage`, `AboutPage`, `ContactPage`, `ServicePage`): `px-5 sm:px-12 md:px-28 lg:px-36 pt-[26%] sm:pt-[16%] pb-32`. HOME button moved to `top-16 left-4 md:top-7 md:left-40` so it doesn't collide with the mobile-nav pill.
  - Track rows, service detail rows, and section rows all collapse cleanly with `@media (max-width: 639px)` overrides.
- **2026-02 — Clickable music tracks**: Music page rows are buttons; clicking any row plays that track in the global player.
- **2026-02 — Prev / Next on player**: SkipBack/SkipForward cycle through the 6-track playlist; auto-advance on track end.
- **2026-02 — Volume slider + mute**: Range input with gradient fill controls `<audio>.volume`; Volume2/VolumeX toggles mute.
- **2026-02 — PlayerContext**: Shared state (playlist, currentIndex, playing, volume) consumed by `SectionPage` (Music) and `MusicPlayer`.
- **2026-02 — Bugfix: HOME link z-index**: `home-button` was at `z-20` same as content wrapper that came after it in DOM; raised to `z-30` on all 4 inner pages.

### Earlier (handoff)
- Three.js BioCoreSphere with custom shaders, tendrils, mouse tracking
- React Router with Home + 5 inner sections + 4 service detail pages
- Web Audio API reactive waveform visualizer (60-bar analyser)
- POST /api/contact stores to MongoDB; gracefully skips Resend send when keys empty (returns `status:'stored'`)
- SinglePopup ("Panic Attack") with glitch animations, sessionStorage-flagged dismissal
- AboutPage portrait integration

## API
- `GET /api/` → `{message:"Hello World"}`
- `POST /api/contact` → 200 `{id, status:'stored'|'sent', email_id?}`; 422 on bad email / short message
- `GET/POST /api/status` → status checks

## DB Schema
- `contact_submissions`: `{id, name, email, subject, message, created_at, email_status, email_id}`
- `status_checks`: `{id, client_name, timestamp}`

## Test Status
- Backend: 100% pass (5/5) — see `/app/backend/tests/test_api.py`
- Frontend: 100% pass (iteration_2.json) — desktop scrubber, mobile responsiveness, all routes, contact submit verified

## P0/P1/P2 Backlog
- **P1**: Real `RESEND_API_KEY` + `CONTACT_RECIPIENT_EMAIL` from user → unlocks actual email delivery
- **P1**: Real audio URLs for the 5 non-Boxhead tracks (currently all alias to Boxhead OST)
- **P2**: Extract shared `<PageShell>` to remove ServicePage/SectionPage/AboutPage/ContactPage DOM duplication
- **P2**: Keyboard-arrow seek committing to `audio.currentTime` (currently only mouseup/touchend commits)
- **P2**: Error indicator on the scrubber if track metadata fails to load
- **P3**: Persist player state across reloads (localStorage)
- **P3**: Hide / animate the music player when on `/contact` and the user reaches the form (less visual noise)
