/* ==========================================================================
   LUMINA VILLA - 3D ARCHITECTURAL FLYTHROUGH SCROLLYTELLING ENGINE
   Continuous 3D Camera Flythrough Through Actual Luxury Residence
   ========================================================================== */

const VILLA_SCENES = [
  {
    id: 'exterior-arrival',
    num: 'ZONE 01',
    name: 'The Monolithic Arrival',
    specs: '14,500 SQ. FT. ESTATE • MONOLITHIC CONCRETE & GLASS',
    src: 'assets/exterior-arrival.jpg',
    camX: 25,
    camY: 55,
    camAngle: -25,
    hotspots: [
      { top: '38%', left: '42%', title: 'Cantilevered Upper Wing', desc: 'Pre-stressed post-tensioned concrete structural pavilion floating 14ft without columns.', tag: 'STRUCTURAL ENGINEERING' },
      { top: '78%', left: '48%', title: 'Reflective Mirror Pool', desc: 'Dark granite infinity reflection pool mirroring the evening sky and architectural facade.', tag: 'WATER FEATURE' },
      { top: '65%', left: '72%', title: 'Biometric Access Pivot', desc: 'Custom 12-ft architectural bronze pivot door with EstateOS biometric token sync.', tag: 'ESTATEOS SMART ACCESS' }
    ]
  },
  {
    id: 'great-room',
    num: 'ZONE 02',
    name: 'The Great Salon & Hearth',
    specs: '24-FT CEILINGS • ITALIAN TRAVERTINE • LINEAR FIREPLACE',
    src: 'assets/great-room.jpg',
    camX: 50,
    camY: 45,
    camAngle: 0,
    hotspots: [
      { top: '62%', left: '55%', title: 'Floating Linear Hearth', desc: 'Custom 8-foot ethanol linear fireplace set in raw board-formed concrete wall.', tag: 'ARCHITECTURAL HEARTH' },
      { top: '48%', left: '18%', title: 'Motorized Glass Pocket Doors', desc: 'Triple-track zero-threshold sliding glass walls that pocket into walls completely.', tag: 'INDOOR-OUTDOOR LIVING' },
      { top: '85%', left: '40%', title: 'Honed Roman Travertine', desc: 'Continuous indoor-to-outdoor slab stone with radiant hydrological heating.', tag: 'FINISHES & TEXTURES' }
    ]
  },
  {
    id: 'infinity-pool',
    num: 'ZONE 03',
    name: 'The Horizon Infinity Terrace',
    specs: '65-FT ZERO-EDGE POOL • SUNKEN FIRE LOUNGE • OCEAN VISTA',
    src: 'assets/infinity-pool.jpg',
    camX: 75,
    camY: 50,
    camAngle: 35,
    hotspots: [
      { top: '68%', left: '35%', title: 'Submerged Fire Bowl', desc: 'Cast volcanic stone fire bowl rising from pool surface with automated flame control.', tag: 'BESPOKE FIRE ELEMENT' },
      { top: '65%', left: '80%', title: 'Sunken Outdoor Salon', desc: 'Custom upholstered banquettes with integrated radiant seat heaters and ambient LEDs.', tag: 'ENTERTAINING LOUNGE' },
      { top: '55%', left: '20%', title: 'Zero-Edge Horizon Spillage', desc: 'Unbroken water weir visually merging the infinity pool with the Pacific Ocean.', tag: 'HYDRAULIC POOL DESIGN' }
    ]
  },
  {
    id: 'master-suite',
    num: 'ZONE 04',
    name: 'The Master Sky Sanctuary',
    specs: '1,400 SQ. FT. PRIVATE AERIE • CORNER HORIZON GLASS',
    src: 'assets/master-suite.jpg',
    camX: 45,
    camY: 20,
    camAngle: -45,
    hotspots: [
      { top: '42%', left: '22%', title: 'Frameless Corner Glazing', desc: 'Butt-glazed structural glass corner offering unobstructed 270° twilight sea horizon.', tag: 'GLAZING ARCHITECTURE' },
      { top: '68%', left: '75%', title: 'Fluted White Oak Paneling', desc: 'Acoustic architectural millwork with concealed flush doors and integrated warm lighting.', tag: 'BESPOKE MILLWORK' },
      { top: '72%', left: '60%', title: 'Cantilevered Platform Bed', desc: 'Low-profile solid walnut bed with integrated wireless charging and EstateOS touch panel.', tag: 'SMART BEDROOM' }
    ]
  }
];

class VillaTourEngine {
  constructor() {
    this.canvas = document.getElementById('tour-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.currentSceneIndex = 0;
    this.scrollProgress = 0;
    this.images = [];
    this.imagesLoaded = 0;

    // Mouse Parallax values with damping
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.currentTiltX = 0;
    this.currentTiltY = 0;

    // HUD Elements
    this.badgeRoomNumber = document.querySelector('.tour-location-badge .room-number');
    this.badgeRoomName = document.querySelector('.tour-location-badge .room-name');
    this.badgeRoomSpecs = document.querySelector('.tour-location-badge .room-specs');
    this.minimapCam = document.getElementById('minimap-cam');
    this.quickNavButtons = document.querySelectorAll('.room-nav-btn');
    this.hotspotsLayer = document.getElementById('hotspots-layer');

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.preloadImages();
    this.setupEventListeners();
    this.setupQuickNav();
    this.animate();
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * Math.min(window.devicePixelRatio, 2);
    this.canvas.height = this.height * Math.min(window.devicePixelRatio, 2);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
  }

  preloadImages() {
    VILLA_SCENES.forEach((scene, index) => {
      const img = new Image();
      img.src = scene.src;
      img.onload = () => {
        this.imagesLoaded++;
        if (this.imagesLoaded === VILLA_SCENES.length) {
          this.renderScene(0, 0);
          this.updateHUD(0);
        }
      };
      this.images[index] = img;
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.renderScene(this.currentSceneIndex, 0);
    });

    // Mouse trackpad parallax
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      this.targetTiltX = this.mouseX * 18;
      this.targetTiltY = this.mouseY * 12;
    });

