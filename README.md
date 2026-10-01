# VILLA LUMINA — Ultra-Luxury 3D Villa Flythrough & Reel Blueprint
**Engineered by Yuvathy Technologies ([yuvathy.in](https://yuvathy.in)) • Powered by EstateOS ([estateos.yuvathy.in](https://estateos.yuvathy.in))**

---

## 🌟 Overview
**VILLA LUMINA** is an Awwwards-tier, continuous **3D architectural flythrough showcase website** built specifically for high-impact visual demonstration on MacBook displays in dark-room environments.

As the viewer scrolls down, the camera performs a **continuous, photorealistic 3D flythrough** through a \$34.5M architectural concrete and glass cliffside mansion:
1. **Zone 01: The Monolithic Arrival** — Floating 14-ft pre-stressed concrete cantilever, dark reflection mirror pool, and biometric pivot entryway.
2. **Zone 02: The Great Salon & Hearth** — Camera glides through glass pocket doors into a 24-ft double-height living room with Italian travertine and floating flame hearth.
3. **Zone 03: The Horizon Infinity Pool** — Glides out to a 65-ft cantilevered zero-edge pool overlooking the Pacific sunset, complete with a sunken lounge and floating volcanic fire bowl.
4. **Zone 04: The Master Sky Sanctuary** — Ascends to the cantilevered upper master suite with 270° frameless corner glass, fluted oak millwork, and smart suite controls.

---

## 🚀 How to Run & Preview
This project is built with **zero external server dependencies** (pure modern HTML5, CSS3, and ES6 JavaScript).

1. **On your Mac or Windows**:
   - Simply double-click `index.html` to open it directly in Safari, Chrome, Arc, or Edge.
   - Or run any local static server if desired.
2. All 4K architectural renders are stored locally in the `/assets` directory for instant offline playback at 60+ FPS.

---

## 🎬 Instagram Reel Filming Guide (Dark Room Setup)

### Recommended Studio Setup:
- **Environment**: Completely dark room.
- **Laptop**: MacBook with keyboard backlight set to warm amber or cyan (~60% brightness).
- **Screen**: Set MacBook display brightness to 85–90% (turn off True Tone and Night Shift for ultra-crisp blacks and glowing contrast).
- **Camera Framing**: 45° angle over the shoulder, showing your hands on the trackpad and the continuous 3D flythrough on the MacBook display.

### ⌨️ Filming Hotkeys (Hands-Free Reel Director):
| Hotkey | Action | Description |
| :--- | :--- | :--- |
| **`Space` or `R`** | **Automated Flythrough** | Initiates an automated, buttery smooth 28-second continuous camera flythrough across all 4 zones of the villa. You can record completely hands-free! |
| **`L`** | **Lighting Toggle** | Instantly switches between **Midnight Obsidian** (deep blue hour & cyan glow) and **Golden Hour** (champagne sunset). |
| **`M`** | **Web Audio Sound** | Toggles procedural luxury ambient drone synthesizer & interactive micro-click audio. |

---

## 🎙️ 30-Second Voiceover Script (Synchronized with 3D Flythrough)

> **[0:00 - 0:05] The Hook (Zone 01 - Arrival):**  
> *"Most business websites look like a static brochure from 2012. We decided to build what a real website should look like."*  
> *(Action: Press `R` or swipe trackpad forward — camera glides towards the glowing entrance of the villa)*
> 
> **[0:05 - 0:12] The Interior Push (Zone 02 - Great Salon):**  
> *"This is a continuous 3D architectural flythrough we engineered at Yuvathy Technologies—interactive CAD minimaps, live hotspots, and zero lag."*  
> *(Action: Camera glides through glass doors into the double-height living room with the fireplace and travertine marble)*
> 
> **[0:12 - 0:20] The Pool & Suite (Zone 03 & 04):**  
> *"To prove what modern web engineering can do for real businesses, we are building 10 custom, high-end websites completely free for 10 growing brands."*  
> *(Action: Camera glides out to the sunset infinity pool deck with the fire bowl, then up into the master suite)*
> 
> **[0:20 - 0:30] Call to Action (CTA):**  
> *"If your company is ready for a modern upgrade, drop your business name and comment **WEBSITE** below. We're picking business #1 directly from the comments of this reel!"*

---

## 🤖 Lead Capture & ManyChat Automation Setup

To filter out casual freebie-seekers and capture qualified business leads:
1. Connect `@yuvathy.in` to **ManyChat** (or Meta Business Suite automated response).
2. Set up trigger: **User comments "WEBSITE" on the reel**.
3. Automated DM response:
   > *"Hey [Name]! 👋 We saw your comment on our 3D architectural flythrough reel. We're selecting 10 registered businesses and brands to build custom modern websites for.*  
   >  
   > *To submit your business for Episode #1, quickly share:*  
   > *1. Your Company Name & Website/Instagram*  
   > *2. What industry/domain you are in*  
   > *3. What your biggest goal is with a new website*  
   >  
   > *Or fill out our 60-second form here: [Your Google Form / Typeform link]*  
   >  
   > *We're announcing the first selected business this week!"*

---

## 📁 Project Architecture
```
marketing-demo-website/
├── index.html              # Master semantic document with full-screen flythrough stage
├── README.md               # Filming guide, hotkeys, script, and ManyChat workflow
├── assets/
│   ├── exterior-arrival.jpg# Zone 01: Monolithic concrete arrival & reflection pool
│   ├── great-room.jpg      # Zone 02: Double-height great salon with linear hearth
│   ├── infinity-pool.jpg   # Zone 03: 65-ft cantilevered infinity pool & fire bowl
│   └── master-suite.jpg    # Zone 04: Upper cantilevered master sky sanctuary
├── css/
│   ├── variables.css       # Obsidian luxury color tokens, typography & glows
│   ├── base.css            # Custom cursor, typography & ambient glow
│   ├── components.css      # Header, HUD pills, EstateOS cards & VIP modal
│   └── tour.css            # Fullscreen flythrough stage, minimap & hotspots
└── js/
    ├── tour-engine.js      # 3D canvas flythrough engine, camera push & parallax
    ├── audio.js            # Web Audio API luxury spatial sound synthesizer
    ├── reel-tour.js        # 28s automated camera director for video recording
    └── main.js             # App lifecycle, modal, and event coordinator
```
