/* ==========================================================================
   LUMINA VILLA - MINIMALIST 3D ARCHITECTURAL FLYTHROUGH ENGINE
   Supports Seamless Switching Between Curated Architectural Estates
   ========================================================================== */

const ESTATES_CATALOG = {
  promontory: {
    id: 'promontory',
    name: 'The Promontory Villa',
    location: 'Pacific Palisades, California',
    price: '$34,500,000 USD / ₹285 Cr',
    carpetArea: '14,500 SQ. FT.',
    bedsBaths: '5 Suites • 7 Baths',
    lotSize: '1.8 Acres Oceanfront',
    structure: 'Monolithic Concrete & Steel',
    scenes: [
      {
        num: '01 / FACADE',
        title: 'The Monolithic Arrival',
        specs: '14,500 SQ. FT. • BOARD-FORMED CONCRETE & GLASS',
        desc: 'Pre-stressed concrete cantilevered wings hovering 14ft above dark granite reflection pools, anchored by an architectural 12-ft bronze pivot entryway.',
        src: 'assets/exterior-arrival.jpg'
      },
      {
        num: '02 / GREAT ROOM',
        title: 'The Great Salon & Hearth',
        specs: '24-FT CEILINGS • HONED ROMAN TRAVERTINE',
        desc: 'Floor-to-ceiling motorized glass pocket walls retract completely, merging formal living with the Pacific horizon beside an 8-ft floating linear hearth.',
        src: 'assets/great-room.jpg'
      },
      {
        num: '03 / HORIZON POOL',
        title: 'The Infinity Edge Terrace',
        specs: '65-FT ZERO-EDGE POOL • SUNKEN FIRE LOUNGE',
        desc: 'A cantilevered saline pool jutting into the sunset horizon, featuring a floating volcanic stone fire bowl and sunken radiant conversation lounge.',
        src: 'assets/infinity-pool.jpg'
      },
      {
        num: '04 / MASTER SUITE',
        title: 'The Master Sky Sanctuary',
        specs: '1,400 SQ. FT. PRIVATE AERIE • 270° CORNER GLASS',
        desc: 'Frameless corner glass walls open to twilight sea views, flanked by custom fluted white oak acoustic millwork and integrated EstateOS environmental controls.',
        src: 'assets/master-suite.jpg'
      }
    ]
  },
  alpine: {
    id: 'alpine',
    name: 'The Forest Glass Pavilion',
    location: 'Aspen Forest Reserve, Colorado',
    price: '$22,800,000 USD / ₹190 Cr',
    carpetArea: '11,200 SQ. FT.',
    bedsBaths: '4 Suites • 5 Baths',
    lotSize: '3.4 Acres Evergreen Forest',
    structure: 'Dark Architectural Steel & Cedar',
    scenes: [
      {
        num: '01 / FOREST ARRIVAL',
        title: 'The Pine Canopy Pavilion',
        specs: '11,200 SQ. FT. • MINIMALIST BLACK STEEL & GLASS',
        desc: 'A floating black steel pavilion set among misty alpine evergreens, featuring wrap-around dark cedar decks and natural stone reflection waters.',
        src: 'assets/alpine-exterior.jpg'
      },
      {
        num: '02 / LIVING ATRIUM',
        title: 'The Suspended Hearth Atrium',
        specs: 'TIMBER SLAT CEILING • FLOATING STEEL FIREPLACE',
        desc: 'Floor-to-ceiling glass showcases towering pine trees, centered around a sculptural suspended steel hearth and warm acoustic cedar ceiling slats.',
        src: 'assets/alpine-living.jpg'
      },
      {
        num: '03 / CEDAR SPA',
        title: 'The Alpine Infinity Spa',
        specs: 'HEATED BLACK GRANITE SPA • HEATED CEDAR DECK',
        desc: 'A cantilevered hot spring infinity spa overlooking misty valley trees, with integrated geothermal water heating and warm recessed step illumination.',
        src: 'assets/alpine-pool.jpg'
      },
      {
        num: '04 / CANOPY SUITE',
        title: 'The Forest Master Sanctuary',
        specs: 'LOW-PROFILE WALNUT BED • PRIVATE WOOD STOVE',
        desc: 'Frameless glass dissolves into the forest canopy, complemented by dark cedar architectural partitions, a private hearth, and heated concrete floors.',
        src: 'assets/alpine-bedroom.jpg'
      }
    ]
  }
};