    // Scroll synchronization
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  setupQuickNav() {
    this.quickNavButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sceneIdx = parseInt(e.currentTarget.getAttribute('data-scene-index'), 10);
        if (!isNaN(sceneIdx)) {
          this.jumpToScene(sceneIdx);
        }
      });
    });
  }

  jumpToScene(sceneIdx) {
    const trigger = document.querySelectorAll('.tour-section-trigger')[sceneIdx];
    if (trigger) {
      trigger.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleScroll() {
    const track = document.getElementById('scroll-track');
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const totalHeight = track.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;

    const progress = Math.max(0, Math.min(1, currentScroll / totalHeight));
    this.scrollProgress = progress;

    // Determine current scene index (0 to 3)
    const floatScene = progress * (VILLA_SCENES.length - 1);
    const sceneIndex = Math.min(VILLA_SCENES.length - 2, Math.floor(floatScene));
    const sceneTransitionProgress = floatScene - sceneIndex;

    this.currentSceneIndex = Math.round(floatScene);
    this.renderScene(sceneIndex, sceneTransitionProgress);
    this.updateHUD(this.currentSceneIndex);
  }

  renderScene(fromIdx, transitionProgress) {
    if (this.images.length < VILLA_SCENES.length) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const fromImg = this.images[fromIdx];
    const toIdx = Math.min(VILLA_SCENES.length - 1, fromIdx + 1);
    const toImg = this.images[toIdx];

    // Camera Push Scale: Simulates flying forward into the space
    const baseScaleFrom = 1.0 + (transitionProgress * 0.18);
    const baseScaleTo = 1.25 - (transitionProgress * 0.25);

    // Draw 'from' scene with forward push
    this.ctx.save();
    this.ctx.globalAlpha = 1.0 - transitionProgress;
    this.drawCoverImage(fromImg, baseScaleFrom, this.currentTiltX, this.currentTiltY);
    this.ctx.restore();

    // Cross-fade 'to' scene pushing into the next room
    if (transitionProgress > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = transitionProgress;
      this.drawCoverImage(toImg, baseScaleTo, this.currentTiltX, this.currentTiltY);
      this.ctx.restore();
    }
  }

  drawCoverImage(img, scale, tiltX, tiltY) {
    if (!img || !img.complete) return;

    const imgAspect = img.width / img.height;
    const screenAspect = this.width / this.height;

    let drawW, drawH, drawX, drawY;

    if (screenAspect > imgAspect) {
      drawW = this.width * scale;
      drawH = (this.width / imgAspect) * scale;
    } else {
      drawH = this.height * scale;
      drawW = (this.height * imgAspect) * scale;
    }

    drawX = (this.width - drawW) / 2 + tiltX;
    drawY = (this.height - drawH) / 2 + tiltY;

    this.ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  updateHUD(sceneIdx) {
    const scene = VILLA_SCENES[sceneIdx];
    if (!scene) return;

    // Update Room Badge Text
    if (this.badgeRoomNumber) this.badgeRoomNumber.textContent = scene.num;
    if (this.badgeRoomName) this.badgeRoomName.textContent = scene.name;
    if (this.badgeRoomSpecs) this.badgeRoomSpecs.textContent = scene.specs;

    // Update QuickNav active button
    this.quickNavButtons.forEach(btn => {
      const idx = parseInt(btn.getAttribute('data-scene-index'), 10);
      if (idx === sceneIdx) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Minimap Camera Indicator
    if (this.minimapCam) {
      this.minimapCam.style.transform = `translate(${scene.camX}px, ${scene.camY}px) rotate(${scene.camAngle}deg)`;
    }

    // Render Hotspots for the current scene
    this.renderHotspots(scene);
  }

  renderHotspots(scene) {
    if (!this.hotspotsLayer) return;

    let markup = '';
    scene.hotspots.forEach(spot => {
      markup += `
        <div class="live-hotspot" style="top: ${spot.top}; left: ${spot.left};">
          <div class="hotspot-beacon">
            <i class="ri-add-line"></i>
          </div>
          <div class="hotspot-card">
            <div class="spec-tag">${spot.tag}</div>
            <h4>${spot.title}</h4>
            <p>${spot.desc}</p>
          </div>
        </div>
      `;
    });

    this.hotspotsLayer.innerHTML = markup;

    // Audio on hotspot hover
    const hotspots = this.hotspotsLayer.querySelectorAll('.live-hotspot');
    hotspots.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.luminaAudio) window.luminaAudio.playHover();
      });
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Inertia damping on parallax tilt
    this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.08;
    this.currentTiltY += (this.targetTiltY - this.currentTiltY) * 0.08;

    // Continuous smooth redraw
    const floatScene = this.scrollProgress * (VILLA_SCENES.length - 1);
    const sceneIndex = Math.min(VILLA_SCENES.length - 2, Math.floor(floatScene));
    const transitionP = floatScene - sceneIndex;

    this.renderScene(sceneIndex, transitionP);
  }
}

window.VillaTourEngine = VillaTourEngine;
