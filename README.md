# ✨ Celebration Studio
### Premium Cinematic, Animation-First, Multi-Event Celebration Platform

> **Core Principle: UI/UX IS THE PRODUCT.**  
> Celebration Studio is a reusable celebration creation platform built with a Python/Django monolith backend and an animation-first frontend powered by GSAP, Canvas, Three.js, and modern CSS design tokens.

---

## 🌟 The Five Experience Engines

Celebrations are composed of reusable modular scenes that combine seamlessly:

1. **Cinematic Experience (`cinematic`)**
   - Dramatic lighting and vignette
   - Split-word gold typography reveals
   - Circular countdown dial with chime audio cues
   - Triumphant celebratory climaxes
2. **Romantic Dream World (`romantic_dream`)**
   - Physics-based floating sakura and rose petal drifts (Canvas)
   - Interactive click-to-bloom particle sparks
   - Soft environmental lighting and glowing glassmorphism cards
   - Love letters and heartfelt quotes
3. **Memory Lane (`memory_lane`)**
   - Interactive milestone timeline
   - 3D-tilted polaroid keepsake cards with realistic drop-shadows
   - Tap-to-expand memories and handwritten notes
4. **Secret Surprise (`secret_surprise`)**
   - Interactive 3D gift box with silk ribbons and spring lid
   - Tap-to-untie ribbon and unseal vintage wax-sealed envelope
   - High-velocity 300-piece multi-stage confetti cannons
5. **Cosmic Universe (`cosmic_universe`)**
   - Three.js 3D rotating starfield and celestial wireframe sphere
   - Interactive pointer camera parallax
   - Constellation lines and stardust typography reveals
   - Automatic 2D Canvas fallback on devices without WebGL

---

## 🛠️ Technology Architecture

- **Backend:** Python 3.11, Django 5.1, Django ORM, SQLite (local) / PostgreSQL-ready.
- **Frontend:** Semantic HTML5, CSS3 Custom Properties (Design Tokens), Vanilla ES Modules.
- **Animation & 3D:** GSAP 3.12.5, Three.js r128, Canvas Confetti 1.9.3.
- **Soundtrack Engine:** Zero-dependency Web Audio API procedural synthesizer chords (C Major 7, A Minor, F Major 7, D Major) with opt-in user gesture activation and mute toggles.
- **Workflow:** Standard `python manage.py runserver` (No Node.js or npm dev server required!).

---

## 🚀 Quickstart Guide

### 1. Activate Virtual Environment
```powershell
.\.venv\Scripts\Activate.ps1
```

### 2. Apply Database Migrations
```powershell
python manage.py migrate
```

### 3. Seed Realistic Demo Celebrations & Recipients
```powershell
python manage.py seed_celebration_data
```
*Seeds pre-configured celebrations for Elena Vance (Starlit Birthday) and Marcus Chen (Master of Science Graduation).*

### 4. Run the Local Development Server
```powershell
python manage.py runserver
```
Visit `http://127.0.0.1:8000/` in your browser!

---

## 🧭 Application Routes

| Route | Purpose | Description |
| :--- | :--- | :--- |
| `/` | **Landing Page** | Showcase hero, 5-engine interactive overview, live examples |
| `/dashboard/` | **Studio Dashboard** | Real database stats, celebration cards, search, and filters |
| `/create/` | **Creation Wizard** | 4-step guided creator (Occasion → Recipient → Palette → Blueprint) |
| `/celebrations/<id>/edit/` | **Experience Studio** | Dual-pane workbench with live iframe sync & theme switching |
| `/celebrations/<id>/preview/`| **Preview Viewport** | Iframe preview target for the Experience Studio |
| `/c/<slug>/` | **Public Celebration** | Fullscreen distraction-free celebration viewer for recipients |
| `/recipients/` | **VIP Directory** | Reusable recipient profiles and celebration links |
| `/media-vault/` | **Media Vault** | Photo and soundtrack asset management hub |

---

## 🧪 Running Automated Tests

Run the comprehensive Django test suite:
```powershell
python manage.py test celebrations
```
All 10 tests cover model relationships, scene sequencing, password protection gates, studio iframe rendering, and JSON APIs.