class VillaTourEngine {
  constructor() {
    this.canvas = document.getElementById('tour-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.currentEstateKey = 'promontory';
    this.currentSceneIndex = 0;
    this.scrollProgress = 0;
    this.images = [];
    this.imagesLoaded = 0;

    // Mouse Parallax values with smooth inertia
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.currentTiltX = 0;
    this.currentTiltY = 0;

    // Minimal Indicators
    this.indicatorZone = document.querySelector('.indicator-zone');
    this.indicatorTitle = document.querySelector('.indicator-title');
    this.indicatorSpecs = document.querySelector('.indicator-specs');
    this.estateSwitchButtons = document.querySelectorAll('.estate-switch-btn');

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.loadEstate(this.currentEstateKey);
    this.setupEventListeners();
    this.setupEstateSwitcher();
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

  loadEstate(estateKey) {
    const estate = ESTATES_CATALOG[estateKey];
    if (!estate) return;

    this.currentEstateKey = estateKey;
    this.images = [];
    this.imagesLoaded = 0;

    // Preload estate scenes
    estate.scenes.forEach((scene, index) => {
      const img = new Image();
      img.src = scene.src;
      img.onload = () => {
        this.imagesLoaded++;
        if (this.imagesLoaded === estate.scenes.length) {
          this.renderScene(0, 0);
          this.updateHUD(0);
        }
      };
      this.images[index] = img;
    });

    // Update editorial cards on page
    this.updatePageContent(estate);
  }

  setupEstateSwitcher() {
    this.estateSwitchButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const estateKey = e.currentTarget.getAttribute('data-estate');
        if (estateKey && estateKey !== this.currentEstateKey) {
          if (window.luminaAudio) window.luminaAudio.playClick();
          
          this.estateSwitchButtons.forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');

          this.loadEstate(estateKey);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  updatePageContent(estate) {
    const triggers = document.querySelectorAll('.tour-section-trigger');
    triggers.forEach((trigger, idx) => {
      const scene = estate.scenes[idx];
      if (!scene) return;

      const h2 = trigger.querySelector('h2');
      const p = trigger.querySelector('p');
      const eyebrow = trigger.querySelector('.eyebrow');

      if (h2) h2.textContent = scene.title;
      if (p) p.textContent = scene.desc;
      if (eyebrow) eyebrow.textContent = `${estate.name.toUpperCase()} • ${scene.num}`;

      // Update estate spec row if present
      const areaEl = trigger.querySelector('.spec-val-area');
      const bedsEl = trigger.querySelector('.spec-val-beds');
      const priceEl = trigger.querySelector('.spec-val-price');
      if (areaEl) areaEl.textContent = estate.carpetArea;
      if (bedsEl) bedsEl.textContent = estate.bedsBaths;
      if (priceEl) priceEl.textContent = estate.price;
    });

    // Update Modal Acquisition Title
    const modalInput = document.getElementById('vip-estate-input');
    if (modalInput) {
      modalInput.value = `${estate.name} (${estate.price})`;
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.renderScene(this.currentSceneIndex, 0);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      this.targetTiltX = this.mouseX * 16;
      this.targetTiltY = this.mouseY * 10;
    });

    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  handleScroll() {
    const track = document.getElementById('scroll-track');
    if (!track) return;

    const totalHeight = track.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;

    const progress = Math.max(0, Math.min(1, currentScroll / totalHeight));
    this.scrollProgress = progress;

    const estate = ESTATES_CATALOG[this.currentEstateKey];
    if (!estate) return;

    const floatScene = progress * (estate.scenes.length - 1);
    const sceneIndex = Math.min(estate.scenes.length - 2, Math.floor(floatScene));
    const sceneTransitionProgress = floatScene - sceneIndex;

    this.currentSceneIndex = Math.round(floatScene);
    this.renderScene(sceneIndex, sceneTransitionProgress);
    this.updateHUD(this.currentSceneIndex);
  }

  renderScene(fromIdx, transitionProgress) {
    const estate = ESTATES_CATALOG[this.currentEstateKey];
    if (!estate || this.images.length < estate.scenes.length) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const fromImg = this.images[fromIdx];
    const toIdx = Math.min(estate.scenes.length - 1, fromIdx + 1);
    const toImg = this.images[toIdx];

    // Smooth forward push in 3D
    const baseScaleFrom = 1.0 + (transitionProgress * 0.16);
    const baseScaleTo = 1.22 - (transitionProgress * 0.22);

    this.ctx.save();
    this.ctx.globalAlpha = 1.0 - transitionProgress;
    this.drawCoverImage(fromImg, baseScaleFrom, this.currentTiltX, this.currentTiltY);
    this.ctx.restore();

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
    const estate = ESTATES_CATALOG[this.currentEstateKey];
    if (!estate) return;

    const scene = estate.scenes[sceneIdx];
    if (!scene) return;

    if (this.indicatorZone) this.indicatorZone.textContent = scene.num;
    if (this.indicatorTitle) this.indicatorTitle.textContent = scene.title;
    if (this.indicatorSpecs) this.indicatorSpecs.textContent = scene.specs;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.08;
    this.currentTiltY += (this.targetTiltY - this.currentTiltY) * 0.08;

    const estate = ESTATES_CATALOG[this.currentEstateKey];
    if (estate) {
      const floatScene = this.scrollProgress * (estate.scenes.length - 1);
      const sceneIndex = Math.min(estate.scenes.length - 2, Math.floor(floatScene));
      const transitionP = floatScene - sceneIndex;
      this.renderScene(sceneIndex, transitionP);
    }
  }
}

window.VillaTourEngine = VillaTourEngine;
