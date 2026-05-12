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
- **2026-02 — Clickable music tracks**: Music page rows are now buttons; clicking any row plays that track in the global MusicPlayer (toggles play/pause on the active track).
- **2026-02 — Prev / Next on player**: SkipBack and SkipForward buttons cycle through the 6-track playlist; auto-advance on track end.
- **2026-02 — Volume slider + mute**: Range input with custom gradient fill controls `<audio>.volume`; Volume2/VolumeX icon toggles mute.
- **2026-02 — PlayerContext**: Shared state (playlist, currentIndex, playing, volume) consumed by both `SectionPage` (Music) and `MusicPlayer`.
- **2026-02 — Bugfix: HOME link z-index**: `home-button` was at `z-20` same as content wrapper that came after it in DOM; raised to `z-30` on all 4 inner pages so real mouse clicks fire navigation.

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
- Frontend: 14/15 → 15/15 after HOME-button z-fix (self-verified with real mouse click)

## P0/P1/P2 Backlog
- **P1**: Real `RESEND_API_KEY` + `CONTACT_RECIPIENT_EMAIL` from user → unlocks actual email delivery
- **P1**: Real audio URLs for the 5 non-Boxhead tracks (currently all alias to Boxhead OST)
- **P2**: Extract shared `<PageShell>` to remove ServicePage/SectionPage/AboutPage/ContactPage DOM duplication
- **P2**: Log warning if `RESEND_API_KEY` is set but `CONTACT_RECIPIENT_EMAIL` is empty (currently silently degrades to `stored`)
- **P2**: Move logger declaration above `submit_contact` for clarity (cosmetic only)
- **P3**: Persist player state across reloads (localStorage)
- **P3**: Add track scrubber / progress bar to the player
