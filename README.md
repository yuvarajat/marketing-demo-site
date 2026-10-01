# LUMINA Sky Residences — Ultra-Luxury 3D Showcase & Reel Blueprint
**Engineered by Yuvathy Technologies ([yuvathy.in](https://yuvathy.in)) • Powered by EstateOS ([estateos.yuvathy.in](https://estateos.yuvathy.in))**

---

## 🌟 Overview
**LUMINA Sky Residences** is an award-winning tier, 3D interactive architectural showcase website built specifically for high-impact visual demonstration on MacBook displays in dark-room environments.

It bridges ultra-luxury design aesthetics with **EstateOS** PropTech infrastructure, positioning **Yuvathy Technologies** as a top-tier digital engineering firm while directly attracting high-ticket real estate developers, brokers, and enterprise clients.

---

## 🚀 How to Run & Preview
This project is built with **zero external server dependencies** (pure modern HTML5, CSS3, ES6 JavaScript, and WebGL Three.js via CDN).

1. **On your Mac or Windows**:
   - Simply double-click `index.html` to open it directly in Safari, Chrome, Arc, or Edge.
   - Or start any local static server if desired.
2. Ensure you have an active internet connection on the first load to pull Three.js and Google Fonts from CDN.

---

## 🎬 Instagram Reel Filming Guide (Dark Room Setup)

### Recommended Studio Setup:
- **Environment**: Completely dark or dimly lit room.
- **Laptop**: MacBook with keyboard backlight set to warm amber or cyan (~60% brightness).
- **Screen**: Set MacBook display brightness to 80–90% (turn off True Tone and Night Shift for accurate blacks and glowing contrast).
- **Camera Framing**: Slight 45° angle over the shoulder, capturing your hands on the trackpad and the glowing display.

### ⌨️ Filming Hotkeys (Hands-Free Reel Director):
| Hotkey | Action | Description |
| :--- | :--- | :--- |
| **`Space` or `R`** | **Cinematic Reel Tour** | Initiates an automated, buttery smooth 28-second choreographed scroll walkthrough with camera pans and unit transitions. You can record hands-free! |
| **`L`** | **Lighting Toggle** | Instantly switches between **Midnight Obsidian** (deep black & cyan glow) and **Golden Hour** (champagne sunset). |
| **`C`** | **3D Camera View** | Cycles between **Default Elevation**, **Penthouse Spire**, and **Dramatic Low Angle**. |
| **`M`** | **Web Audio Sound** | Toggles procedural luxury ambient drone synthesizer & interactive micro-click audio (no MP3 audio files needed!). |

---

## 🎙️ 30-Second Voiceover Script

> **[0:00 - 0:04] The Hook:**  
> *"Most business websites look like they were designed in 2012. We decided to change that."*  
> *(Action: Press `R` or swipe trackpad to rotate the 3D tower)*
> 
> **[0:04 - 0:11] The Build Showcase:**  
> *"This is a 3D architectural showcase we engineered at Yuvathy Technologies—real-time WebGL, interactive CAD floorplans, and zero lag."*  
> *(Action: Show the blueprint hotspot inspection and floorplan switch)*
> 
> **[0:11 - 0:21] The Offer & Challenge:**  
> *"To demonstrate what modern web engineering can do for real businesses, we are building 10 custom, high-end websites completely free for 10 growing brands."*
> 
> **[0:21 - 0:30] Call to Action (CTA):**  
> *"If your company is ready for a modern upgrade, drop your business name and comment **WEBSITE** below. We're picking business #1 directly from the comments of this reel!"*

---

## 🤖 Lead Capture & ManyChat Automation Setup

To avoid drowning in manual DMs and filter out freebie-seekers:
1. Connect `@yuvathy.in` to **ManyChat** (or Meta Business Suite automated response).
2. Set up trigger: **User comments "WEBSITE" on the reel**.
3. Automated DM response:
   > *"Hey [Name]! 👋 We saw your comment on our 3D showcase reel. We're selecting 10 registered businesses and brands to build custom modern websites for.*  
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
├── index.html              # Master semantic HTML5 showcase entry point
├── README.md               # Filming guide, hotkeys, script, and architecture
├── css/
│   ├── variables.css       # Obsidian luxury color tokens, typography & glows
│   ├── base.css            # Ambient lighting orbs, cyber grid & custom cursor
│   └── components.css      # 3D HUD, floorplan configurator & EstateOS cards
└── js/
    ├── three-scene.js      # Procedural WebGL skyscraper, stardust particles & lights
    ├── floorplan.js        # Interactive CAD blueprint with glowing hotspots
    ├── audio.js            # Web Audio API luxury ambient synthesizer
    ├── reel-tour.js        # Cinematic 28s automated scroll & camera director
    └── main.js             # App lifecycle, modal, and event coordinator
```
