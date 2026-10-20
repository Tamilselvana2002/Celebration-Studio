# ✨ Celebration Studio
### Premium 3D/4D Cinematic, Animation-First Celebration Platform

> **100% Serverless Frontend Architecture: HTML5, CSS3, Three.js, GSAP, and Vanilla JavaScript.**  
> Zero server dependencies. Permanent client-side persistence powered by `localStorage` and `IndexedDB`. Deployable to any static host (GitHub Pages, Netlify, Vercel, Render) with 0-second spin-up time.

---

## 🌟 The Five Experience Engines

Celebrations are composed of reusable modular scenes that combine seamlessly:

1. **🎬 Cinematic Experience (`cinematic`)**
   - Dramatic lighting and vignette
   - Split-word gold typography reveals
   - Circular countdown dial with chime audio cues
   - Triumphant celebratory climaxes
2. **🌸 Romantic Dream World (`romantic_dream`)**
   - Physics-based floating sakura and rose petal drifts (Canvas)
   - Interactive click-to-bloom particle sparks
   - Soft environmental lighting and glowing glassmorphism cards
   - Love letters and heartfelt quotes
3. **📷 Memory Lane (`memory_lane`)**
   - Interactive milestone timeline
   - 3D-tilted polaroid keepsake cards with realistic drop-shadows
   - Uncropped ambient photo framing with blurred backdrops
   - Tap-to-expand memories and handwritten notes
4. **🎁 Secret Surprise (`secret_surprise`)**
   - Interactive 3D gift box with silk ribbons and spring lid
   - Tap-to-untie ribbon and unseal vintage wax-sealed envelope
   - High-velocity 300-piece multi-stage confetti cannons
5. **🌌 Cosmic Universe (`cosmic_universe`)**
   - Three.js 3D rotating starfield and celestial wireframe sphere
   - Interactive pointer camera parallax
   - Constellation lines and stardust typography reveals
   - Starlight blessings and wishes stream

---

## 🔮 Modern Animated 3D UI & UX Features

- **Interactive 3D Card Tilt Engine**: Every card responds dynamically to cursor position with realistic 3D perspective tilts (`rotateX`, `rotateY`, `translateZ`) and real-time specular holographic light glares.
- **Ambient Starlight Cursor Follower**: Fluid, glowing starlight aura that trails mouse movement across the atelier workspace.
- **Magnetic 3D Buttons**: Buttons smoothly pull toward the cursor on hover with tactile spring physics and glowing neon borders.
- **Interactive 3D Celebratory Gemstone**: Real-time WebGL 3D gemstone on the landing page with internal star core, orbital celestial rings, stardust particle cloud, and aura resonance morphing.
- **Multi-Track Timeline Engine**: Complete 5-track animation scrubber with 60 FPS playback, timecode readout, and live preview synchronization.
- **Real-Time Auto-Save**: Debounced client-side auto-saving with live glowing status badge (`● Saved ✓`).
- **Zero Server Footprint**: All user celebrations, custom scenes, audio configurations, and photos are saved securely and permanently in the browser.

---

## 🚀 Running the Project

### Option A: Local Web Server (Recommended — Full Clean URL Support)
Run the included zero-dependency server:
```bash
python server.py 8000
```
Then visit:
- Landing Page: `http://localhost:8000/`
- Dashboard: `http://localhost:8000/dashboard/`
- Templates: `http://localhost:8000/templates/`
- Create Celebration: `http://localhost:8000/create/?template=golden_cinema`

### Option B: Built-in Python Server or NPM Serve
```bash
python -m http.server 8000
# or
npx serve .
```
Clean routes (`/create/`, `/dashboard/`, `/templates/`, etc.) automatically forward to their respective pages.

### Option C: Direct File Open
Double-click [`index.html`](index.html) in any modern web browser.

---

## 🏛️ Project Pages

| File | Description |
| :--- | :--- |
| [`index.html`](index.html) | Interactive 3D landing showcase & engine resonance ribbon |
| [`dashboard.html`](dashboard.html) | Creative Studio Atelier dashboard with live metrics & project cards |
| [`templates.html`](templates.html) | 24 curated luxury 3D celebration blueprints gallery |
| [`create.html`](create.html) | Guided 3-step celebration creation wizard |
| [`editor.html`](editor.html) | Full Story Studio creative suite with all 6 tabs & timeline dock |
| [`preview.html`](preview.html) | Live interactive celebration stage playing all 5 modular engines |
| [`media-vault.html`](media-vault.html) | Media Vault for managing photos and uncropped keepsake portraits |
| [`recipients.html`](recipients.html) | VIP Recipient Directory |
| [`profile.html`](profile.html) | Creator Atelier profile & 60 FPS GPU motion preferences |
| [`login.html`](login.html) | Creator Sign In |
| [`register.html`](register.html) | Account Registration |
